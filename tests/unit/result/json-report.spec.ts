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
    // splitReport.forEach(result => {
    //   console.log(result);
    // });
    expect(splitReport.length).toEqual(11);
  });
});
