import fs from 'fs-promise';
import generateLoader from './generateLoader';
import isLocaleFile from './lib/isLocaleFile';
import isLoaderFile from './lib/isLoaderFile';

module.exports = function localeLoader(content) {
  const callback = this.async();
  if (isLoaderFile(content)) {
    (async () => {
      const files = (await fs.readdir(this.context)).filter(f => isLocaleFile(f));
      callback(null, generateLoader({
        files,
        chunk: !isLoaderFile.noChunk(content),
      }));
    })();
  } else {
    callback(null, content);
  }
};
