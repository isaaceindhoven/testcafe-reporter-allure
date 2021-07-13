/* eslint-disable class-methods-use-this,array-callback-return */
import { AllureTest, LabelName, LinkType, Severity } from 'allure-js-commons';
import { TestStep } from '../testcafe/step';
import { loadReporterConfig } from '../utils/config';

const reporterConfig = loadReporterConfig();

export default class Metadata {
  severity: Severity;

  description: string;

  issue: string;

  parent_suite: string;

  suite: string;

  sub_suite: string;

  epic: string;

  story: string;

  feature: string;

  flaky: boolean = false;

  steps: TestStep[];

  otherMeta: Map<string, string>;

  constructor(meta?: any, test?: boolean) {
    this.otherMeta = new Map();
    if (meta) {
      const { severity, description, issue, suite, epic, story, feature, flaky, steps, ...otherMeta } = meta;

      if (this.isValidEnumValue(severity, Severity)) {
        this.severity = severity;
      }
      if (this.isString(description)) {
        this.description = description;
      }
      if (this.isString(issue)) {
        this.issue = issue;
      }
      if (this.isString(suite)) {
        if (test) {
          this.sub_suite = suite;
        } else {
          this.parent_suite = suite;
        }
      }
      if (this.isString(epic)) {
        this.epic = epic;
      }
      if (this.isString(story)) {
        this.story = story;
      }
      if (this.isString(feature)) {
        this.feature = feature;
      }
      if (this.isBoolean(flaky)) {
        this.flaky = flaky;
      }
      if (steps) {
        this.steps = steps;
      }
      Object.keys(otherMeta).forEach((key) => {
        if (this.isString(otherMeta[key])) {
          this.otherMeta.set(key, otherMeta[key]);
        }
      });
    }
  }

  addMetadataToTest(test: AllureTest, groupMetadata: Metadata) {
    if (!(groupMetadata instanceof Metadata)) {
      throw new Error('groupMetadata is not a valid Metadata object');
    }

    // Once metadata has been set it cannot be overritten,
    // therefore priority metadata has to be loaded added first
    // The results will list both entries if both added but allure will only take the first.
    this.mergeMetadata(groupMetadata);

    // Labels only accept specific keys/names as valid, it will ignore all other labels
    // Other variabels have to be added as parameters or links.

    // Add default labels for language and framework that could be used by other libraries that parse allure results
    test.addLabel('framework', 'TestCafe');
    test.addLabel('language', 'typescript/javascript');

    // Only the first severity value is loaded.
    if (this.severity) {
      test.addLabel(LabelName.SEVERITY, this.severity);
    } else {
      // If no severity is given, set the default severity
      test.addLabel(LabelName.SEVERITY, reporterConfig.META.SEVERITY);
    }

    // Tests can be added to multiple suites at the same time.
    // Suites support 3 different suite levels: Parent, Suite, Sub
    // A test can have multiple of the same level suites but this will duplicate the test in the report
    // If a test has 2 parents and 2 suites the result will be that the test is duplicated 4 times for each combination.
    // Therefore it is advisable to only use suites to categorise them in single fixtures and not for custom configurations.
    if (this.parent_suite) {
      test.addLabel(LabelName.PARENT_SUITE, this.parent_suite);
    }
    if (this.suite) {
      test.addLabel(LabelName.SUITE, this.suite);
    }
    if (this.sub_suite) {
      test.addLabel(LabelName.SUB_SUITE, this.sub_suite);
    }

    // BDD style notation, containing Epics, Features, and Stories can be added to the tests.
    // These labels work the same way as the suites containing 3 levels. These are in order: Epic -> Feature -> Story
    if (this.epic) {
      test.addLabel(LabelName.EPIC, this.epic);
    }
    if (this.feature) {
      test.addLabel(LabelName.FEATURE, this.feature);
    }
    if (this.story) {
      test.addLabel(LabelName.STORY, this.story);
    }

    if (this.issue) {
      test.addLink(
        `${reporterConfig.META.ISSUE_URL}${this.issue}`,
        `${reporterConfig.LABEL.ISSUE}: ${this.issue}`,
        LinkType.ISSUE,
      );
    }

    if (this.description) {
      /* eslint-disable-next-line no-param-reassign */
      test.description = this.description;
    }

    // Flaky is a boolean, only add to test if flaky is true.
    if (this.flaky) {
      // TODO: Add flaky correctly to allure instead of as a parameter
      // However currenly allure-js-commons does not seem to support flaky tests.
      test.addParameter(reporterConfig.LABEL.FLAKY, this.flaky.toString());
    }

    Array.from(this.otherMeta.entries()).map((entry) => {
      test.addParameter(entry[0], entry[1]);
    });
  }

  private mergeMetadata(metadata: Metadata) {
    // Local metadata takes preference to merged metadata
    if (!this.severity && metadata.severity) {
      this.severity = metadata.severity;
    }
    if (!this.description && metadata.description) {
      this.description = metadata.description;
    }
    if (!this.issue && metadata.issue) {
      this.issue = metadata.issue;
    }
    // Parent_Suite and Suite are used from the merged metadata but Sub_Suite is not.
    if (!this.parent_suite && metadata.parent_suite) {
      this.parent_suite = metadata.parent_suite;
    }
    if (!this.suite && metadata.suite) {
      this.suite = metadata.suite;
    }
    if (!this.epic && metadata.epic) {
      this.epic = metadata.epic;
    }
    if (!this.story && metadata.story) {
      this.story = metadata.story;
    }
    if (!this.feature && metadata.feature) {
      this.feature = metadata.feature;
    }
    if (metadata.flaky) {
      this.flaky = metadata.flaky;
    }
    if (metadata.otherMeta.size > 0) {
      Array.from(metadata.otherMeta.entries()).map((entry) => {
        if (!this.otherMeta.has(entry[0])) {
          this.otherMeta.set(entry[0], entry[1]);
        }
      });
    }
  }

  public setFlaky() {
    this.flaky = true;
  }

  public getSteps(): TestStep[] | null {
    if (this.steps) {
      return this.steps;
    }
    return null;
  }

  private isValidEnumValue(value: string, validEnum: { [s: string]: string }): boolean {
    if (!value) {
      return false;
    }
    return value.toUpperCase() in validEnum;
  }

  private isString(value: any): boolean {
    if (!value) {
      return false;
    }
    return typeof value === 'string';
  }

  private isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }
}
