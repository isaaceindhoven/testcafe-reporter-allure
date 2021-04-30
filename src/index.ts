import { AllureConfig } from 'allure-js-commons';
import AllureReporter from './reporter/allure-reporter';
import { TestRunInfo } from './testcafe/models';
import cleanAllureFolders from './utils/clean-folders';
import log from './utils/logger';

export default () => ({
  allureReporter: null,
  allureConfig: null,

  /* Used to get the reporter for unittesting itself. */
  getReporter() {
    return this;
  },

  preloadConfig(allureConfig: AllureConfig) {
    this.allureConfig = allureConfig;
  },

  async reportTaskStart(startTime: Date, userAgents: string[]): Promise<void> {
    log(this, 'Starting Task');
    this.allureReporter = new AllureReporter(this.allureConfig, userAgents);
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

  async reportTaskDone(): Promise<void> {
    log(this, 'Ending Task');

    this.allureReporter.endGroup();
    this.allureReporter.setGlobals();
  },
});
