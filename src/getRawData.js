import fs from 'fs-promise';
import path from 'path';
import glob from 'glob';
import { parse, tokTypes } from 'babylon';
import isLocaleFile from './isLocaleFile';
import loaderRegExp from './loaderRegExp';
import formatLocale from './formatLocale';

export async function getLoaderFiles(fileList) {
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

export function parseLine(tokens, startingIdx) {
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

export async function extractData(localeFile) {
  const content = await fs.readFile(localeFile, 'utf8');
  const parsed = parse(content, { sourceType: 'module' });
  let idx = 0;
  const len = parsed.tokens.length;
  let capturing = false;
  const data = {};
  let dataStartIndex = null;
  let dataEndIndex = null;
  while (idx < len && idx !== -1) {
    const token = parsed.tokens[idx];
    if (
      token.type === tokTypes._export &&
      parsed.tokens[idx + 1].type === tokTypes._default &&
      parsed.tokens[idx + 2].type === tokTypes.braceL
    ) {
      dataStartIndex = parsed.tokens[idx + 2].end;
      capturing = true;
      idx += 3;
    } else if (capturing) {
      if (token.type === tokTypes.braceR) {
        dataEndIndex = token.start;
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
    dataStartIndex,
    dataEndIndex,
  };
}

export async function getLocaleData({ folderPath, sourceLocale, supportedLocales }) {
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

export default async function getRawData({
  sourceFolder,
  sourceLocale,
  supportedLocales,
}) {
  const fileList = await new Promise((resolve, reject) => {
    glob(`${sourceFolder}/**`, (err, m) => {
      if (err) {
        return reject(err);
      }
      return resolve(m);
    });
  });
  const loaderFiles = await getLoaderFiles(fileList);
  const rawData = {};
  await Promise.all(loaderFiles.map(async (f) => {
    const folderPath = path.resolve(path.dirname(f));
    rawData[folderPath] = await getLocaleData({
      folderPath,
      sourceLocale,
      supportedLocales,
    });
  }));
  return rawData;
}
