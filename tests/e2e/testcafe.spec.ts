const selector = require('testcafe');

fixture('TestCafé example test').page('http://devexpress.github.io/testcafe/example');

test('My first e2e test', async (t) => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')
    .expect(selector('#article-header').innerText)
    .eql('Thank you, John Smith!');
});
