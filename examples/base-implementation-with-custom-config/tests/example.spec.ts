import { Selector } from 'testcafe';
import { Severity, step } from 'testcafe-reporter-allure/dist/utils';

fixture('TestCafé Example Fixture - Main').page('http://devexpress.github.io/testcafe/example').meta({
  epic: 'Example Epic Ticket',
  suite: 'Example Fixture Group',
});

test
  .meta({
    severity: Severity.TRIVIAL,
    issue: 'TEST-ISSUE',
    description: 'An example discription',
    feature: 'Example Feature Ticket',
    story: 'Example Story Ticket',
    suite: 'Main Example Group',
    otherMeta: 'Example otherMeta parameter.',
    skipReason: 'Known bug TEST-ISSUE-1111',
  })
  .skip('Example test with all metadata', async (t) => {
    // it all skipped
    await step('Add developer name to form', t, t.typeText('#developer-name', 'John Smith'));
    await step(
      'Submit form and check result',
      t,
      t.click('#submit-button').expect(Selector('#article-header').innerText).eql('Thank you, John Smith!'),
    );
  });

test.meta({
  suite: 'Main Example Group',
})('Example test with minimal metadata', async (t) => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')
    .expect(Selector('#article-header').innerText)
    .eql('Thank you, John Smith!');
});

test
  .meta({
    suite: 'Main Example Group',
  })
  .skip('Example skipped test without skip reason', async (t) => {
    await t
      .typeText('#developer-name', 'John Smith')
      .click('#submit-button')
      .expect(Selector('#article-header').innerText)
      .eql('Thank you, Jane Smith!');
  });

test
  .meta({
    suite: 'Another Example Group',
    skipReason: 'Known bug TEST-ISSUE-2222',
  })
  .skip('Example failing e2e test without steps', async (t) => {
    // it all skipped
    await t
      .typeText('#developer-name', 'John Smith')
      .click('#submit-button')
      .expect(Selector('#article-header').innerText)
      .eql('Thank you, Jane Smith!');
  });

test.meta({
  suite: 'Failing Test Example Group',
})('Example failing e2e test with steps', async (t) => {
  await step('Add developer name to form', t, t.typeText('#developer-name', 'John Smith'));
  await step(
    'Submit form and check result',
    t,
    t.click('#submit-button').expect(Selector('#article-header').innerText).eql('Thank you, Jane Smith!'),
  );
});

// planned testcases

test
  .meta({
    suite: 'Another Example Group',
    skipReason: 'Not automated',
  })
  .skip('Example not automated e2e test 1', async () => {
    // planned test
  });

test
  .meta({
    suite: 'Another Example Group',
    skipReason: 'Not automated',
  })
  .skip('Example not automated e2e test 2', async () => {
    // planned test
  });

test
  .meta({
    suite: 'Another Example Group',
    skipReason: 'Not automated',
  })
  .skip('Example not automated e2e test 3', async () => {
    // planned test
  });

test
  .meta({
    suite: 'Main Example Group',
    skipReason: 'Not automated',
  })
  .skip('Example skipped test 1', async () => {
    // planned test
  });

test
  .meta({
    suite: 'Main Example Group',
    skipReason: 'Not automated',
  })
  .skip('Example skipped test 2', async () => {
    // planned test
  });

test
  .meta({
    suite: 'Main Example Group',
    skipReason: 'Not automated',
  })
  .skip('Example skipped test 3', async () => {
    // planned test
  });
