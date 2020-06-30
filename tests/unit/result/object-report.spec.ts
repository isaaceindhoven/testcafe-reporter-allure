import { InMemoryAllureWriter } from 'allure-js-commons';
import { createObjectReport } from '../../utils/create-report';

// Avoid unittests deleting files by mocking the clean-folders function.
jest.mock('../../../src/utils/clean-folders');

describe('TestCafe Allure reporter Object output', () => {
  it('Should contain 3 groups', () => {
    const report: InMemoryAllureWriter = createObjectReport();
    expect(report.groups.length).toEqual(3);
  });
  it('Should contain 7 tests', () => {
    const report: InMemoryAllureWriter = createObjectReport();
    expect(report.tests.length).toEqual(7);
  });
  it('Should contain 1 categories definition', () => {
    const report: InMemoryAllureWriter = createObjectReport();
    expect(report.categories).toBeDefined();
  });
});
