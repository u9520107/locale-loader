import fs from 'fs-promise';
import glob from 'glob';
import loaderRegExp from './loaderRegExp';

export default async function getLoaderFiles(folder) {
  const fileList = await new Promise((resolve, reject) => {
    glob(`${folder}/**`, (err, m) => {
      if (err) {
        return reject(err);
      }
      return resolve(m);
    });
  });
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
