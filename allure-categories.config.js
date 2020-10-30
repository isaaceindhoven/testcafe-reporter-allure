module.exports = [
  // Default categories
  {
    name: 'Ignored tests',
    matchedStatuses: ['skipped'],
  },
  {
    name: 'Product defects',
    matchedStatuses: ['failed'],
    messageRegex: '.*Assertion failed.*',
  },
  {
    name: 'Test defects',
    matchedStatuses: ['failed'],
  },
  {
    name: 'Warnings',
    matchedStatuses: ['passed'],
    messageRegex: '.*Warning.*',
  },
  {
    name: 'Flaky tests',
    matchedStatuses: ['passed', 'failed'],
    messageRegex: '.*Flaky.*',
  },

  // Custom categories
  // https://github.com/isaaceindhoven/testcafe-reporter-allure/issues/45
  {
    name: 'Selector Not Found',
    traceRegex: '.*selector does not match any.*',
  },
  {
    name: 'Setup Errors',
    messageRegex: '.*Error in (fixture|test).before(Each)? hook.*',
  },
  { name: 'Assertion Errors', messageRegex: '.*AssertionError:.*' },
  { name: 'Role Errors', messageRegex: '.*Error in Role initializer.*' },
  {
    name: 'Type Errors',
    messageRegex: '.*TypeError: Cannot read property.*',
  },
  {
    name: 'Client Function Errors',
    messageRegex: '.*An error occurred in ClientFunction code.*',
  },
  { name: 'Ignored tests', matchedStatuses: ['skipped'] },
];
