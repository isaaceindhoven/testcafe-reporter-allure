# testcafe-reporter-allure

This is an [Allure](http://allure.qatools.ru/) reporter plugin for [TestCafé](https://devexpress.github.io/testcafe/).

This package is inspired by its namesake, [testcafe-reporter-allure](http://allure.qatools.ru/), made by azohra-core, making use of the 2.0.0 version of the [allure-js-commons](https://github.com/allure-framework/allure-js/tree/master/packages/allure-js-commons) package.

## Installation

This package is namespaced, therefore the following command can be used to install the reporter in a way that TestCafé can detect it. 
([Related ISSUE](https://github.com/DevExpress/testcafe/issues/4692))

`npm install --save-dev testcafe-reporter-allure@npm:@isaaceindhoven/testcafe-reporter-allure`

## Using the reporter

The reporter can then be loaded in two seperate ways:

When using TestCafé via the command line the reporter can be specified by using the `--reporter` option.

`testcafe chrome 'path/to/test/file.js' --reporter allure`

When using TestCafé via the API the reporter can be specified by either passing the name or the reporter object in the `reporter()` method.

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
const isaacReporter = require('testcafe-reporter-allure');

testCafe
    .createRunner()
    .src(['tests/e2e/*.ts'])
    .browsers('firefox')
    .reporter(isaacReporter)
    .run();
```

## Features
### Metadata
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
})('Example test with all metadata', async (t) => {
  // Test Code
});
```

#### Severity
The severity values are dictated by the [allure-js-commons](https://github.com/allure-framework/allure-js/tree/master/packages/allure-js-commons) package, these values are: `blocker, critical, normal, minor, trivial`;

#### Issue
A Jira Issue can be coupled to a test, this will create a link within the Allure Report to the Jira Issue page. The url to the Jira page can be set in the [allure-js-commons](https://github.com/isaaceindhoven/testcafe-reporter-allure#configuration).

#### Epic, Feature, Story
To sort the tests based on the `epic`, `feature`, and/or `story` they are based on these values can be defined.

#### Suite
Within the Allure Report the tests are organised by `fixture` by default. For a finer organisation of the tests and fixtures the `suite` parameter can be set.

When the `suite` parameter is set within a `test` a subcategory is created within the `fixture` that will group all tests that have the same `suite` parameter together.

When the `suite` parameter is set within a `fixture` a parent category is created that will group multiple fixtures together that have the same `suite` parameter.

#### Othermeta
It is also possible to add custom metadata to a `test`. These will be added as parameters to the Allure Report. These parameters do __NOT__ have to be named otherMeta but do require to be a key-value pair of two strings.

For example adding a color parameter to a test: `color: 'black'` will result in `color: black` be added to the final Allure Report.

### Test Steps


## Configuration





