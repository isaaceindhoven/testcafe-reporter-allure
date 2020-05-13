/* eslint-disable no-console,@typescript-eslint/no-unused-vars */
// Above eslint rules disabled for development
import { AllureConfig } from 'allure-js-commons';
import AllureReporter from './reporter/allure-reporter';

module.exports = () => {
  return {
    allureReporter: null,
    allureConfig: null,

    getReporter() {
      return this;
    },

    preloadConfig(allureConfig: AllureConfig) {
      this.allureConfig = allureConfig;
      // this.write(`Config preloaded: ${this.allureConfig}`).newline();
    },

    async reportTaskStart(startTime: Date, userAgents: string[], testCount: number): Promise<void> {
      this.allureReporter = new AllureReporter(this.allureConfig);
      // this.write(`Config loaded: ${this.allureConfig}`).newline();
      // this.write('Task has been started').newline();
    },

    async reportFixtureStart(name: string, path: string, meta: object): Promise<void> {
      try {
        // End the previous group because testcafe does not trigger the reporter when a fixture ends.
        this.allureReporter.endGroup();

        this.allureReporter.startGroup(name, meta);
        // this.write(`Fixture "${name}" has been started`).newline();
      } catch (error) {
        console.log(error);
      }
    },

    async reportTestStart(name: string, meta: object): Promise<void> {
      try {
        this.allureReporter.startTest(name, meta);
        // this.write(`Test "${name}" has been started`).newline();
      } catch (error) {
        console.log(error);
      }
    },

    async reportTestDone(name: string, testRunInfo, meta: object): Promise<void> {
      try {
        const hasErr = !!testRunInfo.errs.length;

        if (hasErr) {
          this.allureReporter.endTestFailed(name, meta, testRunInfo.errs[0]);
        } else {
          this.allureReporter.endTestPassed(name, meta);
        }
        // this.write(`Test "${name}" has been finished`).newline();
      } catch (error) {
        console.log(error);
      }
    },

    async reportTaskDone(endTime: Date, passed: number, warnings: string[], result: object): Promise<void> {
      try {
        this.allureReporter.endGroup();
        // this.write('Task has been completed').newline();
      } catch (error) {
        console.log(error);
      }
    },
  };
};
