import fs from 'fs-promise';
import path from 'path';
import xml from 'xml-js';
import mkdirp from 'mkdirp-promise';
import getRawData from './getRawData';
import {
  defaultSupportedLocales,
  defaultSourceLocale,
  defaultSourceFolder,
  defaultLocalizationFolder,
} from './defaults';

export async function exportXlf({
  rawData,
  sourceLocale,
  supportedLocales,
  sourceFolder,
  localizationFolder,
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

  Object.keys(rawData).forEach((folderPath) => {
    const folderData = rawData[folderPath];
    const sourceFile = folderData.files[sourceLocale];
    if (sourceFile) {
      const keys = Object.keys(sourceFile.data);
      supportedLocales.forEach((locale) => {
        if (locale !== sourceLocale) {
          const targetFile = folderData.files[locale];
          const fileName = (targetFile && targetFile.file) || `${locale}.js`;
          const original = path.relative(
            sourceFolder,
            path.join(folderData.path, fileName),
          );
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
  if (!(await fs.exists(localizationFolder))) {
    await mkdirp(localizationFolder);
  }
  await Promise.all(allLocales.map(async (locale) => {
    const fileName = path.resolve(localizationFolder, `${locale}.xlf`);
    await fs.writeFile(fileName, xml.json2xml(xlfData[locale], { compact: true, spaces: 4 }));
  }));
}

async function exportLocale({
  sourceFolder = defaultSourceFolder,
  localizationFolder = defaultLocalizationFolder,
  sourceLocale = defaultSourceLocale,
  supportedLocales = defaultSupportedLocales,
} = {}) {
  const rawData = await getRawData({
    sourceFolder,
    sourceLocale,
    supportedLocales,
  });
  await exportXlf({
    rawData,
    sourceFolder,
    localizationFolder,
    sourceLocale,
    supportedLocales,
  });
}

export default exportLocale;
