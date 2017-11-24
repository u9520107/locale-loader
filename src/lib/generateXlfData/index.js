import path from 'path';
import xml from 'xml-js';

export default function generateXlfData({
  rawData,
  sourceLocale,
  supportedLocales,
  sourceFolder,
  exportType,
}) {
  // console.log(JSON.stringify(rawData, null, 2));
  const jsonData = {};
  const allLocales = supportedLocales.filter(locale => locale !== sourceLocale);

  allLocales.forEach((locale) => {
    jsonData[locale] = {
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
          const exportKeys = exportType.toLowerCase() === 'full' ?
            keys.slice() :
            keys.filter(key => (!targetFile || !targetFile.data[key]));

          if (exportKeys.length) {
            const data = {
              _attributes: {
                original,
                'source-language': sourceLocale,
                'target-language': locale,
                datatype: 'plaintext',
              },
              body: {
                'trans-unit': exportKeys.map(key => ({
                  _attributes: {
                    id: `[${key}]`,
                  },
                  source: {
                    _text: sourceFile.data[key].value,
                  },
                  target: {
                    _text: (targetFile && targetFile.data[key] && targetFile.data[key].value) ||
                    sourceFile.data[key].value,
                  },
                })),
              },
            };

            if (!jsonData[locale].xliff.file) {
              jsonData[locale].xliff.file = [];
            }
            jsonData[locale].xliff.file.push(data);
          }
        }
      });
    }
  });
  const xlfData = {};
  allLocales.forEach((locale) => {
    xlfData[locale] = xml.json2xml(jsonData[locale], { compact: true, spaces: 4 });
  });
  return xlfData;
}
