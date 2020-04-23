import { Selector } from 'testcafe';

fixture('TestCafé example test').page('http://devexpress.github.io/testcafe/example');

test('My first e2e test', async (t) => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')
    .expect(Selector('#article-header').innerText)
    .eql('Thank you, John Smith!');
});
