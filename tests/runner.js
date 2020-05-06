/* eslint-disable no-console */
const createTestCafe = require('testcafe');
/* eslint-disable-next-line import/no-unresolved */
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
    testcafe.close();

    if (failed > 0) {
      throw new Error(`TestCafé tests failed: ${failed}`);
    }
  })
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  .catch((error) => {
    testcafe.close();
    // throw error;
  });
