import { AllureTest, LinkType, Severity } from 'allure-js-commons';
import * as AllureConfigDoc from '../allure.config';

export default class Metadata {
  severity: Severity;

  description: string;

  story: string;

  constructor(meta?: any) {
    if (meta) {
      this.severity = meta.severity;
      this.description = meta.description;
      this.story = meta.story;
    }
  }

  setSeverity(severity: Severity): Metadata {
    this.severity = severity;
    return this;
  }

  setStory(story: string): Metadata {
    this.story = story;
    return this;
  }

  setDescription(description: string): Metadata {
    this.description = description;
    return this;
  }

  addMetadataToTest(test: AllureTest, groupMetadata: Metadata) {
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
}
