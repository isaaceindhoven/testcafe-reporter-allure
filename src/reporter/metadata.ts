/* eslint-disable class-methods-use-this,array-callback-return */
import { AllureTest, LinkType, Severity } from 'allure-js-commons';
import loadConfig from '../utils/config';

const reporterConfig = loadConfig();

export default class Metadata {
  severity: Severity;

  description: string;

  issue: string;

  otherMeta: Map<string, string>;

  constructor(meta?: any) {
    this.otherMeta = new Map();
    if (meta) {
      const { severity, description, issue, ...otherMeta } = meta;

      if (this.isValidEnumValue(severity, Severity)) {
        this.severity = severity;
      }
      if (this.isString(description)) {
        this.description = description;
      }
      if (this.isString(issue)) {
        this.issue = issue;
      }
      if (otherMeta) {
        Object.keys(otherMeta).forEach((key) => {
          if (this.isString(otherMeta[key])) {
            this.otherMeta.set(key, otherMeta[key]);
          }
        });
      }
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
    if (this.severity) {
      test.addLabel(reporterConfig.LABEL.SEVERITY, this.severity);
    } else {
      // If no severity is given, set the default severity
      test.addLabel(reporterConfig.LABEL.SEVERITY, reporterConfig.META.SEVERITY);
    }
    if (this.description) {
      /* eslint-disable-next-line no-param-reassign */
      test.description = this.description;
    }
    if (this.issue) {
      test.addLink(
        `${reporterConfig.META.ISSUE_URL}${this.issue}`,
        `${reporterConfig.LABEL.ISSUE}: ${this.issue}`,
        LinkType.ISSUE,
      );
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
    if (metadata.otherMeta.size > 0) {
      Array.from(metadata.otherMeta.entries()).map((entry) => {
        if (!this.otherMeta.has(entry[0])) {
          this.otherMeta.set(entry[0], entry[1]);
        }
      });
    }
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
}
