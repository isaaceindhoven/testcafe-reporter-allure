/* eslint-disable @typescript-eslint/no-unused-vars */
// Above eslint rules are disabled for development
import { AllureConfig } from 'allure-js-commons';
import AllureReporter from './reporter/allure-reporter';
import { TestRunInfo } from './testcafe/models';

import cleanAllureFolders from './utils/clean-folders';

import log from './utils/logger';

export default function () {
  return {
    allureReporter: null,
    allureConfig: null,

    /* Used to get the reporter for unittesting itself. */
    getReporter() {
      return this;
    },

    preloadConfig(allureConfig: AllureConfig) {
      this.allureConfig = allureConfig;
    },

    async reportTaskStart(startTime: Date, userAgents: string[], testCount: number): Promise<void> {
      log(this, 'Starting Task');

      this.allureReporter = new AllureReporter(this.allureConfig);
      // Clean the previous allure results
      await cleanAllureFolders();
    },

    async reportFixtureStart(name: string, path: string, meta: object): Promise<void> {
      log(this, `Starting Fixture: ${name}`);

      // End the previous group because testcafe does not trigger the reporter when a fixture ends.
      this.allureReporter.endGroup();
      this.allureReporter.startGroup(name, meta);
    },

    async reportTestStart(name: string, meta: object): Promise<void> {
      log(this, `Starting Test: ${name}`);

      this.allureReporter.startTest(name, meta);
    },

    async reportTestDone(name: string, testRunInfo: TestRunInfo, meta: object): Promise<void> {
      log(this, `Ending Test: ${name}`);

      this.allureReporter.endTest(name, testRunInfo, meta);
    },

    async reportTaskDone(endTime: Date, passed: number, warnings: string[], result: object): Promise<void> {
      log(this, 'Ending Task');

      this.allureReporter.endGroup();
      this.allureReporter.setGlobals();
    },
  };
}
