const { createReport, readReport } = require('../utils/generate-report');

describe('Example reporter output test', () => {
  it('Should produce report', () => {
    const report = createReport();
    const expected = readReport();

    expect(report).toBe(expected);
  });
});
