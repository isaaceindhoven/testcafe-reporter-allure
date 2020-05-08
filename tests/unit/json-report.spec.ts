import { createJsonReport, splitOnNewline } from '../utils/create-report';

describe('TestCafe Allure reporter JSON output', () => {
  it('Should produce report', () => {
    const report: string = createJsonReport();
    expect(report).toBeDefined();
  });
  it('Should contain 10 items (3 fixtures and 7 tests)', () => {
    const report: string = createJsonReport();
    const splitReport: string[] = splitOnNewline(report);
    // splitReport.forEach(result => {
    //   console.log(result);
    // });
    expect(splitReport.length).toEqual(10);
  });
});
