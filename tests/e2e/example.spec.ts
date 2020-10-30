import { Selector } from 'testcafe';
import { Severity, step } from '../../src/utils';

const TIER2 = { tier2: 'true' };
const SMOKE = { type: 'smoke' };
const OWNERS = { owner: 'team' };

fixture('TestCafé Example Fixture - Main').page('http://devexpress.github.io/testcafe/example').meta({
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

fixture('TestCafé Example Fixture - Flaky Tests')
  .page('http://devexpress.github.io/testcafe/example')
  .meta({
    suite: 'Example Fixture Group',
  })
  .before(async (ctx) => {
    ctx.flakyVariable = 0;
  });

test.meta({
  suite: 'Flaky Test Example Group',
  description:
    'Does, however, require that TestCafé runs in Quarantine mode, will fail on the first two attempts and succeed on the third.',
})('Actual flaky test example', async (t) => {
  // eslint-disable-next-line no-param-reassign
  t.fixtureCtx.flakyVariable += 1;
  await t.expect(t.fixtureCtx.flakyVariable).eql(2);
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

fixture('TestCafé Example Fixture - Meta Overrides').page('http://devexpress.github.io/testcafe/example').meta({
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

fixture.meta(OWNERS);

[...Array(2).keys()].forEach((testNumber) => {
  test.meta(SMOKE).meta(TIER2).meta({
    suite: 'big suite',
    epic: 'big epic',
    story: 'big story',
    feature: 'big feature',
    description: 'Checks something else',
  })(`Passing Test ${testNumber}`, async () => {});

  test.meta(SMOKE).meta(TIER2).meta({
    severity: 'critical',
    story: 'As user I want to be able to do...',
    description: 'Checks something',
  })(`Passing Test With ALL META ${testNumber}`, async () => {});
});

test.meta(SMOKE).meta(TIER2).page('https://getbootstrap.com/docs/4.1/components/alerts/')(
  'Passing Test with 2 screenshots',
  async (t) => {
    await t.takeScreenshot();
    await t.takeElementScreenshot(Selector('.alert'));
  },
);

fixture('All Skipped Fixture').meta(OWNERS);

[...Array(2).keys()].forEach((testNumber) => {
  test.skip.meta(SMOKE).meta(TIER2)(`Skipped Test ${testNumber}`, async () => {});
});

fixture('All Failed Fixture').meta(OWNERS);

test.meta(SMOKE).meta(TIER2)('Failed Test 1 Incorrect Assert', async (t) => {
  await t.expect(1).eql(0);
});

test.meta(SMOKE).meta(TIER2)('Failed Test 2', async (t) => {
  await t.expect(Selector('body').find('foo').hasAttribute('bar')).ok();
});

test.meta(SMOKE).meta(TIER2)('Failed Test 3 No ', async () => {
  const bar = {};
  // @ts-ignore
  bar.toString2();
});

test.meta(SMOKE).meta(TIER2).meta({
  suite: 'big suite',
  epic: 'big epic',
  story: 'big story',
  feature: 'big feature',
})('Failed Test 4 Error Thrown', async () => {
  throw new Error('Boo');
});

test.meta(SMOKE).meta(TIER2).page('https://getbootstrap.com/docs/4.1/components/alerts/')(
  'Failed Test 4 Selector DNE with 2 screenshots',
  async (t) => {
    await t.takeScreenshot();
    await t.takeElementScreenshot(Selector('.alert'));
    await t.expect(Selector('body').find('bar').exists).ok();
  },
);

test.meta(SMOKE).meta(TIER2).page('https://getbootstrap.com/docs/4.1/components/alerts/')(
  'Failed Test 5 Selector Click DNE',
  async (t) => {
    await t.click(Selector('body').find('bar'));
  },
);

fixture('Mixed Fixture').meta(OWNERS);

test.skip.meta(SMOKE).meta(TIER2)('MF Skipped Test', async () => {});

test.meta(SMOKE).meta(TIER2)('MF Failed Test Selector DNE', async (t) => {
  await t.expect(Selector('bad').hasAttribute('bar')).ok();
});

[...Array(2).keys()].forEach((testNumber) => {
  test.meta(SMOKE).meta(TIER2).meta({
    severity: 'critical',
    story: 'I am a user story',
    description: 'Checks something foo',
  })(`Pass/Fail Test With ALL META ${testNumber}`, async (t) => {
    await t.expect(testNumber % 2).eql(0);
  });
});

fixture.meta(OWNERS)`Failing Fixture Setup`.beforeEach(async (t) => {
  await t.click(Selector('baz'));
});
test.meta(SMOKE).meta(TIER2)('FF Test', async () => {});

fixture.meta(OWNERS)`Failing Assert Fixture`.beforeEach(async (t) => {
  await t.expect(1).eql(0);
});
test.meta(SMOKE).meta(TIER2)('FAF Test', async () => {});
