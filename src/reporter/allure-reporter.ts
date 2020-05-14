import { AllureConfig, AllureGroup, AllureRuntime, AllureTest, Stage, Status, StatusDetails } from 'allure-js-commons';
import cleanAllureFolders from '../utils/clean-folders';
import loadConfig from '../utils/config';
import Metadata from './metadata';

const reporterConfig = loadConfig();

export default class AllureReporter {
  private groups: AllureGroup[] = [];

  private runningTest: AllureTest | null = null;

  private runtime: AllureRuntime = null;

  private groupMetadata: Metadata;

  constructor(allureConfig?: AllureConfig) {
    cleanAllureFolders();

    let config: AllureConfig;
    if (!allureConfig) {
      config = new AllureConfig(reporterConfig.RESULT_DIR);
    } else {
      config = allureConfig;
    }

    this.runtime = new AllureRuntime(config);
  }

  public startGroup(name: string, meta: object): void {
    this.groupMetadata = new Metadata(meta);
    const suite = this.runtime.startGroup(name);
    this.groups.push(suite);
  }

  public endGroup(): void {
    const currentGroup = this.getCurrentGroup();
    if (currentGroup !== null) {
      currentGroup.endGroup();
      this.groups.pop();
    }
  }

  public startTest(name: string, meta: object): void {
    const currentMetadata = new Metadata(meta);
    const currentGroup = this.getCurrentGroup();
    if (currentGroup === null) {
      throw new Error('No active suite');
    }

    const currentTest = currentGroup.startTest(name);
    currentTest.fullName = `${currentGroup.name} : ${name}`;
    currentTest.historyId = name;
    currentTest.stage = Stage.RUNNING;

    currentMetadata.addMetadataToTest(currentTest, this.groupMetadata);

    this.setCurrentTest(currentTest);
  }

  public endTestPassed(name: string, meta: object): void {
    const currentTest = this.getCurrentTest();
    if (currentTest === null) {
      this.startTest(name, meta);
    }
    this.endTest(Status.PASSED);
  }

  public endTestFailed(name: string, meta: object, error: Error): void {
    const currentTest = this.getCurrentTest();
    if (currentTest === null) {
      this.startTest(name, meta);
    } else {
      const latestStatus = currentTest.status;
      // if test already has a failed state, we should not overwrite it
      if (latestStatus === Status.FAILED || latestStatus === Status.BROKEN) {
        return;
      }
    }
    const status = Status.FAILED;
    this.endTest(status, { message: error.message, trace: error.stack });
  }

  private endTest(status: Status, details?: StatusDetails): void {
    const currentTest = this.getCurrentTest();
    if (currentTest === null) {
      throw new Error('endTest while no test is running');
    }

    if (details) {
      currentTest.statusDetails = details;
    }
    currentTest.status = status;
    currentTest.stage = Stage.FINISHED;
    currentTest.endTest();
  }

  private getCurrentGroup(): AllureGroup | null {
    if (this.groups.length === 0) {
      return null;
    }
    return this.groups[this.groups.length - 1];
  }

  private getCurrentTest(): AllureTest | null {
    return this.runningTest;
  }

  private setCurrentTest(test: AllureTest | null) {
    this.runningTest = test;
  }
}
