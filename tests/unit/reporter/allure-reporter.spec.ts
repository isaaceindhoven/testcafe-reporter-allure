/* eslint-disable no-shadow */
import { AllureConfig, AllureGroup, AllureRuntime, AllureTest, Severity, Stage, Status } from 'allure-js-commons';
import AllureReporter from '../../../src/reporter/allure-reporter';
import Metadata from '../../../src/reporter/metadata';
import { loadCategoriesConfig } from '../../../src/utils/config';

const mockRuntimeStartGroup = jest.fn().mockImplementation((name) => name);
const mockRuntimeEndGroup = jest.fn().mockImplementation((name) => name);
const mockGroupEndGroup = jest.fn();
const mockAllureTest: AllureTest = new AllureTest(null);
const mockGroupName = 'groupName';
const mockGroupStartTest = jest.fn().mockImplementation(() => {
  return mockAllureTest;
});
const mockWriteCategoriesDefinitions = jest.fn();
const mockReporterGetCurrentGroupExists = jest.fn().mockImplementation(() => {
  return new AllureGroup(null);
});
const mockReporterGetCurrentGroupNull = jest.fn().mockImplementation(() => {
  return null;
});
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
const mockAddMetadataToTest = jest.fn();

jest.mock('allure-js-commons', () => {
  const { Severity, Status, Stage } = jest.requireActual('allure-js-commons');
  return {
    Status,
    Severity,
    Stage,
    AllureConfig: jest.fn(),
    AllureRuntime: jest.fn().mockImplementation(() => {
      return {
        constructor: () => {},
        startGroup: mockRuntimeStartGroup,
        endGroup: mockRuntimeEndGroup,
        writeCategoriesDefinitions: mockWriteCategoriesDefinitions,
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
        endTest: mockRuntimeStartGroup,
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
      };
    }),
  };
});

describe('Allure reporter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
  it('Should write globals to runtime', () => {
    const reporter: AllureReporter = new AllureReporter();
    const categories = loadCategoriesConfig();

    reporter.setGlobals();

    expect(mockWriteCategoriesDefinitions).toHaveBeenCalledTimes(1);
    expect(mockWriteCategoriesDefinitions).toBeCalledWith(categories);
  });
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
    expect(reporter.groups.length).toBe(1);
  });
  it('Should end group correctly if one exists', () => {
    const reporter: AllureReporter = new AllureReporter();
    // @ts-ignore
    reporter.getCurrentGroup = mockReporterGetCurrentGroupExists;
    // @ts-ignore
    reporter.groups.push({});

    // @ts-ignore
    expect(reporter.groups.length).toBe(1);

    reporter.endGroup();

    expect(mockReporterGetCurrentGroupExists).toHaveBeenCalledTimes(1);
    expect(mockGroupEndGroup).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(reporter.groups.length).toBe(0);
  });
  it('Should not end group if none exist', () => {
    const reporter: AllureReporter = new AllureReporter();
    // @ts-ignore
    reporter.getCurrentGroup = mockReporterGetCurrentGroupNull;
    // @ts-ignore
    reporter.groups.push({});

    // @ts-ignore
    expect(reporter.groups.length).toBe(1);

    reporter.endGroup();

    expect(mockReporterGetCurrentGroupNull).toHaveBeenCalledTimes(1);
    expect(mockGroupEndGroup).toHaveBeenCalledTimes(0);
    // @ts-ignore
    expect(reporter.groups.length).toBe(1);
  });
  it('Should start test if a group exists', () => {
    const testName: string = 'testname';
    const testMeta: object = { severity: Severity.TRIVIAL };
    const reporter: AllureReporter = new AllureReporter();
    // @ts-ignore
    reporter.getCurrentGroup = mockReporterGetCurrentGroupExists;
    // @ts-ignore
    reporter.setCurrentTest = mockReporterSetCurrentTest;

    reporter.startTest(testName, testMeta);

    expect(mockReporterGetCurrentGroupExists).toHaveBeenCalledTimes(1);
    expect(mockGroupStartTest).toHaveBeenCalledTimes(1);
    expect(mockGroupStartTest).toBeCalledWith(testName);
    expect(mockReporterSetCurrentTest).toHaveBeenCalledTimes(1);

    expect(mockAllureTest.fullName).toBe(`${mockGroupName} : ${testName}`);
    expect(mockAllureTest.historyId).toBe(testName);
    expect(mockAllureTest.stage).toBe(Stage.RUNNING);
  });
  it('Should not start test if no group exists', () => {
    const testName: string = 'testname';
    const testMeta: object = { severity: Severity.TRIVIAL };
    const reporter: AllureReporter = new AllureReporter();
    // @ts-ignore
    reporter.getCurrentGroup = mockReporterGetCurrentGroupNull;

    expect(() => {
      reporter.startTest(testName, testMeta);
    }).toThrow();

    expect(mockGroupStartTest).not.toHaveBeenCalled();
  });
  it('Should end passing test', () => {
    const testName: string = 'testname';
    const testMeta: object = { severity: Severity.TRIVIAL };
    const testRunInfo: any = {};
    const reporter: AllureReporter = new AllureReporter();
    // @ts-ignore
    reporter.getCurrentTest = mockReporterGetCurrentTestExists;

    reporter.endTest(testName, testRunInfo, testMeta);

    expect(Metadata).toHaveBeenCalledTimes(1);
    expect(Metadata).toBeCalledWith(testMeta, true);
    expect(mockAddMetadataToTest).toHaveBeenCalledTimes(1);
    expect(mockReporterGetCurrentTestExists).toBeCalledTimes(1);
    expect(mockAllureTest.status).toBe(Status.PASSED);
    expect(mockAllureTest.detailsMessage).toBe(null);
    expect(mockAllureTest.detailsTrace).toBe(null);
    expect(mockAllureTest.stage).toBe(Stage.FINISHED);
  });
  it('Should end skipped test', () => {
    const testName: string = 'testname';
    const testMeta: object = { severity: Severity.TRIVIAL };
    const testRunInfo: any = { skipped: true };
    const reporter: AllureReporter = new AllureReporter();
    // @ts-ignore
    reporter.getCurrentTest = mockReporterGetCurrentTestExists;

    reporter.endTest(testName, testRunInfo, testMeta);

    expect(mockReporterGetCurrentTestExists).toBeCalledTimes(1);
    expect(mockAllureTest.status).toBe(Status.SKIPPED);
    expect(mockAllureTest.detailsMessage).toBe(null);
    expect(mockAllureTest.detailsTrace).toBe(null);
    expect(mockAllureTest.stage).toBe(Stage.FINISHED);
  });
  it('Should add warnings to ended test', () => {
    const testName: string = 'testname';
    const testMeta: object = { severity: Severity.TRIVIAL };
    const testWarnings: string[] = ['warning1', 'warning2'];
    const testRunInfo: any = { warnings: testWarnings };
    const reporter: AllureReporter = new AllureReporter();
    // @ts-ignore
    reporter.getCurrentTest = mockReporterGetCurrentTestExists;

    reporter.endTest(testName, testRunInfo, testMeta);

    expect(mockReporterGetCurrentTestExists).toBeCalledTimes(1);
    expect(mockAllureTest.status).toBe(Status.PASSED);
    expect(mockAllureTest.detailsMessage).toBe('warning1\nwarning2');
    expect(mockAllureTest.detailsTrace).toBe(null);
    expect(mockAllureTest.stage).toBe(Stage.FINISHED);
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
    const testRunInfo: any = { errs: testErrors };
    const reporter: AllureReporter = new AllureReporter();
    // @ts-ignore
    reporter.getCurrentTest = mockReporterGetCurrentTestExists;

    reporter.endTest(testName, testRunInfo, testMeta);

    expect(mockReporterGetCurrentTestExists).toBeCalledTimes(1);
    expect(mockAllureTest.status).toBe(Status.FAILED);
    expect(mockAllureTest.detailsMessage).toBe(testError.errMsg);
    expect(mockAllureTest.detailsTrace).toBe(
      `User Agent: ${testError.userAgent}\nFile name: ${testError.callsite.filename}\nLine number: ${testError.callsite.lineNum}`,
    );
    expect(mockAllureTest.stage).toBe(Stage.FINISHED);
  });
  it('Should not add empty errors to ended test', () => {
    const testName: string = 'testname';
    const testMeta: object = { severity: Severity.TRIVIAL };
    const testError: any = { callsite: {} };
    const testErrors: any[] = [testError];
    const testRunInfo: any = { errs: testErrors };
    const reporter: AllureReporter = new AllureReporter();
    // @ts-ignore
    reporter.getCurrentTest = mockReporterGetCurrentTestExists;

    reporter.endTest(testName, testRunInfo, testMeta);

    expect(mockReporterGetCurrentTestExists).toBeCalledTimes(1);
    expect(mockAllureTest.status).toBe(Status.FAILED);
    expect(mockAllureTest.detailsMessage).toBe(null);
    expect(mockAllureTest.detailsTrace).toBe(null);
    expect(mockAllureTest.stage).toBe(Stage.FINISHED);
  });
  it('Should not add empty callsite errors to ended test', () => {
    const testName: string = 'testname';
    const testMeta: object = { severity: Severity.TRIVIAL };
    const testError: any = {};
    const testErrors: any[] = [testError];
    const testRunInfo: any = { errs: testErrors };
    const reporter: AllureReporter = new AllureReporter();
    // @ts-ignore
    reporter.getCurrentTest = mockReporterGetCurrentTestExists;

    reporter.endTest(testName, testRunInfo, testMeta);

    expect(mockReporterGetCurrentTestExists).toBeCalledTimes(1);
    expect(mockAllureTest.status).toBe(Status.FAILED);
    expect(mockAllureTest.detailsMessage).toBe(null);
    expect(mockAllureTest.detailsTrace).toBe(null);
    expect(mockAllureTest.stage).toBe(Stage.FINISHED);
  });
  it('Should start new test if non-existing test is ended', () => {
    const testName: string = 'testname';
    const testMeta: object = { severity: Severity.TRIVIAL };
    const testRunInfo: any = {};
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
  it('Should get current group', () => {
    const reporter: AllureReporter = new AllureReporter();
    const otherGroup: AllureGroup = new AllureGroup(null);
    const expectedGroup: AllureGroup = new AllureGroup(null);
    // @ts-ignore
    reporter.groups = [otherGroup, expectedGroup];

    // @ts-ignore
    const actualGroup = reporter.getCurrentGroup();

    expect(actualGroup).toBe(expectedGroup);
    expect(actualGroup).not.toBe(otherGroup);
  });
  it('Should return null if no groups available', () => {
    const reporter: AllureReporter = new AllureReporter();

    // @ts-ignore
    const actualGroup = reporter.getCurrentGroup();

    expect(actualGroup).toBe(null);
  });
  it('Should set current test', () => {
    const reporter: AllureReporter = new AllureReporter();
    const test: AllureTest = new AllureTest(null);
    // @ts-ignore
    reporter.setCurrentTest(test);

    // @ts-ignore
    expect(reporter.runningTest).toBe(test);
  });
  it('Should get current test', () => {
    const reporter: AllureReporter = new AllureReporter();
    const expectedTest: AllureTest = new AllureTest(null);
    // @ts-ignore
    reporter.runningTest = expectedTest;

    // @ts-ignore
    const actualTest = reporter.getCurrentTest();

    // @ts-ignore
    expect(expectedTest).toBe(actualTest);
  });
});
