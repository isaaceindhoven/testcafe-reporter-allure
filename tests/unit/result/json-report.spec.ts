import { createJsonReport, splitOnNewline } from '../../utils/create-report';

// Avoid unittests deleting files by mocking the clean-folders function.
jest.mock('../../../src/utils/clean-folders');

describe('TestCafe Allure reporter JSON output', () => {
  it('Should produce report', () => {
    const report: string = createJsonReport();
    expect(report).toBeDefined();
  });
  // The verbose logging option conflicts with this test, to fix this either the writers/allure-writer.ts or the logging should be rewritten.
  /* eslint-disable-next-line jest/no-disabled-tests */
  it.skip('Should contain 10 items (3 fixtures, 7 tests, and 1 categories file)', () => {
    const report: string = createJsonReport();
    const splitReport: string[] = splitOnNewline(report);
    // 3 fixture logs
    // 7 start test logs
    // 7 end test logs
    // 7 test reports
    // 1 categories file
    // Result with verbose logging enabled
    expect(splitReport.length).toEqual(30);
    // Result with verbose logging disabled
    expect(splitReport.length).toEqual(11);
  });
});
