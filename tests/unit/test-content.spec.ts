import { InMemoryAllureWriter, LinkType, Severity, Stage, Status } from 'allure-js-commons';
import { createObjectReport } from '../utils/create-report';
import '../utils/jest-enum-matcher';

describe('Test results', () => {
  it('Should contain valid statuses', () => {
    const report: InMemoryAllureWriter = createObjectReport();

    report.tests.forEach((test) => {
      expect(test.status).toBeContainedWithinEnum(Status);
    });
  });
  it('Should contain valid stages', () => {
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
  it('Should contain valid severitys', () => {
    // If no label exists allure will default to 'Normal' severity so checking if the label exists is not nessesary only that if it exits it is valid.
    const report: InMemoryAllureWriter = createObjectReport();

    report.tests.forEach((test) => {
      test.labels.forEach((label) => {
        if (label.name === 'severity') {
          expect(label.value).toBeContainedWithinEnum(Severity);
        }
      });
    });
  });
  it('Should contain a specific severity', () => {
    const report: InMemoryAllureWriter = createObjectReport();

    const label = report.tests[0].labels[0];
    expect(label.value).toBe(Severity.BLOCKER);
  });
  it('Should contain a specific link', () => {
    const report: InMemoryAllureWriter = createObjectReport();

    const link = report.tests[0].links[0];
    expect(link.name).toBe('JIRA Issue: TEST-ISSUE');
    expect(link.url).toBe('https://jira.example.nl/browse/TEST-ISSUE');
    expect(link.type).toBe(LinkType.ISSUE);
  });

  it('Should contain a valid linkTypes', () => {
    const report: InMemoryAllureWriter = createObjectReport();

    report.tests.forEach((test) => {
      test.links.forEach((link) => {
        if (link.type) {
          expect(link.type).toBeContainedWithinEnum(LinkType);
        }
      });
    });
  });
});