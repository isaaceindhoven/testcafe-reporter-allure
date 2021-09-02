import { t } from 'testcafe';
import { Severity } from 'testcafe-reporter-allure/dist/utils';

fixture('TestCafé Example Fixture - Documentation').page('http://devexpress.github.io/testcafe/example')

test.meta({
    severity: Severity.TRIVIAL,
    issue: 'TEST-ISSUE',
    description: 'An example description',
    epic: 'Example Epic Ticket',
    feature: 'Example Feature Ticket',
    story: 'Example Story Ticket',
    suite: 'Main Example Group',
    // ... any other key: value property as custom metadata
})('Example test with metadata', async (t) => {
    // Test Code
});

test.meta({
    severity: Severity.TRIVIAL,
    issue: 'TEST-ISSUE',
    description: 'An example description',
    epic: 'Example Epic Ticket',
    feature: 'Example Feature Ticket',
    story: 'Example Story Ticket',
    suite: 'Main Example Group',
    skipReason: 'Known bug BUG-ISSUE-1'
    // ... any other key: value property as custom metadata
}).skip('Example test with metadata', async (t) => {
    // Test Code
});


test.meta({
    severity: Severity.TRIVIAL,
    issue: 'TEST-ISSUE',
    description: 'An example description',
    epic: 'Example Epic Ticket',
    feature: 'Example Feature Ticket',
    story: 'Example Story Ticket',
    suite: 'Main Example Group',
    skipReason: 'Not automated'
    // ... any other key: value property as custom metadata
}).skip('Example planned test', async (t) => {
    // Test Code
});
