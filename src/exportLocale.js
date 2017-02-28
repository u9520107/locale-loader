// import through from 'through2';
import fs from 'fs-promise';
import path from 'path';
import glob from 'glob';
const babylon = require('babylon'); // for some reason, import syntax result in undefined

import isLocaleFile from './isLocaleFile';
// import generateLoader from './generateLoader';
import loaderRegExp from './loaderRegExp';
// import noChunkRegExp from './noChunkRegExp';
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
    keyArray.push(token.value || token.type.label);
    idx += 1;
    token = tokens[idx];
  } while (token.type !== babylon.tokTypes.colon);
  return [{
    key: keyArray.join(''),
    value: tokens[idx + 1].value,
  }, idx + 3];
}

async function extractData(localeFile) {
  const content = await fs.readFile(localeFile, 'utf8');
  const parsed = babylon.parse(content, { sourceType: 'module' });
  let idx = 0;
  const len = parsed.tokens.length;
  let capturing = false;
  const data = {};
  while (idx < len) {
    const token = parsed.tokens[idx];
    if (
      token.type === babylon.tokTypes._export &&
      parsed.tokens[idx + 1].type === babylon.tokTypes._default &&
      parsed.tokens[idx + 2].type === babylon.tokTypes.braceL
    ) {
      capturing = true;
      idx += 3;
    } else if (capturing) {
      if (token.type === babylon.tokTypes.braceR) {
        break;
      } else {
        const [item, newIdx] = parseLine(parsed.tokens, idx);
        data[item.key] = item.value;
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

async function getLocaleData({ folderPath, sourceLocale, supportedLocales }) {
  const localeFiles = (await fs.readdir(folderPath)).filter(isLocaleFile);
  const localeData = {
    path: folderPath,
    data: {},
  };
  await Promise.all(localeFiles.map(async (file) => {
    const locale = formatLocale(file.replace(/\.(js|json)$/i, ''));
    if (locale === sourceLocale || supportedLocales.indexOf(locale) > -1) {
      localeData.data[locale] = {
        file,
        locale,
        data: await extractData(path.resolve(folderPath, file)),
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
    const g = new glob.Glob(src, (err, m) => {
      if (err) {
        return reject(err);
      }
      return resolve(m);
    });
  });
  const loaderFiles = await getLoaderFiles(fileList);
  const rawData = {};
  await Promise.all(loaderFiles.map(async (f) => {
    const folderPath = path.dirname(f);
    rawData[folderPath] = await getLocaleData({ folderPath, sourceLocale, supportedLocales });
  }));
  console.log(JSON.stringify(rawData, null, 2));
}
export default async function exportLocale({
  src = './src/**/*',
  dest = './build',
  cwd = process.cwd(),
  sourceLocale = 'en-US',
  supportedLocales = ['en-GB', 'en-CA', 'fr-FR', 'fr-CA', 'de-DE'],
} = {}) {
  const rawData = getRawData({
    src,
    sourceLocale,
    supportedLocales,
  });
  console.log(JSON.stringify(rawData, null, 2));

  // const folderPath = path.dirname(file);
  // const files = (await fs.readdir(folderPath)).filter(isLocaleFile);
  // localeFiles.add(...files.map(f => path.resolve(folderPath, f)));

  // const localeData = {}};
  // await Promise.all([...localeFiles].map(async (file) => {
  //   const content = await fs.readFile(file, 'utf8');
  //   const parsed = babylon.parse(content, { sourceType: 'module' });
  //   let idx = 0;
  //   const len = parsed.tokens.length;
  //   let capturing = false;
  //   const data = {};
  //   while (idx < len) {
  //     const token = parsed.tokens[idx];
  //     if (
  //       token.type === babylon.tokTypes._export &&
  //       parsed.tokens[idx + 1].type === babylon.tokTypes._default &&
  //       parsed.tokens[idx + 2].type === babylon.tokTypes.braceL
  //     ) {
  //       capturing = true;
  //       idx += 3;
  //     } else if (capturing) {
  //       if (token.type === babylon.tokTypes.braceR) {
  //         break;
  //       } else {
  //         const [item, newIdx] = parseLine(parsed.tokens, idx);
  //         data[item.key] = item.value;
  //         idx = newIdx;
  //       }
  //     } else {
  //       idx += 1;
  //     }
  //   }
  //   localeData[file] = data;
  // }));
}
