import through from 'through2';
import fs from 'fs-promise';
import path from 'path';
import isLocaleFile from './lib/isLocaleFile';
import generateLoader from './generateLoader';
import loaderRegExp from './loaderRegExp';
import noChunkRegExp from './noChunkRegExp';

export default function transformLocaleLoader({
  noChunk = false,
} = {}) {
  return through.obj(async function transform(file, enc, done) {
    const content = file.contents.toString(enc);
    if (loaderRegExp.test(content)) {
      const folderPath = path.dirname(file.path);
      const files = (await fs.readdir(folderPath)).filter(isLocaleFile);
      const loader = generateLoader({
        files,
        noChunk: noChunk || noChunkRegExp.test(content),
      });
      file.contents = new Buffer(loader, 'utf8');
    }
    this.push(file);
    done();
  });
}
