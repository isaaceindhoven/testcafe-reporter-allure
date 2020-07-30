# Configuration

## TestCafé

### CLI

When using TestCafé via the command line, the reporter can be specified by using the `--reporter` option.

```sh
testcafe chrome 'path/to/test/file.js' --reporter allure --screenshots path=allure/screenshots,takeOnFails=true`
```

### API

When using TestCafé via the API, the reporter can be specified by either passing the reporter name or the reporter object in the `reporter()` method within the `runner.js` file.

```js
testCafe
    .createRunner()
    .src(['tests/e2e/*.ts'])
    .browsers('firefox')
    .reporter('allure')
    .run();
```

or

```js
const allureReporter = require('testcafe-reporter-allure');

testCafe
    .createRunner()
    .src(['tests/e2e/*.ts'])
    .browsers('firefox')
    .reporter(allureReporter)
    .run();
```

## Allure

`testcafe-reporter-allure` provides a sensible default for the configuration. However, if a different configuration is needed, this default can be overridden by creating the file `allure.config.js` and/or `allure-categories.config.js` in the root of your project. The `allure.config.js` is for the base configuration options, and the `allure-categories.config.js` is specifically for editing the [categories](https://docs.qameta.io/allure/#_categories) config used by the Allure Commandline to sort the tests based on pattern matching.

An example `allure.config.js`:
```js
module.exports = {
  RESULT_DIR: './allure/allure-results',
  REPORT_DIR: './allure/allure-report',
  SCREENSHOT_DIR: './allure/screenshots',

  CLEAN_RESULT_DIR: true,
  CLEAN_REPORT_DIR: true,
  CLEAN_SCREENSHOT_DIR: true,

  ENABLE_SCREENSHOTS: true,
  ENABLE_QUARANTINE: false,
  ENABLE_LOGGING: false,
  CONCURRENCY: 1,

  META: {
    SEVERITY: 'Normal',
    ISSUE_URL: 'https://jira.example.nl/browse/',
  },
  LABEL: {
    ISSUE: 'JIRA Issue',
    FLAKY: 'Flaky test',
    SCREENSHOT_MANUAL: 'Screenshot taken manually',
    SCREENSHOT_ON_FAIL: 'Screenshot taken on fail',
    DEFAULT_STEP_NAME: 'Test step',
  },
};
```

An example `allure-categories.config.js`:
```js
module.exports = [
  {
    name: 'Ignored tests',
    matchedStatuses: [Status.SKIPPED],
  },
  {
    name: 'Product defects',
    matchedStatuses: [Status.FAILED],
    messageRegex: '.*Assertion failed.*',
  },
  {
    name: 'Test defects',
    matchedStatuses: [Status.FAILED],
  },
  {
    name: 'Warnings',
    matchedStatuses: [Status.PASSED],
    messageRegex: '.*Warning.*',
  },
  {
    name: 'Flaky tests',
    matchedStatuses: [Status.PASSED, Status.FAILED],
    messageRegex: '.*Flaky.*',
  },
];
```

## Concurrency and Multi-Browser

The testcafe-allure-reporter supports both TestCafé's concurrency and multi-browser test-run features these can both be set using either the runner.js with the TestCafé API or the TestCafé CLI. Also, the concurrency can be set via the `allure.config.js` file, as seen in the previous chapter.

NOTE: Concurrency regards the number of browser instances opened PER browser. For example, if the concurrency is 5, and both Firefox and Chrome are used, TestCafé will open 5 Firefox and 5 Chrome instances.

With the API in the runner.js, multiple browsers can be set by passing them as an array into the `.browsers()` function. Concurrency can be set by passing a number into the `.concurrency()` function.

```js
const allureReporter = require('testcafe-reporter-allure');

testCafe
    .createRunner()
    .src(['tests/e2e/*.ts'])
    .browsers([firefox:headless, chrome:headless]) // <--
    .reporter(allureReporter)
    .concurrency(1) // <--
    .run();
```

With the CLI multiple browsers can be added to the `testcafe` command separated with a comma without a tag. For example: `testcafe chrome,firefox`. Also all local browsers can be run a once by using the `all` alias instead of seperate browsers.

The concurrency can be set within the commandline with the `-c or --concurrency` tag. For example: `testcafe --concurrency 5`.