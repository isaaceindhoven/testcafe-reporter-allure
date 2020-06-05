import { createJsonReport, splitOnNewline } from '../../utils/create-report';

// Avoid unittests deleting files by mocking the clean-folders function.
jest.mock('../../../src/utils/clean-folders');

describe('TestCafe Allure reporter JSON output', () => {
  it('Should produce report', () => {
    const report: string = createJsonReport();
    expect(report).toBeDefined();
  });
  it('Should contain 10 items (3 fixtures, 7 tests, and 1 categories file)', () => {
    const report: string = createJsonReport();
    const splitReport: string[] = splitOnNewline(report);
    // 3 fixture logs
    // 7 start test logs
    // 7 end test logs
    // 7 test reports
    // 1 categories file
    expect(splitReport.length).toEqual(30);
  });
});
