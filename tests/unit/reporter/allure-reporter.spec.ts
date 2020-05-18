/* eslint-disable no-new, jest/no-commented-out-tests, jest/no-disabled-tests, jest/expect-expect  */
import { AllureConfig, AllureRuntime } from 'allure-js-commons';
import { InMemoryAllureWriter } from 'allure-js-commons/dist/src/writers';
import AllureReporter from '../../../src/reporter/allure-reporter';
import cleanAllureFolders from '../../../src/utils/clean-folders';

const mockedAllureConfig = (AllureConfig as unknown) as jest.Mock<typeof AllureConfig>;
const mockedAllureRuntime = (AllureRuntime as unknown) as jest.Mock<typeof AllureRuntime>;
// const mockedAllureTest = AllureTest as unknown as jest.Mock<typeof AllureTest>;
const mockedCleanAllureFolders = (cleanAllureFolders as unknown) as jest.Mock<typeof cleanAllureFolders>;

// Avoid unittests deleting files by mocking the clean-folders function.
// jest.mock('../../../src/utils/clean-folders');

// jest.mock('allure-js-commons');
// const mockStartGroup = jest.fn();
// const mockEndGroup = jest.fn();
// // const mockEndTest = jest.fn();
// jest.mock('allure-js-commons', () => {
//   return {
//     AllureConfig: jest.fn(),
//     AllureRuntime: jest.fn().mockImplementation(() => {
//       return {
//         constructor: () => { },
//         startGroup: mockStartGroup,
//         endGroup: mockEndGroup,
//       };
//     }),
//     // AllureTest: jest.fn().mockImplementation(() => {
//     //   return {
//     //     constructor: () => { },
//     //     mockEndTest: mockStartGroup,
//     //   };
//     // }),
//   };
// });

function generateTestReporter(): AllureReporter {
  const writer = new InMemoryAllureWriter();
  const allureConfig: AllureConfig = { resultsDir: 'test', writer };
  const reporter: AllureReporter = new AllureReporter(allureConfig);
  return reporter;
}

describe.skip('Allure reporter constructor', () => {
  beforeEach(() => {
    mockedAllureConfig.mockClear();
    mockedAllureRuntime.mockClear();
    mockedCleanAllureFolders.mockClear();
    // mockedAllureTest.mockClear();

    // mockStartGroup.mockClear();
    // mockEndGroup.mockClear();
  });

  it('Should instantiate an AllureRuntime', () => {
    new AllureReporter();

    expect(cleanAllureFolders).toHaveBeenCalledTimes(1);
    expect(AllureRuntime).toHaveBeenCalledTimes(1);
    expect(AllureConfig).toHaveBeenCalledTimes(1);
  });
  it('Should instantiate an AllureRuntime with a custom AllureConfig', () => {
    const writer = new InMemoryAllureWriter();
    const allureConfig: AllureConfig = { resultsDir: 'test', writer };
    new AllureReporter(allureConfig);

    expect(cleanAllureFolders).toHaveBeenCalledTimes(1);
    expect(AllureRuntime).toHaveBeenCalledTimes(1);
    expect(AllureRuntime).toBeCalledWith(allureConfig);
    expect(AllureConfig).not.toHaveBeenCalled();
  });
  it('Should throw error if test is started without a current group', () => {
    const reporter: AllureReporter = generateTestReporter();

    expect(() => {
      reporter.startTest('test', {});
    }).toThrow();
  });
  it('Should call Runtime when using groups', () => {
    const reporter: AllureReporter = generateTestReporter();
    const groupName: string = 'testGroup';
    const groupMeta: object = { testMeta: 'testMeta' };

    reporter.startGroup(groupName, groupMeta);
    // reporter.endGroup();

    // expect(mockStartGroup).toBeCalledWith(groupName);
  });
  // it('Should call Runtime when using tests, passed.', () => {
  //   const reporter: AllureReporter = generateTestReporter();
  //   const groupName: string = 'testGroup';
  //   const groupMeta: object = { severity: 'Normal' };
  //   const testName: string = 'testTest';
  //   const testMeta: object = {};

  //   reporter.startGroup(groupName, groupMeta);
  //   reporter.startTest(testName, testMeta);
  //   reporter.endTestPassed(testName, testMeta);
  //   reporter.endGroup();

  //   expect(mockEndTest).toBeCalledTimes(1);
  // });
});
