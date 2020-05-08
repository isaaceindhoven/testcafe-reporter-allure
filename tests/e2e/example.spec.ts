import { Severity } from 'allure-js-commons';
import { Selector } from 'testcafe';
import Metadata from '../../src/metadata';

fixture('TestCafé example test fixture 1').page('http://devexpress.github.io/testcafe/example');

test.meta(new Metadata().setSeverity(Severity.BLOCKER).setStory('TEST-STORY').setDescription('An example discription'))(
  'My first e2e test',
  async (t) => {
    await t
      .typeText('#developer-name', 'John Smith')
      .click('#submit-button')
      .expect(Selector('#article-header').innerText)
      .eql('Thank you, John Smith!');
  },
);

test('My second e2e test', async (t) => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')
    .expect(Selector('#article-header').innerText)
    .eql('Thank you, John Smith!');
});

fixture('TestCafé example test fixture 2')
  .page('http://devexpress.github.io/testcafe/example')
  .meta(new Metadata().setSeverity(Severity.CRITICAL));

test.meta(new Metadata().setSeverity(Severity.MINOR))('My third e2e test', async (t) => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')
    .expect(Selector('#article-header').innerText)
    .eql('Thank you, John Smith!');
});

test.meta(new Metadata().setSeverity(Severity.BLOCKER))('My fourth e2e test', async (t) => {
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
