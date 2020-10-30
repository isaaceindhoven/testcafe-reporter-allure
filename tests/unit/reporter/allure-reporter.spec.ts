/* eslint-disable no-shadow,@typescript-eslint/no-use-before-define */
import {
  AllureConfig,
  AllureGroup,
  AllureRuntime,
  AllureStep,
  AllureTest,
  ContentType,
  Severity,
  Stage,
  Status,
} from 'allure-js-commons';
import * as fs from 'fs';
import AllureReporter from '../../../src/reporter/allure-reporter';
import Metadata from '../../../src/reporter/metadata';
import { Screenshot, TestRunInfo } from '../../../src/testcafe/models';
import { TestStep } from '../../../src/testcafe/step';
import { loadCategoriesConfig } from '../../../src/utils/config';

const mockGroupStartTest = jest.fn().mockImplementation(() => {
  return mockAllureTest;
});
const mockGroupEndGroup = jest.fn();
const mockReporterSetCurrentTest = jest.fn();
const mockReporterGetCurrentTestExists = jest.fn().mockImplementation(() => {
  return mockAllureTest;
});
const mockReporterGetCurrentTestNull = jest
  .fn()
  .mockImplementationOnce(() => {
    return null;
  })
  .mockImplementationOnce(() => {
    return mockAllureTest;
  });
const mockReporterStartTest = jest.fn();
const mockReporterAddScreenshotAttachments = jest.fn();
const mockReporterAddStepsWithAttachments = jest.fn();
const mockReporterAddScreenshotAttachment = jest.fn();
const mockRuntimeStartGroup = jest.fn().mockImplementation((name) => name);
const mockRuntimeEndGroup = jest.fn().mockImplementation((name) => name);
const mockRuntimeWriteCategoriesDefinitions = jest.fn();
const mockRuntimewriteEnvironmentInfo = jest.fn();
const mockRuntimeWriteAttachment = jest.fn().mockImplementation(() => 'filename.png');
const mockAddMetadataToTest = jest.fn();
const mockTestStepMergeOnSameName = jest.fn();
const mockMergeSteps = jest.fn().mockImplementation((steps) => {
  return steps;
});

const mockGetSteps = jest
  .fn()
  .mockImplementationOnce(() => {
    return null;
  })
  .mockImplementationOnce(() => {
    return [mockTestStep];
  });
const mockTestAddAttachment = jest.fn();
const mockTestEndTest = jest.fn();

const mockTestStartStep = jest.fn().mockImplementation(() => {
  return mockAllureStep;
});
const mockStepEndStep = jest.fn();

const mockGroupName: string = 'groupName';
const mockAllureTest: AllureTest = new AllureTest(null);
const mockAllureStep: AllureStep = new AllureStep(null);
const mockTestStep: TestStep = new TestStep('testStep');

jest.mock('allure-js-commons', () => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { Severity, Status, Stage, ContentType } = jest.requireActual('allure-js-commons');
  return {
    ContentType,
    Status,
    Severity,
    Stage,
    AllureConfig: jest.fn(),
    AllureRuntime: jest.fn().mockImplementation(() => {
      return {
        constructor: () => {},
        startGroup: mockRuntimeStartGroup,
        endGroup: mockRuntimeEndGroup,
        writeCategoriesDefinitions: mockRuntimeWriteCategoriesDefinitions,
        writeEnvironmentInfo: mockRuntimewriteEnvironmentInfo,
        writeAttachment: mockRuntimeWriteAttachment,
      };
    }),
    AllureGroup: jest.fn().mockImplementation(() => {
      return {
        name: mockGroupName,
        constructor: () => {},
        endGroup: mockGroupEndGroup,
        startTest: mockGroupStartTest,
      };
    }),
    AllureTest: jest.fn().mockImplementation(() => {
      return {
        constructor: () => {},
        endTest: mockTestEndTest,
        addAttachment: mockTestAddAttachment,
        startStep: mockTestStartStep,
      };
    }),
    AllureStep: jest.fn().mockImplementation(() => {
      return {
        status: null,
        constructor: () => {},
        endStep: mockStepEndStep,
      };
    }),
  };
});
jest.mock('../../../src/reporter/metadata', () => {
  return {
    default: jest.fn().mockImplementation(() => {
      return {
        severity: Severity.TRIVIAL,
        constructor: () => {},
        addMetadataToTest: mockAddMetadataToTest,
        getSteps: mockGetSteps,
      };
    }),
  };
});
jest.mock('../../../src/testcafe/step', () => {
  return {
    TestStep: jest.fn().mockImplementation(() => {
      return {
        name: 'testStep',
        screenshotAmount: 1,
        mergeOnSameName: mockTestStepMergeOnSameName,
        constructor: () => {},
      };
    }),
  };
});
jest.mock('uuid', () => ({ v4: () => '00000000-0000-0000-0000-000000000000' }));

describe('Allure reporter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Instancing', () => {
    it('Should instantiate an AllureRuntime if no custom config is given', () => {
      const reporter: AllureReporter = new AllureReporter();

      expect(AllureConfig).toHaveBeenCalledTimes(1);
      expect(AllureRuntime).toHaveBeenCalledTimes(1);

      // @ts-ignore
      expect(reporter.runtime).toBeDefined();
    });

    it('Should instantiate an AllureRuntime with a custom AllureConfig', () => {
      const allureConfig: AllureConfig = { resultsDir: 'test' };
      const reporter: AllureReporter = new AllureReporter(allureConfig);

      expect(AllureRuntime).toHaveBeenCalledTimes(1);
      expect(AllureRuntime).toBeCalledWith(allureConfig);
      expect(AllureConfig).not.toHaveBeenCalled();

      // @ts-ignore
      expect(reporter.runtime).toBeDefined();
    });

    it('Should write category globals to runtime if exists', () => {
      const reporter: AllureReporter = new AllureReporter();
      const categories = loadCategoriesConfig();

      reporter.setGlobals();

      expect(mockRuntimeWriteCategoriesDefinitions).toHaveBeenCalledTimes(1);
      expect(mockRuntimeWriteCategoriesDefinitions).toBeCalledWith(categories);
    });

    it('Should write userAgent environment globals to runtime', () => {
      const reporter: AllureReporter = new AllureReporter();
      const userAgents = ['chrome'];
      const userAgentsEnvironment = { browsers: userAgents.toString() };

      // @ts-ignore
      reporter.userAgents = ['chrome'];

      reporter.setGlobals();

      expect(mockRuntimewriteEnvironmentInfo).toHaveBeenCalledTimes(1);
      expect(mockRuntimewriteEnvironmentInfo).toBeCalledWith(userAgentsEnvironment);
    });

    it('Should not write userAgent environment globals to runtime if null', () => {
      const reporter: AllureReporter = new AllureReporter();

      // @ts-ignore
      reporter.userAgents = null;

      reporter.setGlobals();

      expect(mockRuntimewriteEnvironmentInfo).toHaveBeenCalledTimes(0);
    });
  });

  describe('Grouping', () => {
    it('Should start group correctly', () => {
      const reporter: AllureReporter = new AllureReporter();
      const groupName: string = 'testGroup';
      const groupMeta: object = { severity: Severity.TRIVIAL };

      reporter.startGroup(groupName, groupMeta);

      expect(Metadata).toHaveBeenCalledTimes(1);
      expect(Metadata).toBeCalledWith(groupMeta);
      // @ts-ignore
      expect(reporter.groupMetadata).toBeDefined();
      // @ts-ignore
      expect(reporter.groupMetadata.severity).toBe(groupMeta.severity);
      // @ts-ignore
      expect(reporter.groupMetadata.suite).toBe(groupName);
      expect(mockRuntimeStartGroup).toBeCalledWith(groupName);
      // @ts-ignore
      expect(reporter.group).toBeDefined();
    });

    it('Should end group correctly if one exists', () => {
      const reporter: AllureReporter = new AllureReporter();
      // @ts-ignore
      reporter.group = new AllureGroup(null);

      // @ts-ignore
      expect(reporter.group).toBeDefined();

      reporter.endGroup();

      expect(mockGroupEndGroup).toHaveBeenCalledTimes(1);
    });

    it('Should start test if a group exists', () => {
      const testName: string = 'testname';
      const testMeta: object = { severity: Severity.TRIVIAL };
      const reporter: AllureReporter = new AllureReporter();
      // @ts-ignore
      reporter.group = new AllureGroup(null);
      // @ts-ignore
      reporter.setCurrentTest = mockReporterSetCurrentTest;

      reporter.startTest(testName, testMeta);

      expect(mockGroupStartTest).toHaveBeenCalledTimes(1);
      expect(mockGroupStartTest).toBeCalledWith(testName);
      expect(mockReporterSetCurrentTest).toHaveBeenCalledTimes(1);

      expect(mockAllureTest.fullName).toBe(`${mockGroupName} : ${testName}`);
      expect(mockAllureTest.historyId).toBe('00000000-0000-0000-0000-000000000000');
      expect(mockAllureTest.stage).toBe(Stage.RUNNING);
    });

    it('Should not start test if no group exists', () => {
      const testName: string = 'testname';
      const testMeta: object = { severity: Severity.TRIVIAL };
      const reporter: AllureReporter = new AllureReporter();
      // @ts-ignore
      reporter.group = null;

      expect(() => {
        reporter.startTest(testName, testMeta);
      }).toThrow();

      expect(mockGroupStartTest).not.toHaveBeenCalled();
    });
  });

  describe('Test Processing', () => {
    it('Should end passing test with no steps', () => {
      const testName: string = 'testname';
      const testMeta: object = { severity: Severity.TRIVIAL };
      const testRunInfo: TestRunInfo = {};
      const reporter: AllureReporter = new AllureReporter();
      // @ts-ignore
      reporter.getCurrentTest = mockReporterGetCurrentTestExists;
      // @ts-ignore
      reporter.addScreenshotAttachments = mockReporterAddScreenshotAttachments;

      reporter.endTest(testName, testRunInfo, testMeta);

      expect(mockReporterGetCurrentTestExists).toBeCalledTimes(1);
      expect(Metadata).toHaveBeenCalledTimes(1);
      expect(Metadata).toBeCalledWith(testMeta, true);
      expect(mockAddMetadataToTest).toHaveBeenCalledTimes(1);
      expect(mockGetSteps).toBeCalledTimes(1);
      expect(mockReporterAddScreenshotAttachments).toBeCalledTimes(1);

      expect(mockAllureTest.status).toBe(Status.PASSED);
      expect(mockAllureTest.detailsMessage).toBe('');
      expect(mockAllureTest.detailsTrace).toBe('');
      expect(mockAllureTest.stage).toBe(Stage.FINISHED);
      expect(mockTestEndTest).toBeCalledTimes(1);
    });

    it('Should end passing test with steps', () => {
      const testName: string = 'testname';
      const testMeta: object = { severity: Severity.TRIVIAL };
      const testRunInfo: TestRunInfo = {};
      const reporter: AllureReporter = new AllureReporter();
      // @ts-ignore
      reporter.getCurrentTest = mockReporterGetCurrentTestExists;
      // @ts-ignore
      reporter.addStepsWithAttachments = mockReporterAddStepsWithAttachments;

      reporter.endTest(testName, testRunInfo, testMeta);

      expect(mockReporterGetCurrentTestExists).toBeCalledTimes(1);
      expect(Metadata).toHaveBeenCalledTimes(1);
      expect(Metadata).toBeCalledWith(testMeta, true);
      expect(mockAddMetadataToTest).toHaveBeenCalledTimes(1);
      expect(mockGetSteps).toBeCalledTimes(1);
      expect(mockReporterAddStepsWithAttachments).toBeCalledTimes(1);

      expect(mockAllureTest.status).toBe(Status.PASSED);
      expect(mockAllureTest.detailsMessage).toBe('');
      expect(mockAllureTest.detailsTrace).toBe('');
      expect(mockAllureTest.stage).toBe(Stage.FINISHED);
      expect(mockTestEndTest).toBeCalledTimes(1);
    });

    it('Should end skipped test', () => {
      const testName: string = 'testname';
      const testMeta: object = { severity: Severity.TRIVIAL };
      const testRunInfo: TestRunInfo = { skipped: true };
      const reporter: AllureReporter = new AllureReporter();
      // @ts-ignore
      reporter.getCurrentTest = mockReporterGetCurrentTestExists;

      reporter.endTest(testName, testRunInfo, testMeta);

      expect(mockReporterGetCurrentTestExists).toBeCalledTimes(1);
      expect(mockAllureTest.status).toBe(Status.SKIPPED);
      expect(mockAllureTest.detailsMessage).toBe('');
      expect(mockAllureTest.detailsTrace).toBe('');
      expect(mockAllureTest.stage).toBe(Stage.FINISHED);
      expect(mockTestEndTest).toBeCalledTimes(1);
    });

    it('Should add warnings to ended test', () => {
      const testName: string = 'testname';
      const testMeta: object = { severity: Severity.TRIVIAL };
      const testWarnings: string[] = ['warning1', 'warning2'];
      const testRunInfo: TestRunInfo = { warnings: testWarnings };
      const reporter: AllureReporter = new AllureReporter();
      // @ts-ignore
      reporter.getCurrentTest = mockReporterGetCurrentTestExists;

      reporter.endTest(testName, testRunInfo, testMeta);

      expect(mockReporterGetCurrentTestExists).toBeCalledTimes(1);
      expect(mockAllureTest.status).toBe(Status.PASSED);
      expect(mockAllureTest.detailsMessage).toEqual('warning1\nwarning2');
      expect(mockAllureTest.detailsTrace).toBe('');
      expect(mockAllureTest.stage).toBe(Stage.FINISHED);
      expect(mockTestEndTest).toBeCalledTimes(1);
    });

    it('Should add errors to ended test', () => {
      const testName: string = 'testname';
      const testMeta: object = { severity: Severity.TRIVIAL };
      const testError: any = {
        callsite: {
          filename: 'testFilename',
          lineNum: 'testLineNum',
        },
        userAgent: 'testUserAgent',
        errMsg: 'testErrorMessage',
      };
      const testErrors: any[] = [testError];
      const testRunInfo: TestRunInfo = { errs: testErrors };
      const reporter: AllureReporter = new AllureReporter();
      // @ts-ignore
      reporter.getCurrentTest = mockReporterGetCurrentTestExists;

      reporter.endTest(testName, testRunInfo, testMeta);

      expect(mockReporterGetCurrentTestExists).toBeCalledTimes(1);
      expect(mockAllureTest.status).toBe(Status.FAILED);
      expect(mockAllureTest.detailsMessage).toBe(testError.errMsg);
      expect(mockAllureTest.detailsTrace).toBe(
        `File name: ${testError.callsite.filename}\nLine number: ${testError.callsite.lineNum}\nUser Agent(s): ${testError.userAgent}`,
      );
      expect(mockAllureTest.stage).toBe(Stage.FINISHED);
      expect(mockTestEndTest).toBeCalledTimes(1);
    });

    it('Should not add empty errors to ended test', () => {
      const testName: string = 'testname';
      const testMeta: object = { severity: Severity.TRIVIAL };
      const testError: any = { callsite: {} };
      const testErrors: any[] = [testError];
      const testRunInfo: TestRunInfo = { errs: testErrors };
      const reporter: AllureReporter = new AllureReporter();
      // @ts-ignore
      reporter.getCurrentTest = mockReporterGetCurrentTestExists;

      reporter.endTest(testName, testRunInfo, testMeta);

      expect(mockReporterGetCurrentTestExists).toBeCalledTimes(1);
      expect(mockAllureTest.status).toBe(Status.FAILED);
      expect(mockAllureTest.detailsMessage).toBe('');
      expect(mockAllureTest.detailsTrace).toBe('');
      expect(mockAllureTest.stage).toBe(Stage.FINISHED);
      expect(mockTestEndTest).toBeCalledTimes(1);
    });

    it('Should not add empty callsite errors to ended test', () => {
      const testName: string = 'testname';
      const testMeta: object = { severity: Severity.TRIVIAL };
      const testError: any = {};
      const testErrors: any[] = [testError];
      const testRunInfo: TestRunInfo = { errs: testErrors };
      const reporter: AllureReporter = new AllureReporter();
      // @ts-ignore
      reporter.getCurrentTest = mockReporterGetCurrentTestExists;

      reporter.endTest(testName, testRunInfo, testMeta);

      expect(mockReporterGetCurrentTestExists).toBeCalledTimes(1);
      expect(mockAllureTest.status).toBe(Status.FAILED);
      expect(mockAllureTest.detailsMessage).toBe('');
      expect(mockAllureTest.detailsTrace).toBe('');
      expect(mockAllureTest.stage).toBe(Stage.FINISHED);
      expect(mockTestEndTest).toBeCalledTimes(1);
    });

    it('Should start new test if non-existing test is ended', () => {
      const testName: string = 'testname';
      const testMeta: object = { severity: Severity.TRIVIAL };
      const testRunInfo: TestRunInfo = {};
      const reporter: AllureReporter = new AllureReporter();
      // @ts-ignore
      reporter.getCurrentTest = mockReporterGetCurrentTestNull;
      // @ts-ignore
      reporter.startTest = mockReporterStartTest;

      reporter.endTest(testName, testRunInfo, testMeta);

      expect(mockReporterGetCurrentTestNull).toBeCalledTimes(2);
      expect(mockReporterStartTest).toBeCalledTimes(1);
      expect(mockReporterStartTest).toBeCalledWith(testName, testMeta);
    });
  });

  describe('Helper Functions', () => {
    it('Should add screenshots to an ended test without steps', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'readFileSync').mockReturnValue('');

      const testScreenshotManual: Screenshot = { screenshotPath: 'testPathOnManual', takenOnFail: false };
      const testScreenshotOnFail: Screenshot = { screenshotPath: 'testPathOnFail', takenOnFail: true };
      const testScreenshots: Screenshot[] = [testScreenshotManual, testScreenshotOnFail];
      const testRunInfo: TestRunInfo = { screenshots: testScreenshots };
      const reporter: AllureReporter = new AllureReporter();
      // @ts-ignore
      reporter.addScreenshotAttachments(mockAllureTest, testRunInfo);

      expect(mockTestAddAttachment).toBeCalledTimes(2);
      expect(mockTestAddAttachment).toBeCalledWith('Screenshot taken manually', ContentType.PNG, 'filename.png');
      expect(mockTestAddAttachment).toBeCalledWith('Screenshot taken on fail', ContentType.PNG, 'filename.png');
    });

    it('Should add screenshots to an ended test with steps', () => {
      const testScreenshotManual: Screenshot = { screenshotPath: 'testPathOnManual', takenOnFail: false };
      const testScreenshotOnFail: Screenshot = { screenshotPath: 'testPathOnFail', takenOnFail: true };
      const testScreenshots: Screenshot[] = [testScreenshotManual, testScreenshotOnFail];
      const testStepSuccess: TestStep = new TestStep('testStepSuccesfull');
      const testStepFailed: TestStep = new TestStep('testStepFailed');
      const testSteps: TestStep[] = [testStepSuccess, testStepFailed];
      const testRunInfo: TestRunInfo = { screenshots: testScreenshots };
      const reporter: AllureReporter = new AllureReporter();

      // @ts-ignore
      reporter.mergeSteps = mockMergeSteps;
      // @ts-ignore
      reporter.addScreenshotAttachment = mockReporterAddScreenshotAttachment;

      // @ts-ignore
      reporter.addStepsWithAttachments(mockAllureTest, testRunInfo, testSteps);

      expect(mockTestStartStep).toBeCalledTimes(2);
      expect(mockTestStartStep).toBeCalledWith(testStepSuccess.name);
      expect(mockTestStartStep).toBeCalledWith(testStepFailed.name);

      expect(mockMergeSteps).toBeCalledTimes(1);
      expect(mockReporterAddScreenshotAttachment).toBeCalledTimes(2);
    });

    it('Should not add screenshots to steps if testStep screenshotAmount is not > 0', () => {
      const testScreenshotManual: Screenshot = { screenshotPath: 'testPathOnManual', takenOnFail: false };
      const testScreenshots: Screenshot[] = [testScreenshotManual];
      const testStepSuccess: TestStep = new TestStep('testStepSuccesfull');
      testStepSuccess.screenshotAmount = 0;
      const testSteps: TestStep[] = [testStepSuccess];
      const testRunInfo: TestRunInfo = { screenshots: testScreenshots };
      const reporter: AllureReporter = new AllureReporter();

      // @ts-ignore
      reporter.mergeSteps = mockMergeSteps;
      // @ts-ignore
      reporter.addScreenshotAttachment = mockReporterAddScreenshotAttachment;

      // @ts-ignore
      reporter.addStepsWithAttachments(mockAllureTest, testRunInfo, testSteps);

      expect(mockTestStartStep).toBeCalledTimes(1);
      expect(mockTestStartStep).toBeCalledWith(testStepSuccess.name);

      expect(mockMergeSteps).toBeCalledTimes(1);
      expect(mockReporterAddScreenshotAttachment).not.toBeCalled();
    });

    it('Should not add screenshot if path is null', () => {
      const testScreenshotManual: Screenshot = { screenshotPath: null, takenOnFail: false };
      const reporter: AllureReporter = new AllureReporter();

      // @ts-ignore
      reporter.addScreenshotAttachment(mockAllureTest, testScreenshotManual);

      expect(mockTestAddAttachment).not.toBeCalled();
    });

    it('Should set and get current test', () => {
      const reporter: AllureReporter = new AllureReporter();
      const test: AllureTest = new AllureTest(null);
      const testName: string = 'test';
      // @ts-ignore
      reporter.setCurrentTest(testName, test);

      // @ts-ignore
      expect(reporter.getCurrentTest(testName)).toBe(test);
    });

    it('Should return null if test could not be found', () => {
      const reporter: AllureReporter = new AllureReporter();
      const testName: string = 'test';

      // @ts-ignore
      expect(reporter.getCurrentTest(testName)).toBe(null);
    });

    it('Should return null if testName is null', () => {
      const reporter: AllureReporter = new AllureReporter();
      const testName: string = null;

      // @ts-ignore
      expect(reporter.getCurrentTest(testName)).toBe(null);
    });
  });
});
