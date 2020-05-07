import { InMemoryAllureWriter, Stage, Status } from 'allure-js-commons';
import { createObjectReport } from '../utils/create-report';
// Import the custom jest enum matcher
import '../utils/enum-matcher';

describe('Test results', () => {
  it('Should contain a valid status', () => {
    const report: InMemoryAllureWriter = createObjectReport();

    report.tests.forEach((test) => {
      expect(test.status).toBeContainedWithinEnum(Status);
    });
  });
  it('Should contain a valid stage', () => {
    const report: InMemoryAllureWriter = createObjectReport();

    report.tests.forEach((test) => {
      expect(test.stage).toBeContainedWithinEnum(Stage);
    });
  });
  it('Should contain defined data', () => {
    const report: InMemoryAllureWriter = createObjectReport();

    report.tests.forEach((test) => {
      expect(test.historyId).toBeDefined();
      expect(test.name).toBeDefined();
      expect(test.fullName).toBeDefined();
      expect(test.uuid).toBeDefined();

      expect(test.start).toBeDefined();
      expect(test.stop).toBeDefined();

      expect(test.status).toBeDefined();
      expect(test.stage).toBeDefined();
    });
  });
});
