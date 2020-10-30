/* eslint-disable @typescript-eslint/no-unused-vars,class-methods-use-this */
import {
  AllureConfig,
  AllureGroup,
  AllureRuntime,
  AllureStep,
  AllureTest,
  Category,
  ContentType,
  ExecutableItemWrapper,
  Stage,
  Status,
} from 'allure-js-commons';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import { ErrorObject, Screenshot, TestRunInfo } from '../testcafe/models';
import { TestStep } from '../testcafe/step';
import { loadCategoriesConfig, loadReporterConfig } from '../utils/config';
import addNewLine from '../utils/utils';
import Metadata from './metadata';

const reporterConfig = loadReporterConfig();
const categoriesConfig: Category[] = loadCategoriesConfig();

export default class AllureReporter {
  private runtime: AllureRuntime = null;

  private userAgents: string[] = null;

  /* TestCafé does not run the groups concurrently when running the tests concurrently and will end the tests sequentially based on their group/fixture.
  This allows for only a single group and group meta to be stored at once.
  Saving them in the same way as the tests is also not possible because TestCafé does not call the reporter when a group has ended it is, therefore, not possible to end the groups based on their name. */
  private group: AllureGroup = null;

  private groupMetadata: Metadata;

  /* To differentiate between the running tests when running concurrently they are stored using their name as the unique key. */
  private tests: { [name: string]: AllureTest } = {};

  constructor(allureConfig?: AllureConfig, userAgents?: string[]) {
    let config: AllureConfig;
    if (!allureConfig) {
      config = new AllureConfig(reporterConfig.RESULT_DIR);
    } else {
      config = allureConfig;
    }

    this.userAgents = userAgents;
    this.runtime = new AllureRuntime(config);
  }

  public setGlobals(): void {
    // Writing the globals has to be done after the first group has been written for a currently unknown reason.
    // Best to call this function in reporterTaskEnd and to write it as the last thing.
    this.runtime.writeCategoriesDefinitions(categoriesConfig);
    if (this.userAgents) {
      this.runtime.writeEnvironmentInfo({ browsers: this.userAgents.toString() });
    }
  }

  public startGroup(name: string, meta: object): void {
    this.groupMetadata = new Metadata(meta);
    this.groupMetadata.suite = name;
    this.group = this.runtime.startGroup(name);
  }

  public endGroup(): void {
    const currentGroup = this.group;
    if (currentGroup !== null) {
      currentGroup.endGroup();
    }
  }

  public startTest(name: string, meta: object): void {
    const currentGroup = this.group;
    if (currentGroup === null) {
      throw new Error('No active suite');
    }

    const currentTest = currentGroup.startTest(name);
    currentTest.fullName = `${currentGroup.name} : ${name}`;
    currentTest.historyId = uuid();
    currentTest.stage = Stage.RUNNING;

    this.setCurrentTest(name, currentTest);
  }

  public endTest(name: string, testRunInfo: TestRunInfo, meta: object): void {
    let currentTest = this.getCurrentTest(name);

    // If no currentTest exists create a new one
    if (currentTest === null) {
      this.startTest(name, meta);
      currentTest = this.getCurrentTest(name);
    }

    const hasErrors = !!testRunInfo.errs && !!testRunInfo.errs.length;
    const hasWarnings = !!testRunInfo.warnings && !!testRunInfo.warnings.length;
    const isSkipped = testRunInfo.skipped;

    let testMessages: string = '';
    let testDetails: string = '';

    if (isSkipped) {
      currentTest.status = Status.SKIPPED;
    } else if (hasErrors) {
      currentTest.status = Status.FAILED;

      const mergedErrors = this.mergeErrors(testRunInfo.errs);

      mergedErrors.forEach((error: ErrorObject) => {
        if (error.errMsg) {
          testMessages = addNewLine(testMessages, error.errMsg);
        }

        // TODO: Add detailed error stacktrace
        // How to convert CallSiteRecord to stacktrace?
        const callSite = error.callsite;
        if (callSite) {
          if (callSite.filename) {
            testDetails = addNewLine(testDetails, `File name: ${callSite.filename}`);
          }
          if (callSite.lineNum) {
            testDetails = addNewLine(testDetails, `Line number: ${callSite.lineNum}`);
          }
        }
        if (error.userAgent) {
          testDetails = addNewLine(testDetails, `User Agent(s): ${error.userAgent}`);
        }
      });
    } else {
      currentTest.status = Status.PASSED;
    }

    if (hasWarnings) {
      testRunInfo.warnings.forEach((warning: string) => {
        testMessages = addNewLine(testMessages, warning);
      });
    }

    const currentMetadata = new Metadata(meta, true);
    if (testRunInfo.unstable) {
      currentMetadata.setFlaky();
    }
    if (currentMetadata.flaky) {
      testMessages = addNewLine(testMessages, reporterConfig.LABEL.FLAKY);
    }
    currentMetadata.addMetadataToTest(currentTest, this.groupMetadata);

    // If steps exist handle them, if not add screenshots to base of the test.
    const testSteps: TestStep[] = currentMetadata.getSteps();
    if (testSteps) {
      this.addStepsWithAttachments(currentTest, testRunInfo, testSteps);
    } else {
      this.addScreenshotAttachments(currentTest, testRunInfo);
    }

    currentTest.detailsMessage = testMessages;
    currentTest.detailsTrace = testDetails;
    currentTest.stage = Stage.FINISHED;
    currentTest.endTest();
  }

  /* To add the screenshots to the correct test steps they have to be loaded from testRunInfo.screenshots.
  Because of how the screenshots are registered within TestCafé the only data the TestStep has via the metadata is the amount
  of screenshots taken an no reference to which screeshot was taken.
  However because both the screenshots and the TestSteps are saved chronologically it can be determined what screenshots are part
  each TestStep by keeping an index of the current screenshot and the number of screenshots taken per TestStep and looping through them. */
  private addStepsWithAttachments(test: AllureTest, testRunInfo: TestRunInfo, steps: TestStep[]) {
    const mergedSteps = this.mergeSteps(steps);

    const stepAmount: number = mergedSteps.length;
    const stepLastIndex: number = stepAmount - 1;
    let screenshotIndex: number = 0;

    for (let i = 0; i < stepAmount; i += 1) {
      const testStep: TestStep = mergedSteps[i];
      const allureStep: AllureStep = test.startStep(testStep.name);

      if (testStep.screenshotAmount && testStep.screenshotAmount > 0) {
        for (let j = 0; j < testStep.screenshotAmount; j += 1) {
          const screenshot: Screenshot = testRunInfo.screenshots[screenshotIndex];

          this.addScreenshotAttachment(allureStep, screenshot);

          screenshotIndex += 1;
        }
      }

      /* Steps do not record the state they finished because this data is not available from TestCafé.
      If a step is not last it can be assumed that the step was successfull because otherwise the test would of stopped earlier.
      If a step is last the status from the test itself should be copied. */
      if (i === stepLastIndex) {
        allureStep.status = test.status;
      } else {
        allureStep.status = Status.PASSED;
      }

      allureStep.stage = Stage.FINISHED;
      allureStep.endStep();
    }
  }

  private addScreenshotAttachments(test: AllureTest, testRunInfo: TestRunInfo): void {
    if (testRunInfo.screenshots) {
      testRunInfo.screenshots.forEach((screenshot: Screenshot) => {
        this.addScreenshotAttachment(test, screenshot);
      });
    }
  }

  private addScreenshotAttachment(test: ExecutableItemWrapper, screenshot: Screenshot): void {
    if (screenshot.screenshotPath && fs.existsSync(screenshot.screenshotPath)) {
      let screenshotName: string;
      if (screenshot.takenOnFail) {
        screenshotName = reporterConfig.LABEL.SCREENSHOT_ON_FAIL;
      } else {
        screenshotName = reporterConfig.LABEL.SCREENSHOT_MANUAL;
      }

      // Add the useragent data to the screenshots to differentiate between browsers within the tests.
      if (this.userAgents && this.userAgents.length > 1 && screenshot.userAgent) {
        screenshotName = `${screenshotName} - ${screenshot.userAgent}`;
      }

      const img = fs.readFileSync(screenshot.screenshotPath);

      const file = this.runtime.writeAttachment(img, ContentType.PNG);
      test.addAttachment(screenshotName, ContentType.PNG, file);
    }
  }

  /* Merge the steps together based on their name. */
  private mergeSteps(steps: TestStep[]): TestStep[] {
    const mergedSteps: TestStep[] = [];
    steps.forEach((step) => {
      if (step && step.name) {
        let stepExists: boolean = false;
        mergedSteps.forEach((mergedStep) => {
          stepExists = mergedStep.mergeOnSameName(step);
        });
        if (!stepExists) {
          mergedSteps.push(new TestStep(step.name, step.screenshotAmount));
        }
      }
    });
    return mergedSteps;
  }

  /* Merge the errors together based on their message. */
  private mergeErrors(errors: ErrorObject[]): ErrorObject[] {
    const mergedErrors: ErrorObject[] = [];
    errors.forEach((error) => {
      if (error && error.errMsg) {
        let errorExists: boolean = false;
        mergedErrors.forEach((mergedError) => {
          if (error.errMsg === mergedError.errMsg) {
            errorExists = true;
            if (error.userAgent && mergedError.userAgent !== error.userAgent) {
              /* eslint-disable-next-line no-param-reassign */
              mergedError.userAgent = `${mergedError.userAgent}, ${error.userAgent}`;
            }
          }
        });
        if (!errorExists) {
          mergedErrors.push(error);
        }
      }
    });
    return mergedErrors;
  }

  private getCurrentTest(name: string): AllureTest | null {
    if (name) {
      const allureTest: AllureTest = this.tests[name.toString()];
      if (allureTest) {
        return allureTest;
      }
    }
    return null;
  }

  private setCurrentTest(name: string, test: AllureTest): void {
    if (name && test) {
      this.tests[name] = test;
    }
  }
}
