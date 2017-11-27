import fs from 'fs-extra';
import path from 'path';
import { parse, tokTypes } from 'babylon';
import isLocaleFile from '../isLocaleFile';
import formatLocale from '../formatLocale';
import getLoaderFiles from '../getLoaderFiles';

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
  do {
    if (
      token.type === tokTypes.backQuote
    ) {
      throw new Error('Template strings are not supported');
    } else {
      valueArray.push(typeof token.value !== 'undefined' ? token.value : token.type.label);
    }
    idx += 1;
    token = tokens[idx];
  } while (token.type !== tokTypes.comma && token.type !== tokTypes.braceR);
  const value = valueArray.join('');
  return {
    key: keyArray.join(''),
    value,
    endIdx: idx,
  };
}

export function extractAnnotations(content) {
  const annotationRegExp = /\/\/ @key: '\[(.*)\]'.*?@source: '(.*)'/g;
  const annotations = new Map();
  let match;
  /* eslint { 'no-cond-assign': 0 } */
  while ((match = annotationRegExp.exec(content)) !== null) {
    annotations.set(match[1], match[2]);
  }
  return {
    content: content.replace(annotationRegExp, ''),
    annotations
  };
}

export async function extractData(localeFile) {
  const {
    content,
    annotations,
  } = extractAnnotations(await fs.readFile(localeFile, 'utf8'));
  const parsed = parse(content, { sourceType: 'module' });
  let idx = 0;
  const len = parsed.tokens.length;
  let capturing = false;
  const data = {};
  let dataStartIndex = null;
  let dataEndIndex = null;
  while (idx < len) {
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
        const { key, value, endIdx } = parseLine(parsed.tokens, idx);
        data[key] = {
          key,
          value,
          source: annotations.get(key),
        };
        if (parsed.tokens[endIdx].type !== tokTypes.braceR) {
          idx = endIdx + 1;
        } else {
          dataEndIndex = parsed.tokens[endIdx].start;
          break;
        }
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
  const loaderFiles = await getLoaderFiles(sourceFolder);
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
