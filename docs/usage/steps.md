# Steps

With this reporter, test-steps can be defined to split a TestCafé `test` into multiple steps. The step function expects three variables: The step name, the TestController, and the actions taken within the step as a TestControllerPromise.

These steps will show up as test-steps within the Allure-Report and will include a screenshot of the page state at the end of the step. These screenshots could then be used to visually follow along with what the test does within each step and get a quick overview where a test might be failing.

```js
import step from 'testcafe-reporter-allure';

test('Example test with steps', async (t) => {
  await step('Add developer name to form', t, 
    t.typeText('#developer-name', 'John Smith')
  );
  await step('Submit form and check result', t,
    t.click('#submit-button')
      .expect(Selector('#article-header')
      .innerText).eql('Thank you, John Smith!'),
  );
});
```



![Example of the step code shown below.](/images/test-steps.PNG)