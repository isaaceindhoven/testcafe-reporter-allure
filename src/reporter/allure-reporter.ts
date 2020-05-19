import { AllureConfig, AllureGroup, AllureRuntime, AllureTest, Category, Stage, Status } from 'allure-js-commons';
import { loadCategoriesConfig, loadReporterConfig } from '../utils/config';
import addNewLine from '../utils/utils';
import Metadata from './metadata';

const reporterConfig = loadReporterConfig();
const categoriesConfig: Category[] = loadCategoriesConfig();

export default class AllureReporter {
  private groups: AllureGroup[] = [];

  private runningTest: AllureTest | null = null;

  private runtime: AllureRuntime = null;

  private groupMetadata: Metadata;

  constructor(allureConfig?: AllureConfig) {
    let config: AllureConfig;
    if (!allureConfig) {
      config = new AllureConfig(reporterConfig.RESULT_DIR);
    } else {
      config = allureConfig;
    }

    this.runtime = new AllureRuntime(config);
  }

  public setGlobals(): void {
    // Writing the globals has to be done after the first group has been written for a currently unknown reason.
    // Best to call this function in reporterTaskEnd and to write it as the last thing.
    this.runtime.writeCategoriesDefinitions(categoriesConfig);
    // this.runtime.writeEnvironmentInfo();
  }

  public startGroup(name: string, meta: object): void {
    this.groupMetadata = new Metadata(meta);
    this.groupMetadata.suite = name;
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
    const currentMetadata = new Metadata(meta, true);
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

  public endTest(name: string, testRunInfo: any, meta: object): void {
    const currentTest = this.getCurrentTest();

    // If no currenttest exists create a new one
    if (currentTest === null) {
      this.startTest(name, meta);
    }

    const hasErrors = !!testRunInfo.errs && !!testRunInfo.errs.length;
    const hasWarnings = !!testRunInfo.warnings && !!testRunInfo.warnings.length;
    const isSkipped = testRunInfo.skipped;
    let testMessages: string = null;
    let testDetails: string = null;

    if (isSkipped) {
      currentTest.status = Status.SKIPPED;
    } else if (hasErrors) {
      currentTest.status = Status.FAILED;

      testRunInfo.errs.forEach((error: any) => {
        testMessages = addNewLine(testMessages, error.errMsg);

        // TODO: Add detailed error stacktrace
        // How to convert CallSiteRecord to stacktrace?
        const callSite = error.callsite;
        if (error.userAgent) {
          testDetails = addNewLine(testDetails, `User Agent: ${error.userAgent}`);
        }
        if (error.userAgent) {
          testDetails = addNewLine(testDetails, `File name: ${callSite.filename}`);
        }
        if (error.userAgent) {
          testDetails = addNewLine(testDetails, `Line number:${callSite.lineNum}`);
        }

        // currentTest.detailsTrace = error.callsite;
        // error.callsite.stackFrames.forEach(stackFrame => {
        //   console.log(stackFrame.getFileName());
        //   //console.log(stackFrame.toString());
        // });
      });
    } else {
      currentTest.status = Status.PASSED;
    }

    if (hasWarnings) {
      testRunInfo.warnings.forEach((warning: string) => {
        testMessages = addNewLine(testMessages, warning);
      });
    }

    currentTest.detailsMessage = testMessages;
    currentTest.detailsTrace = testDetails;
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
