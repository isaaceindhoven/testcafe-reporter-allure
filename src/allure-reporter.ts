import { AllureConfig } from 'allure-js-commons/dist/src/AllureConfig';
import { AllureGroup } from 'allure-js-commons/dist/src/AllureGroup';
import { AllureRuntime } from 'allure-js-commons/dist/src/AllureRuntime';
import { AllureTest } from 'allure-js-commons/dist/src/AllureTest';
import { Stage, Status, StatusDetails } from 'allure-js-commons/dist/src/model';

export default class AllureReporter /* implements IAllureReporter */ {
  private groups: AllureGroup[] = [];

  private runningTest: AllureTest | null = null;

  private runtime: AllureRuntime = null;

  private allureResultsPathDefault: string = './allure/allure-results';

  constructor(allureResultsPath?: string) {
    let allureConfig = null;
    if (!allureResultsPath) {
      allureConfig = new AllureConfig(this.allureResultsPathDefault);
    } else {
      allureConfig = new AllureConfig(allureResultsPath);
    }

    this.runtime = new AllureRuntime(allureConfig);
  }

  public startGroup(groupName: string): void {
    const currentGroup = this.getCurrentGroup();
    const scope = currentGroup || this.runtime;
    const suite = scope.startGroup(groupName || 'Global');
    this.groups.push(suite);
  }

  public endGroup(): void {
    const currentGroup = this.getCurrentGroup();
    if (currentGroup !== null) {
      currentGroup.endGroup();
      this.groups.pop();
    }
  }

  public startTest(testName: string): void {
    const currentGroup = this.getCurrentGroup();
    if (currentGroup === null) {
      throw new Error('No active suite');
    }

    const currentTest = currentGroup.startTest(testName);
    currentTest.fullName = testName;
    currentTest.historyId = testName;
    currentTest.stage = Stage.RUNNING;
    this.setCurrentTest(currentTest);
  }

  public endTestPassed(testName: string): void {
    const currentTest = this.getCurrentTest();
    if (currentTest === null) {
      this.startTest(testName);
    }
    this.endTest(Status.PASSED);
  }

  public endTestFailed(testName: string, error: Error) {
    const currentTest = this.getCurrentTest();
    if (currentTest === null) {
      this.startTest(testName);
    } else {
      const latestStatus = currentTest.status;
      // if test already has a failed state, we should not overwrite it
      if (latestStatus === Status.FAILED || latestStatus === Status.BROKEN) {
        return;
      }
    }
    const status = error.name === 'AssertionError' ? Status.FAILED : Status.BROKEN;

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
