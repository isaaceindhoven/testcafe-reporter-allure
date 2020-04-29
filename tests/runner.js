/* eslint-disable no-console */
import createTestCafe from 'testcafe';
/* eslint-disable-next-line import/no-unresolved */
import * as isaacReporter from '../dist/index';

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
    console.log(error);
    testcafe.close();
  });
