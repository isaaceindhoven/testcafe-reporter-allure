import { Severity } from 'allure-js-commons';
import { Selector } from 'testcafe';
import step from '../../src/testcafe/step';

fixture('TestCafé example test fixture 1').page('http://devexpress.github.io/testcafe/example').meta({
  epic: 'EpicTicket',
  suite: 'FixtureGroup',
});

test.meta({
  severity: Severity.TRIVIAL,
  issue: 'TEST-ISSUE',
  description: 'An example discription',
  feature: 'FeatureTicket',
  story: 'StoryTicket',
  suite: 'TestGroup',
  otherMeta: 'Example otherMeta parameter.',
})('My first e2e test', async (t) => {
  await step(t, t.typeText('#developer-name', 'John Smith'));
  await step(t, t.click('#submit-button').expect(Selector('#article-header').innerText).eql('Thank you, John Smith!'));
});

test.meta({
  severity: Severity.NORMAL,
  suite: 'TestGroup',
})('My second e2e test', async (t) => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')
    .expect(Selector('#article-header').innerText)
    .eql('Thank you, John Smith!');
});

fixture('TestCafé example test fixture 2').page('http://devexpress.github.io/testcafe/example').meta({
  severity: Severity.CRITICAL,
  suite: 'FixtureGroup',
});

test.meta({
  severity: Severity.MINOR,
})('My third e2e test', async (t) => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')
    .expect(Selector('#article-header').innerText)
    .eql('Thank you, John Smith!');
});

test.meta({
  severity: Severity.BLOCKER,
})('My fourth e2e test', async (t) => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')
    .expect(Selector('#article-header').innerText)
    .eql('Thank you, John Smith!');
});

test('My failing e2e test', async (t) => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')
    .expect(Selector('#article-header').innerText)
    .eql('Thank you, Jane Smith!');
});

test.skip('My skipped e2e test', async (t) => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')
    .expect(Selector('#article-header').innerText)
    .eql('Thank you, Jane Smith!');
});

test('My actual flaky e2e test', async (t) => {
  const random: number = Math.random();
  await t.expect(random).gte(0.5);
});
test.meta({
  flaky: true,
})('My manual flaky e2e test', async (t) => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')
    .expect(Selector('#article-header').innerText)
    .eql('Thank you, John Smith!');
});
