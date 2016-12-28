import fs from 'fs-promise';
import generateLoader from './generateLoader';
import isLocaleFile from './isLocaleFile';

const loaderRegExp = /\/\* ?loadLocale.*?\*\//;
const noChunkRegExp = /\/\* ?loadLocale.*?noChunk.*?\*\//;

module.exports = function localeLoader(content) {
  const callback = this.async();
  if (loaderRegExp.test(content)) {
    (async () => {
      const files = (await fs.readdir(this.context)).filter(f => isLocaleFile(f));
      callback(null, generateLoader({
        files,
        chunk: !noChunkRegExp.test(content),
      }));
    })();
  } else {
    callback(null, content);
  }
};
