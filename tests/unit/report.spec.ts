const normalizeNewline = require('normalize-newline');
const read = require('read-file-relative').readSync;
const createReport = require('../utils/create-report');

describe('Example reporter output test', () => {
  it('Should produce report', () => {
    let report = createReport();
    let expected = read('../data/report');

    report = normalizeNewline(report).trim();
    expected = normalizeNewline(expected).trim();

    expect(report).toBe(expected);
  });
});
