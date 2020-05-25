/* eslint-disable @typescript-eslint/no-unused-vars */
// Above eslint rules disabled for development
import { AllureConfig } from 'allure-js-commons';
import { TestRunInfo } from './models';
import AllureReporter from './reporter/allure-reporter';
import cleanAllureFolders from './utils/clean-folders';

module.exports = () => {
  return {
    allureReporter: null,
    allureConfig: null,

    getReporter() {
      return this;
    },

    preloadConfig(allureConfig: AllureConfig) {
      this.allureConfig = allureConfig;
    },

    async reportTaskStart(startTime: Date, userAgents: string[], testCount: number): Promise<void> {
      this.allureReporter = new AllureReporter(this.allureConfig);
      // Clean the previous allure results
      await cleanAllureFolders();
    },

    async reportFixtureStart(name: string, path: string, meta: object): Promise<void> {
      // End the previous group because testcafe does not trigger the reporter when a fixture ends.
      this.allureReporter.endGroup();
      this.allureReporter.startGroup(name, meta);
    },

    async reportTestStart(name: string, meta: object): Promise<void> {
      this.allureReporter.startTest(name, meta);
    },

    async reportTestDone(name: string, testRunInfo: TestRunInfo, meta: object): Promise<void> {
      this.allureReporter.endTest(name, testRunInfo, meta);
    },

    async reportTaskDone(endTime: Date, passed: number, warnings: string[], result: object): Promise<void> {
      this.allureReporter.endGroup();
      this.allureReporter.setGlobals();
    },
  };
};
