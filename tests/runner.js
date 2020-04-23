/* eslint-disable no-console */
const createTestCafe = require('testcafe');

let testcafe = null;

createTestCafe()
  .then((tc) => {
    testcafe = tc;
    const runner = testcafe.createRunner();

    return runner
      .src(['tests/e2e/*.ts'])
      .browsers('firefox:headless')
      .reporter([
        {
          name: 'spec',
        },
        // Self reference to test the reporter, needs to be self-linked via npm link for TestCafé to find it.
        // {
        //   name: 'isaac',
        // },
      ])
      .tsConfigPath('tsconfig.test.json')
      .run();
  })
  .then((failed) => {
    console.log(`Tests failed: ${failed}`);
    testcafe.close();
  })
  .catch((error) => {
    console.log(error.message);
    testcafe.close();
  });
