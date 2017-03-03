import testVars from './testVars';

const value = 'testValue';
export default {
  test: 'Test "test" String',
  test2: `${value}`,
  test3: `hello
  world`,
  [testVars.item]: 'Item',
};
