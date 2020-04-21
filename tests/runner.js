const createTestCafe = require('testcafe');

(async () => {
  const testcafe = await createTestCafe();
  const runner = testcafe.createRunner();

  await runner
    .src(['tests/e2e/*.ts'])
    .browsers('firefox:headless')
    .reporter([
      {
        name: 'spec',
      },
    ])
    .tsConfigPath('tsconfig.test.json')
    .run();

  testcafe.close();
})();
