import fs from 'fs-promise';
import glob from 'glob';
import isLoaderFile from './lib/isLoaderFile';

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
      if (isLoaderFile(content)) {
        loaderFiles.add(file);
      }
    }
  }));
  return [...loaderFiles];
}
