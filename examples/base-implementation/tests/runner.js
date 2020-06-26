/* eslint-disable no-console,import/no-extraneous-dependencies */
const createTestCafe = require('testcafe');
/* eslint-disable-next-line import/no-unresolved */
const allureReporter = require('testcafe-reporter-allure');
/* eslint-disable-next-line import/no-unresolved */
const { reporterConfig } = require('testcafe-reporter-allure/dist/utils');

let testcafe = null;

createTestCafe()
  .then((tc) => {
    testcafe = tc;
    const runner = testcafe.createRunner();
    const browser = process.env.TESTCAFE_BROWSER || 'chrome:headless';

    console.log(`Using browser: ${browser}`);

    return runner
      .src(['tests/e2e/*.ts'])
      .browsers(browser)
      .reporter(allureReporter)
      .tsConfigPath('tsconfig.json')
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
