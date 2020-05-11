/* eslint-disable class-methods-use-this */
import { AllureTest, LinkType, Severity } from 'allure-js-commons';
import * as AllureConfigDoc from '../allure.config';

export { Severity } from 'allure-js-commons';

export default class Metadata {
  severity: Severity;

  description: string;

  story: string;

  constructor(meta?: any) {
    if (meta) {
      if (meta.severity && this.isValidEnumValue(meta.severity, Severity)) {
        this.severity = meta.severity;
      }
      if (meta.description && this.isString(meta.description)) {
        this.description = meta.description;
      }
      if (meta.story && this.isString(meta.story)) {
        this.story = meta.story;
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

    if (this.severity) {
      test.addLabel(AllureConfigDoc.META.SEVERITY, this.severity);
    }
    if (this.description) {
      /* eslint-disable-next-line no-param-reassign */
      test.description = this.description;
    }
    if (this.story) {
      test.addLink(
        `${AllureConfigDoc.STORY_URL}${this.story}`,
        `${AllureConfigDoc.STORY_LABEL}: ${this.story}`,
        LinkType.ISSUE,
      );
    }
  }

  private mergeMetadata(metadata: Metadata) {
    // Local metadata takes preference to merged metadata
    if (!this.severity && metadata.severity) {
      this.severity = metadata.severity;
    }
    if (!this.description && metadata.description) {
      this.description = metadata.description;
    }
    if (!this.story && metadata.story) {
      this.story = metadata.story;
    }
  }

  private isValidEnumValue(value: string, validEnum: { [s: string]: string }): boolean {
    return value.toUpperCase() in validEnum;
  }

  private isString(value: any): boolean {
    return typeof value === 'string';
  }
}
