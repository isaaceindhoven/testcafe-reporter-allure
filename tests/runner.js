/* eslint-disable no-console */
const createTestCafe = require('testcafe');
const isaacReporter = require('../dist/index.js');

let testcafe = null;

createTestCafe()
  .then((tc) => {
    testcafe = tc;
    const runner = testcafe.createRunner();

    return runner
      .src(['tests/e2e/*.ts'])
      .browsers('firefox:headless')
      .reporter(isaacReporter)
      .tsConfigPath('tsconfig.test.json')
      .run();
  })
  .then((failed) => {
    console.log(`Tests failed: ${failed}`);
    testcafe.close();
  })
  .catch((error) => {
    console.log(error.message);
    testcafe.close();
  });
