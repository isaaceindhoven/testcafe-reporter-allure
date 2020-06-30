/* eslint-disable no-console */
const createTestCafe = require('testcafe');
/* eslint-disable-next-line import/no-unresolved */
const allureReporter = require('../dist');
/* eslint-disable-next-line import/no-unresolved */
const { reporterConfig } = require('../dist/utils');

let testcafe = null;

createTestCafe()
  .then((tc) => {
    testcafe = tc;
    const runner = testcafe.createRunner();
    const browsers = process.env.TESTCAFE_BROWSER || 'chrome:headless';

    return runner
      .src(['tests/e2e/*.ts'])
      .browsers(browsers)
      .reporter(allureReporter)
      .tsConfigPath('tsconfig.test.json')
      .screenshots({
        path: reporterConfig.SCREENSHOT_DIR,
        takeOnFails: true,
      })
      .concurrency(reporterConfig.CONCURRENCY)
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
