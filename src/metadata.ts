import { AllureTest, Severity } from 'allure-js-commons';

export default class Metadata {
  severity: Severity;

  constructor(meta?: any) {
    if (meta) {
      this.severity = meta.severity;
    }
  }

  setSeverity(severity: Severity): Metadata {
    this.severity = severity;
    return this;
  }

  addMetadataToTest(test: AllureTest, groupMetadata: Metadata) {
    // Once metadata has been set it cannot be overritten,
    // therefore priority metadata has to be loaded added first
    // The results will list both entries if both added but allure will only take the first.
    this.mergeMetadata(groupMetadata);

    if (this.severity) {
      test.addLabel('severity', this.severity);
    }
  }

  private mergeMetadata(metadata: Metadata) {
    // Local metadata takes preference to merged metadata
    if (!this.severity && metadata.severity) {
      this.severity = metadata.severity;
    }
  }
}
