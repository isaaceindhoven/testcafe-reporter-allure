# Metadata

Metadata can be added to a test by using the `meta()` function. The metadata can be added to both the `test` and the `fixture`.

Metadata added to a `fixture` will be inherited by all tests coupled to that fixture to avoid having to declare metadata that is the same for all tests within the fixture multiple times. 

```js
import { t } from 'testcafe';
import { Severity } from 'testcafe-reporter-allure';

fixture('TestCafé Example Fixture - Documentation').page('http://devexpress.github.io/testcafe/example')

test.meta({
  severity: Severity.TRIVIAL,
  issue: 'TEST-ISSUE',
  description: 'An example discription',
  epic: 'Example Epic Ticket',
  feature: 'Example Feature Ticket',
  story: 'Example Story Ticket',
  suite: 'Main Example Group',
  // ... any other key: value property as custom metadata
})('Example test with metadata', async (t) => {
  // Test Code
});

test.meta({
    severity: Severity.TRIVIAL,
    issue: 'TEST-ISSUE',
    description: 'An example discription',
    epic: 'Example Epic Ticket',
    feature: 'Example Feature Ticket',
    story: 'Example Story Ticket',
    suite: 'Main Example Group',
    skipReason: 'Known product bug BUG-ISSUE-1'
    // ... any other key: value property as custom metadata
}).skip('Example test with metadata', async (t) => {
    // Test Code
});


test.meta({
    severity: Severity.TRIVIAL,
    issue: 'TEST-ISSUE',
    description: 'An example discription',
    epic: 'Example Epic Ticket',
    feature: 'Example Feature Ticket',
    story: 'Example Story Ticket',
    suite: 'Main Example Group',
    skipReason: 'Not implemented'
    // ... any other key: value property as custom metadata
}).skip('Example planned test', async (t) => {
    // Test Code
});

test.meta({
    severity: Severity.TRIVIAL,
    issue: 'TEST-ISSUE',
    description: 'An example discription',
    epic: 'Example Epic Ticket',
    feature: 'Example Feature Ticket',
    story: 'Example Story Ticket',
    suite: 'Main Example Group',
    tags: ['automated', 'smoke', 'e2e'] // it is required to pass "tags" value as an array of strings
    // ... any other key: value property as custom metadata
})('Example test with metadata', async (t) => {
    // Test Code
});
```

## Pré-defined metadata

| Metadata | Description |
| ------------- | ------------- |
| Severity | The severity values are dictated by the [allure-js-commons](https://github.com/allure-framework/allure-js/tree/master/packages/allure-js-commons) package, these values are: `blocker, critical, normal, minor, trivial`;  |
| Issue  | A Jira Issue can be coupled to a test, creating a link within the Allure Report to the Jira Issue page. The URL to the Jira page can be set in the [allure-js-commons](https://github.com/isaaceindhoven/testcafe-reporter-allure#configuration).  |
| Epic, Feature, Story  | To sort the tests based on the `epic`, `feature`, and/or `story`, these metadata options can be used to form a tree structure. The tree is structured as follows: An epic can have multiple features, a feature can have multiple stories, and a story can have multiple tests. |
| Suite  | Within the Allure Report, the tests are organized by `fixture` by default. For a more expansive organization of the tests and fixtures, the `suite` parameter can be set. When the `suite` parameter is set within a `test`, a subcategory is created within the `fixture` that will group all tests that have the same `suite` parameter together. When the `suite` parameter is set within a `fixture`, a parent category is created that will group multiple fixtures that have the same `suite` parameter.  |
| SkipReason  | A test meta tag to allow showing skip reason in allure categories.  |
| Tags  | A test meta tag to allow showing tags in allure report. It is required to pass "tags" as an array of strings |

## Custom metadata

It is also possible to add custom metadata to a `test`. These will be added as parameters to the Allure Report. These parameters do __NOT__ have to be named otherMeta but do require to be a key-value pair of two strings. For example, adding a color parameter to a test: `color: 'black'` will result in `color: black` be added to the final Allure Report.

## Result

## Suite overview

![Example of the metadata for passed test.](../images/passed.png)

![Example of the metadata for skipped test with skip reason bug.](../images/skippedBug.png)

![Example of the metadata for skipped test with skip reason not automated.](../images/skippedNotAutomated.png)

![Example of the metadata for test with "tags" metadata.](../images/tags.png)

## Categories

Example of custom categories with skip tests that has meta `skipReason`.
![Example of the custom categories for](../images/customCategories.png)
