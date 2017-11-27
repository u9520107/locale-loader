import { expect } from 'chai';
import fs from 'fs-extra';
import path from 'path';
import dedent from 'dedent';
import { transform } from 'babel-core';
import importLocale from './';
import exportLocale from '../exportLocale';
import defaultConfig from '../../defaultConfig';

const {
  supportedLocales,
  sourceLocale,
} = defaultConfig;

const babelOptions = {
  presets: ['es2015', 'stage-0'],
  plugins: [
    'transform-runtime'
  ],
};

/* global describe it before after beforeEach afterEach */
/* eslint { no-eval: 0} */

const testFolder = './testData';
const localizationFolder = './localization';

async function clean() {
  await fs.emptyDir(testFolder);
  await fs.emptyDir(localizationFolder);
}

async function generateSource() {
  await fs.writeFile(path.resolve(testFolder, 'loadLocale.js'), '/* loadLocale */');
  await fs.writeFile(path.resolve(testFolder, 'en-US.js'), dedent`
    const obj = {
      key: 'testKey',
    };

    export default {
      modern: 'rogue',
      whisky: 'Vault',
      [obj.key]: 'testValue',
    };
  `);
}

describe('importLocale', () => {
  const config = {
    sourceFolder: testFolder,
    supportedLocales: ['en-US', 'en-GB']
  };
  beforeEach(async () => {
    await clean();
    await generateSource();
    await exportLocale(config);
  });
  afterEach(clean);
  it('should import generated xlf files', async () => {
    await importLocale(config);
    const filePath = path.resolve(testFolder, 'en-GB.js');
    expect(await fs.exists(filePath)).to.equal(true);
    const content = await fs.readFile(filePath, 'utf8');
    let json;
    expect(() => {
      json = eval(transform(content, babelOptions).code);
    }).to.not.throw();
    expect(json.modern).to.equal('rogue');
    expect(json.whisky).to.equal('Vault');
    expect(json.testKey).to.equal('testValue');
  });
  it('should generate annotations', async () => {
    await importLocale(config);
    const filePath = path.resolve(testFolder, 'en-GB.js');
    expect(await fs.exists(filePath)).to.equal(true);
    const content = await fs.readFile(filePath, 'utf8');
    expect(content.indexOf("// @key: '[modern]' @source: 'rogue'") > -1).to.equal(true);
    expect(content.indexOf("// @key: '[whisky]' @source: 'Vault'") > -1).to.equal(true);
    expect(content.indexOf("// @key: '[[obj.key]]' @source: 'testValue'") > -1).to.equal(true);
  });
  it('should only import keys that exist in current source', async () => {
    await fs.writeFile(path.resolve(testFolder, 'en-US.js'), dedent`
      const obj = {
        key: 'testKey',
      };

      export default {
        modern: 'rogue',
      };
    `);
    await importLocale(config);
    const filePath = path.resolve(testFolder, 'en-GB.js');
    expect(await fs.exists(filePath)).to.equal(true);
    const content = await fs.readFile(filePath, 'utf8');
    let json;
    expect(() => {
      json = eval(transform(content, babelOptions).code);
    }).to.not.throw();
    expect(json.modern).to.equal('rogue');
    expect(json.whisky).to.equal(undefined);
    expect(json.testKey).to.equal(undefined);
  });
  it('should only import keys where its source value is identical to current source', async () => {
    const xlfPath = path.resolve(localizationFolder, 'en-GB.xlf');
    const xlfContent = await fs.readFile(xlfPath, 'utf8');
    await fs.writeFile(xlfPath, xlfContent.replace(
      '<source>Vault</source',
      '<source>Changed</source>'
    ).replace(
      '<source>testValue</source',
      '<source>testValueChanged</source>'
      ));
    await importLocale(config);
    const filePath = path.resolve(testFolder, 'en-GB.js');
    expect(await fs.exists(filePath)).to.equal(true);
    const content = await fs.readFile(filePath, 'utf8');
    let json;
    expect(() => {
      json = eval(transform(content, babelOptions).code);
    }).to.not.throw();
    expect(json.modern).to.equal('rogue');
    expect(json.whisky).to.equal(undefined);
    expect(json.testKey).to.equal(undefined);
  });
});
