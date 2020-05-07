const { createReport } = require('../utils/create-report');

describe('Example reporter output test', () => {
  it('Should produce report', () => {
    const report = createReport();

    expect(report).toBeDefined();
  });
});
