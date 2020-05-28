import { Severity } from 'allure-js-commons';
import { Selector } from 'testcafe';
import step from '../../src/testcafe/step';

fixture('TestCafé Example Fixture 1').page('http://devexpress.github.io/testcafe/example').meta({
  epic: 'Example Epic Ticket',
  suite: 'Example Fixture Group',
});

test.meta({
  severity: Severity.TRIVIAL,
  issue: 'TEST-ISSUE',
  description: 'An example discription',
  feature: 'Example Feature Ticket',
  story: 'Example Story Ticket',
  suite: 'Main Example Group',
  otherMeta: 'Example otherMeta parameter.',
})('Example test with all metadata', async (t) => {
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
  .skip('Example skipped test', async (t) => {
    await t
      .typeText('#developer-name', 'John Smith')
      .click('#submit-button')
      .expect(Selector('#article-header').innerText)
      .eql('Thank you, Jane Smith!');
  });

test.meta({
  suite: 'Failing Test Example Group',
})('Example failing e2e test without steps', async (t) => {
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

test.meta({
  suite: 'Flaky Test Example Group',
  description: 'Does, however, require that TestCafé runs in Quarantine mode.',
})('Actual flaky test example', async (t) => {
  const random: number = Math.random();
  await t.expect(random).gte(0.5);
});

test.meta({
  suite: 'Flaky Test Example Group',
  flaky: true,
})('Manual flaky test example', async (t) => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')
    .expect(Selector('#article-header').innerText)
    .eql('Thank you, John Smith!');
});

fixture('TestCafé Example Fixture 2').page('http://devexpress.github.io/testcafe/example').meta({
  severity: Severity.CRITICAL,
  suite: 'Example Fixture Group',
});

test.meta({
  severity: Severity.MINOR,
})('Example severity metadata override MINOR', async (t) => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')
    .expect(Selector('#article-header').innerText)
    .eql('Thank you, John Smith!');
});

test.meta({
  severity: Severity.BLOCKER,
})('Example severity metadata override BLOCKER', async (t) => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')
    .expect(Selector('#article-header').innerText)
    .eql('Thank you, John Smith!');
});
