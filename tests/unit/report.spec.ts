const { readFileSync } = require('fs');
const normalizeNewline = require('normalize-newline');
const { resolve } = require('path');
const createReport = require('../utils/create-report');

describe('Example reporter output test', () => {
  it('Should produce report', () => {
    let report = createReport();
    let expected = readFileSync(resolve(__dirname, '../data/report'), { encoding: 'utf8' });

    report = normalizeNewline(report).trim();
    expected = normalizeNewline(expected).trim();

    expect(report).toBe(expected);
  });
});
