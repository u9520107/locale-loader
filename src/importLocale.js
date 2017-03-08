import fs from 'fs-promise';
import path from 'path';
import xml from 'xml-js';

import getRawData from './getRawData';
import {
  defaultSupportedLocales,
  defaultSourceLocale,
  defaultSourceFolder,
  defaultLocalizationFolder,
} from './defaults';

function extractKey(str) {
  return str.substring(1, str.length - 1);
}

function extractXlfData({ locale, content }) {
  const data = xml.xml2js(content, { compact: true });
  const output = {};
  if (
    data.xliff &&
    data.xliff.file
  ) {
    const files = Array.isArray(data.xliff.file) ?
      data.xliff.file :
      [data.xliff.file];
    files.forEach((fileData) => {
      if (
        fileData._attributes &&
        fileData._attributes['target-language'] === locale &&
        fileData.body &&
        fileData.body['trans-unit']
      ) {
        const fileName = fileData._attributes.original;
        output[fileName] = {};
        const units = Array.isArray(fileData.body['trans-unit']) ?
          fileData.body['trans-unit'] :
          [fileData.body['trans-unit']];
        units.forEach((unit) => {
          if (
            unit._attributes &&
            unit._attributes.id &&
            unit.target &&
            unit.target._text
          ) {
            output[fileName][extractKey(unit._attributes.id)] = {
              value: JSON.parse(`"${unit.target._text}"`),
              isTemplate: unit._attributes.template === 'true',
            };
          }
        });
      }
    });
  }
  return output;
}

async function readXlf({
  localizationFolder,
  supportedLocales,
}) {
  const output = {};
  await Promise.all(supportedLocales.map(async (locale) => {
    const fileName = `${locale}.xlf`;
    const filePath = path.resolve(localizationFolder, fileName);
    if ((await fs.exists(filePath)) && (await fs.stat(filePath)).isFile()) {
      const content = await fs.readFile(filePath, 'utf8');
      output[locale] = extractXlfData({ locale, content });
    }
  }));
  return output;
}

function generateMergedContent({
  content,
  dataStartIndex,
  dataEndIndex,
  mergedData,
  trailingComma,
}) {
  const startString = content.substring(0, dataStartIndex);
  const endString = content.substring(dataEndIndex);
  const keys = Object.keys(mergedData);
  const lastIdx = keys.length - 1;
  const dataString = keys.map((key, idx) => {
    const comma = (idx < lastIdx || trailingComma) ?
      ',' :
      '';
    const value = mergedData[key].isTemplate ?
      `\`${mergedData[key].value}\`` :
      `'${mergedData[key].value.replace(/'/g, '\\\'')}'`;
    return `  ${key}: ${value}${comma}`;
  }).join('\n');
  return `${startString}\n${dataString}\n${endString}`;
}

async function mergeToFiles({
  rawData,
  translatedData,
  sourceFolder,
  sourceLocale,
  trailingComma,
}) {
  await Promise.all(Object.keys(translatedData).map(async (locale) => {
    await Promise.all(Object.keys(translatedData[locale]).map(async (fileName) => {
      const filePath = path.resolve(sourceFolder, fileName);
      const folderPath = path.dirname(filePath);
      const original = (rawData[folderPath] &&
        rawData[folderPath].files &&
        rawData[folderPath].files[locale] &&
        rawData[folderPath].files[locale].data) || {};

      const translated = translatedData[locale][fileName];
      const mergedData = {
        ...original
      };
      Object.keys(translated).forEach((key) => {
        mergedData[key] = {
          ...translated[key],
          isTemplate: (original[key] && original[key].isTemplate === true) ||
            translated[key].isTemplate === true,
        };
      });
      const mergedContent = generateMergedContent({
        ...rawData[folderPath].files[sourceLocale],
        mergedData,
        trailingComma,
      });
      await fs.writeFile(path.resolve(sourceFolder, fileName), mergedContent);
    }));
  }));
}

async function importLocale({
  sourceFolder = defaultSourceFolder,
  localizationFolder = defaultLocalizationFolder,
  sourceLocale = defaultSourceLocale,
  supportedLocales = defaultSupportedLocales,
  trailingComma = true,
} = {}) {
  const rawData = await getRawData({
    sourceFolder,
    sourceLocale,
    supportedLocales,
  });
  const translatedData = await readXlf({
    localizationFolder,
    supportedLocales,
  });
  await mergeToFiles({
    rawData,
    translatedData,
    sourceFolder,
    sourceLocale,
    trailingComma,
  });
}

export default importLocale;

