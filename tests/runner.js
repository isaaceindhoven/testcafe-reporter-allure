/* eslint-disable no-console */
const createTestCafe = require('testcafe');
/* eslint-disable-next-line import/no-unresolved */
const isaacReporter = require('../dist/index');
/* eslint-disable-next-line import/no-unresolved */
const { reporterConfig } = require('../dist/index');

let testcafe = null;

console.log(isaacReporter);
console.log(reporterConfig);

createTestCafe()
  .then((tc) => {
    testcafe = tc;
    const runner = testcafe.createRunner();

    return runner
      .src(['tests/e2e/*.ts'])
      .browsers('firefox:headless')
      .reporter(isaacReporter)
      .tsConfigPath('tsconfig.test.json')
      .screenshots({
        path: reporterConfig.SCREENSHOT_DIR,
        takeOnFails: true,
      })
      .run({
        quarantineMode: reporterConfig.ENABLE_QUARANTINE,
        disableScreenshots: !reporterConfig.ENABLE_SCREENSHOTS,
      });
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
    console.log(error);
    // throw error;
  });
