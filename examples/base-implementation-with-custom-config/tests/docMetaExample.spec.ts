fixture('TestCafé Example Fixture - Documentation').page('http://devexpress.github.io/testcafe/example');

test.meta({
  severity: 'trivial',
  issue: 'TEST-ISSUE',
  description: 'An example description',
  epic: 'Example Epic Ticket',
  feature: 'Example Feature Ticket',
  story: 'Example Story Ticket',
  suite: 'Main Example Group',
  // ... any other key: value property as custom metadata
})('Example test with metadata', async () => {
  // Test Code
});

test
  .meta({
    severity: 'trivial',
    issue: 'TEST-ISSUE',
    description: 'An example description',
    epic: 'Example Epic Ticket',
    feature: 'Example Feature Ticket',
    story: 'Example Story Ticket',
    suite: 'Main Example Group',
    skipReason: 'Skipped: Known bug BUG-ISSUE-1',
    // ... any other key: value property as custom metadata
  })
  .skip('Example test with metadata', async () => {
    // Test Code
  });

test
  .meta({
    severity: 'trivial',
    issue: 'TEST-ISSUE',
    description: 'An example description',
    epic: 'Example Epic Ticket',
    feature: 'Example Feature Ticket',
    story: 'Example Story Ticket',
    suite: 'Main Example Group',
    skipReason: 'Skipped: Not automated',
    // ... any other key: value property as custom metadata
  })
  .skip('Example planned test', async () => {
    // Test Code
  });
