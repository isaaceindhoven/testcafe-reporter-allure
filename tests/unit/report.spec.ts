import { readFileSync } from 'fs';
import * as normalizeNewline from 'normalize-newline';
import { resolve } from 'path';
import createReport from '../utils/create-report';

describe('Example reporter output test', () => {
  it('Should produce report', () => {
    let report = createReport();
    let expected = readFileSync(resolve(__dirname, '../data/report'), { encoding: 'utf8' });

    report = normalizeNewline(report).trim();
    expected = normalizeNewline(expected).trim();

    expect(report).toBe(expected);
  });
});
