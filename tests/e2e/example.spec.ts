import { Selector } from 'testcafe';
import { Severity } from '../../src/metadata';

fixture('TestCafé example test fixture 1').page('http://devexpress.github.io/testcafe/example');

test.meta({
  severity: Severity.TRIVIAL,
  issue: 'TEST-ISSUE',
  description: 'An example discription',
  otherMeta: 'Example otherMeta parameter.',
})('My first e2e test', async (t) => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')
    .expect(Selector('#article-header').innerText)
    .eql('Thank you, John Smith!');
});

test.meta({
  severity: Severity.NORMAL,
})('My second e2e test', async (t) => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')
    .expect(Selector('#article-header').innerText)
    .eql('Thank you, John Smith!');
});

fixture('TestCafé example test fixture 2').page('http://devexpress.github.io/testcafe/example').meta({
  severity: Severity.CRITICAL,
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
