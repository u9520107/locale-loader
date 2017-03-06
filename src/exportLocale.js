import fs from 'fs-promise';
import path from 'path';
import glob from 'glob';
import xml from 'xml-js';
import mkdirp from 'mkdirp-promise';
import { parse, tokTypes } from 'babylon';
import isLocaleFile from './isLocaleFile';
import loaderRegExp from './loaderRegExp';
import formatLocale from './formatLocale';


async function getLoaderFiles(fileList) {
  const loaderFiles = new Set();
  await Promise.all(fileList.map(async (file) => {
    if ((await fs.stat(file)).isFile()) {
      const content = await fs.readFile(file, 'utf8');
      if (loaderRegExp.test(content)) {
        loaderFiles.add(file);
      }
    }
  }));
  return [...loaderFiles];
}

function parseLine(tokens, startingIdx) {
  let idx = startingIdx;
  let token = tokens[idx];
  const keyArray = [];
  do {
    keyArray.push(typeof token.value !== 'undefined' ? token.value : token.type.label);
    idx += 1;
    token = tokens[idx];
  } while (token.type !== tokTypes.colon);
  const valueArray = [];
  idx += 1;
  token = tokens[idx];
  let isTemplate = false;
  let inTemplate = false;
  do {
    if (
      token.type === tokTypes.backQuote
    ) {
      isTemplate = true;
      inTemplate = !inTemplate;
    } else {
      valueArray.push(typeof token.value !== 'undefined' ? token.value : token.type.label);
    }
    idx += 1;
    token = tokens[idx];
  } while (token.type !== tokTypes.comma && (inTemplate || token.type !== tokTypes.braceR));
  const value = JSON.stringify(valueArray.join(''));
  return [{
    key: keyArray.join(''),
    value: value.substring(1, value.length - 1),
    isTemplate,
  }, token.type !== tokTypes.braceR ? idx + 1 : -1];
}

async function extractData(localeFile) {
  const content = await fs.readFile(localeFile, 'utf8');
  const parsed = parse(content, { sourceType: 'module' });
  let idx = 0;
  const len = parsed.tokens.length;
  let capturing = false;
  const data = {};
  while (idx < len && idx !== -1) {
    const token = parsed.tokens[idx];
    if (
      token.type === tokTypes._export &&
      parsed.tokens[idx + 1].type === tokTypes._default &&
      parsed.tokens[idx + 2].type === tokTypes.braceL
    ) {
      capturing = true;
      idx += 3;
    } else if (capturing) {
      if (token.type === tokTypes.braceR) {
        break;
      } else {
        const [item, newIdx] = parseLine(parsed.tokens, idx);
        data[item.key] = item;
        idx = newIdx;
      }
    } else {
      idx += 1;
    }
  }
  return {
    content,
    data,
  };
}

function compileFolderData(files) {
  const output = {};
  files.forEach(({ locale, data }) => {
    Object.keys(data).forEach((key) => {
      if (!output[key]) {
        output[key] = {};
      }
      output[key][locale] = data[key];
    });
  });
  return output;
}

async function getLocaleData({ folderPath, sourceLocale, supportedLocales }) {
  const localeFiles = (await fs.readdir(folderPath)).filter(isLocaleFile);
  const localeData = {
    path: folderPath,
    files: {},
  };
  await Promise.all(localeFiles.map(async (file) => {
    const locale = formatLocale(file.replace(/\.(js|json)$/i, ''));
    if (locale === sourceLocale || supportedLocales.indexOf(locale) > -1) {
      localeData.files[locale] = {
        file,
        locale,
        ...(await extractData(path.resolve(folderPath, file))),
      };
    }
  }));
  return localeData;
}

async function getRawData({
  src,
  sourceLocale,
  supportedLocales,
}) {
  const fileList = await new Promise((resolve, reject) => {
    glob(src, (err, m) => {
      if (err) {
        return reject(err);
      }
      return resolve(m);
    });
  });
  const loaderFiles = await getLoaderFiles(fileList);
  const rawData = [];
  await Promise.all(loaderFiles.map(async (f) => {
    const folderPath = path.dirname(f);
    rawData.push(await getLocaleData({ folderPath, sourceLocale, supportedLocales }));
  }));
  return rawData;
}

async function exportXlf({
  rawData,
  sourceLocale,
  supportedLocales,
  dest,
}) {
  // console.log(JSON.stringify(rawData, null, 2));
  const xlfData = {};
  const allLocales = supportedLocales.filter(locale => locale !== sourceLocale);

  allLocales.forEach((locale) => {
    xlfData[locale] = {
      _declaration: {
        _attributes: {
          version: '1.0',
        }
      },
      xliff: {
        _attributes: {
          version: '1.2',
          xmlns: 'urn:oasis:names:tc:xliff:document:1.2',
        },
      },
    };
  });

  rawData.forEach((folderData) => {
    const sourceFile = folderData.files[sourceLocale];
    if (sourceFile) {
      const keys = Object.keys(sourceFile.data);
      supportedLocales.forEach((locale) => {
        if (locale !== sourceLocale) {
          const targetFile = folderData.files[locale];
          const fileName = (targetFile && targetFile.file) || `${locale}.js`;
          const original = path.join(folderData.path, fileName);
          const missingKeys = keys.filter(key => (!targetFile || !targetFile.data[key]));

          if (missingKeys.length) {
            const data = {
              _attributes: {
                original,
                'source-language': sourceLocale,
                'target-language': locale,
                datatype: 'plaintext',
              },
              body: {
                'trans-unit': missingKeys.map(key => ({
                  _attributes: {
                    id: `[${key}]`,
                    template: sourceFile.data[key].isTemplate ? 'true' : 'false',
                  },
                  source: {
                    _text: sourceFile.data[key].value,
                  },
                  target: {
                    _text: sourceFile.data[key].value,
                  },
                })),
              },
            };

            if (!xlfData[locale].xliff.file) {
              xlfData[locale].xliff.file = [];
            }
            xlfData[locale].xliff.file.push(data);
          }
        }
      });
    }
  });
  if (!(await fs.exists(dest))) {
    await mkdirp(dest);
  }
  await Promise.all(allLocales.map(async (locale) => {
    const fileName = path.resolve(dest, `${locale}.xlf`);
    await fs.writeFile(fileName, xml.json2xml(xlfData[locale], { compact: true, spaces: 4 }));
  }));
}

export default async function exportLocale({
  src = './src/**/*',
  dest = './localization',
  sourceLocale = 'en-US',
  supportedLocales = ['en-GB', 'en-CA', 'fr-FR', 'fr-CA', 'de-DE'],
} = {}) {
  const rawData = await getRawData({
    src,
    sourceLocale,
    supportedLocales,
  });
  await exportXlf({
    rawData,
    dest,
    sourceLocale,
    supportedLocales,
  });
}
