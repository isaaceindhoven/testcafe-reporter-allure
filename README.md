# testcafe-reporter-allure

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This project is an [Allure](http://allure.qatools.ru/) reporter plugin for [TestCafé](https://devexpress.github.io/testcafe/).

The inspiration for this project was its namesake, [testcafe-reporter-allure](https://www.npmjs.com/package/testcafe-reporter-allure), made by azohra-core, making use of the 2.0.0 version of the [allure-js-commons](https://github.com/allure-framework/allure-js/tree/master/packages/allure-js-commons) package.

## Contents
- [Installation](#installation)
- [Using the reporter](#using-the-reporter)
- [Features](#features)
  - [Metadata](#metadata)
  - [Test Steps](#test-steps)
  - [Jenkins](#jenkins)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Installation

This package is namespaced. Therefore the following command can be used to install the reporter in a way that TestCafé can detect it. 
([Related ISSUE](https://github.com/DevExpress/testcafe/issues/4692))

`npm install --save-dev testcafe-reporter-allure@npm:@isaac.frontend/testcafe-reporter-allure`

The [Allure Commandline](https://www.npmjs.com/package/allure-commandline) is needed to convert the Allure-Results into an Allure-Report. This package can be installed with the following command:

`npm install --save-dev allure-commandline`

Quick install of all dependencies:

`npm install --save-dev allure-commandline testcafe testcafe-reporter-allure@npm:@isaac.frontend/testcafe-reporter-allure`

## Using the reporter

The reporter can then be loaded in two separate ways:

When using TestCafé via the command line, the reporter can be specified by using the `--reporter` option.

`testcafe chrome 'path/to/test/file.js' --reporter allure --screenshots path=allure/screenshots,takeOnFails=true`

When using TestCafé via the API, the reporter can be specified by either passing the reporter name or the reporter object in the `reporter()` method within the `runner.js` file.

```
testCafe
    .createRunner()
    .src(['tests/e2e/*.ts'])
    .browsers('firefox')
    .reporter('allure')
    .run();
```

or

```
const allureReporter = require('testcafe-reporter-allure');

testCafe
    .createRunner()
    .src(['tests/e2e/*.ts'])
    .browsers('firefox')
    .reporter(allureReporter)
    .run();
```

After the Allure-Results are generated, the Allure-Report can be built:

`allure generate ./allure/allure-results --clean -o ./allure/allure-report && allure open ./allure/allure-report`

## Features
### Metadata

![Example of the metadata code shown below.](https://raw.githubusercontent.com/isaaceindhoven/testcafe-reporter-allure/master/.github/images/metadata.PNG)

Metadata can be added to a test by using the `meta()` function. The metadata can be added to both the `test` and the `fixture`.

Metadata added to a `fixture` will be inherited by all tests coupled to that fixture to avoid having to declare metadata that is the same for all tests within the fixture multiple times. 

```
test.meta({
  severity: Severity.TRIVIAL,
  issue: 'TEST-ISSUE',
  description: 'An example discription',
  epic: 'Example Epic Ticket',
  feature: 'Example Feature Ticket',
  story: 'Example Story Ticket',
  suite: 'Main Example Group',
  otherMeta: 'Example otherMeta parameter.',
})('Example test with metadata', async (t) => {
  // Test Code
});
```


| Metadata | Description |
| ------------- | ------------- |
| Severity | The severity values are dictated by the [allure-js-commons](https://github.com/allure-framework/allure-js/tree/master/packages/allure-js-commons) package, these values are: `blocker, critical, normal, minor, trivial`;  |
| Issue  | A Jira Issue can be coupled to a test, creating a link within the Allure Report to the Jira Issue page. The URL to the Jira page can be set in the [allure-js-commons](https://github.com/isaaceindhoven/testcafe-reporter-allure#configuration).  |
| Epic, Feature, Story  | To sort the tests based on the `epic`, `feature`, and/or `story`, these metadata options can be used to form a tree structure. The tree is structured as follows: An epic can have multiple features, a feature can have multiple stories, and a story can have multiple tests. |
| Suite  | Within the Allure Report, the tests are organized by `fixture` by default. For a more expansive organization of the tests and fixtures, the `suite` parameter can be set. When the `suite` parameter is set within a `test`, a subcategory is created within the `fixture` that will group all tests that have the same `suite` parameter together. When the `suite` parameter is set within a `fixture`, a parent category is created that will group multiple fixtures that have the same `suite` parameter.  |
| Othermeta  | It is also possible to add custom metadata to a `test`. These will be added as parameters to the Allure Report. These parameters do __NOT__ have to be named otherMeta but do require to be a key-value pair of two strings. For example, adding a color parameter to a test: `color: 'black'` will result in `color: black` be added to the final Allure Report.  |

### Test Steps

![Example of the step code shown below.](https://raw.githubusercontent.com/isaaceindhoven/testcafe-reporter-allure/master/.github/images/test-steps.PNG)

With this reporter, test-steps can be defined to split a TestCafé `test` into multiple steps. The step function expects three variables: The step name, the TestController, and the actions taken within the step as a TestControllerPromise.

These steps will show up as test-steps within the Allure-Report and will include a screenshot of the page state at the end of the step. These screenshots could then be used to visually follow along with what the test does within each step and get a quick overview where a test might be failing.

```
import step from 'testcafe-reporter-allure';

test('Example test with steps', async (t) => {
  await step('Add developer name to form', t, 
    t.typeText('#developer-name', 'John Smith')
  );
  await step('Submit form and check result', t,
    t.click('#submit-button')
      .expect(Selector('#article-header')
      .innerText).eql('Thank you, John Smith!'),
  );
});
```

### Jenkins
Because the testcafe-reporter-allure package used Allure to visualize the reports, it is also compatible with the [Allure-Jenkins](https://plugins.jenkins.io/allure-jenkins-plugin/) allowing for the reports to be added to each pipeline run.

An example [Jenkinsfile](https://github.com/isaaceindhoven/testcafe-reporter-allure/blob/master/examples/base-implementation/Jenkinsfile) implementing this can be found in the [examples/base-implementation](https://github.com/isaaceindhoven/testcafe-reporter-allure/tree/master/examples/base-implementation). These pipeline stages can be added to your own projects Jenkinsfile to implement the plugins features. Within the `test:e2e` stage, the environment property `TESTCAFE_BROWSER` can be set to define the browser used within the test run. 

Do note that these browsers behave differently because they are running within a docker container. For example, Chrome needs the `--no-sandbox` tag to function properly; otherwise, the following error will occur: `Error: Unable to establish one or more of the specified browser connections. This can be caused by network issues or remote device failure.` This issue is further detailed [here](https://github.com/DevExpress/testcafe/issues/1133#issuecomment-350775990).

To avoid running the browsers within the docker container, using a service like [BrowserStack]( https://devexpress.github.io/testcafe/documentation/guides/concepts/browsers.html#browsers-in-cloud-testing-services) is recommended.

Lastly, all browsers have to be run in `:headless` mode, as can be seen within the Jenkinsfile example.


## Configuration
Testcafe-reporter-allure provides a sensible default for the configuration. However, if a different configuration is needed, this default can be overridden by creating the file `allure.config.js` and/or `allure-categories.config.js` in the root of your project. The `allure.config.js` is for the base configuration options, and the `allure-categories.config.js` is specifically for editing the [categories](https://docs.qameta.io/allure/#_categories) config used by the Allure Commandline to sort the tests based on pattern matching.

An example `allure.config.js`:
```
module.export = {
  RESULT_DIR: './allure/allure-results',
  REPORT_DIR: './allure/allure-report',
  SCREENSHOT_DIR: './allure/screenshots',

  CLEAN_RESULT_DIR: true,
  CLEAN_REPORT_DIR: true,
  CLEAN_SCREENSHOT_DIR: true,

  ENABLE_SCREENSHOTS: true,
  ENABLE_QUARANTINE: false,
  ENABLE_LOGGING: false,

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
```
module.export = [
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

## Contributing

There are multiple ways you can help improve this package: Reporting bug, suggesting features, and contributing code implementing said features and bug requests.

More information can be found in [CONTRIBUTING](https://github.com/isaaceindhoven/testcafe-reporter-allure/blob/master/CONTRIBUTING.md).

## License
[MIT](https://github.com/isaaceindhoven/testcafe-reporter-allure/blob/master/LICENSE) © ISAAC E-commerce Solutions BV

