import AllureReporter from '../../../src/reporter/allure-reporter';
import { ErrorObject } from '../../../src/testcafe/models';
import { TestStep } from '../../../src/testcafe/step';

describe('Allure reporter - Merge Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should merge steps if they have the same name', () => {
    const reporter: AllureReporter = new AllureReporter();
    const testStepOne: TestStep = new TestStep('testStep', 1);
    const testStepTwo: TestStep = new TestStep('testStep', 2);
    const initalTestSteps: TestStep[] = [testStepOne, testStepTwo];
    const testStepFinal: TestStep = new TestStep('testStep', 3);
    const expectedTestSteps: TestStep[] = [testStepFinal];

    // @ts-ignore
    const actualTestSteps: TestStep[] = reporter.mergeSteps(initalTestSteps);

    // Check for the correct result
    expect(actualTestSteps).toStrictEqual(expectedTestSteps);

    // Check if the original list has not been edited
    expect(testStepOne.screenshotAmount).toBe(1);
    expect(testStepTwo.screenshotAmount).toBe(2);
  });

  it("Should not merge steps if they don't have the same name", () => {
    const reporter: AllureReporter = new AllureReporter();
    const testStepOne: TestStep = new TestStep('testStepOne', 1);
    const testStepTwo: TestStep = new TestStep('testStepTwo', 2);
    const initalTestSteps: TestStep[] = [testStepOne, testStepTwo];
    const expectedTestSteps: TestStep[] = [testStepOne, testStepTwo];

    // @ts-ignore
    const actualTestSteps: TestStep[] = reporter.mergeSteps(initalTestSteps);

    // Check for the correct result
    expect(actualTestSteps).toStrictEqual(expectedTestSteps);

    // Check if the original list has not been edited
    expect(testStepOne.screenshotAmount).toBe(1);
    expect(testStepTwo.screenshotAmount).toBe(2);
  });

  it('Should merge errors if they have the same message', () => {
    const reporter: AllureReporter = new AllureReporter();

    const errorOne: ErrorObject = { errMsg: 'error', userAgent: 'chrome' };
    const errorTwo: ErrorObject = { errMsg: 'error', userAgent: 'firefox' };
    const initalErrors: ErrorObject[] = [errorOne, errorTwo];

    const errorFinal: ErrorObject = { errMsg: 'error', userAgent: 'chrome, firefox' };
    const expectedErrors: ErrorObject[] = [errorFinal];

    // @ts-ignore
    const actualErrors: ErrorObject[] = reporter.mergeErrors(initalErrors);

    // Check for the correct result
    expect(actualErrors).toStrictEqual(expectedErrors);
  });

  it("Should not merge errors if they don't have the same message", () => {
    const reporter: AllureReporter = new AllureReporter();

    const errorOne: ErrorObject = { errMsg: 'errorOne', userAgent: 'chrome' };
    const errorTwo: ErrorObject = { errMsg: 'errorTwo', userAgent: 'firefox' };
    const initalErrors: ErrorObject[] = [errorOne, errorTwo];
    const expectedErrors: ErrorObject[] = [errorOne, errorTwo];

    // @ts-ignore
    const actualErrors: ErrorObject[] = reporter.mergeErrors(initalErrors);

    // Check for the correct result
    expect(actualErrors).toStrictEqual(expectedErrors);
  });

  it('Should not handle incorrect values on error merge', () => {
    const reporter: AllureReporter = new AllureReporter();

    const errorOne: ErrorObject = null;
    const errorTwo: ErrorObject = { errMsg: null, userAgent: 'firefox' };
    const initalErrors: ErrorObject[] = [errorOne, errorTwo];
    const expectedErrors: ErrorObject[] = [];

    // @ts-ignore
    const actualErrors: ErrorObject[] = reporter.mergeErrors(initalErrors);

    // Check for the correct result
    expect(actualErrors).toStrictEqual(expectedErrors);
  });

  it('Should not duplicate userAgents if they are the same', () => {
    const reporter: AllureReporter = new AllureReporter();

    const errorOne: ErrorObject = { errMsg: 'error', userAgent: 'chrome' };
    const errorTwo: ErrorObject = { errMsg: 'error', userAgent: 'chrome' };
    const initalErrors: ErrorObject[] = [errorOne, errorTwo];

    const errorFinal: ErrorObject = { errMsg: 'error', userAgent: 'chrome' };
    const expectedErrors: ErrorObject[] = [errorFinal];

    // @ts-ignore
    const actualErrors: ErrorObject[] = reporter.mergeErrors(initalErrors);

    // Check for the correct result
    expect(actualErrors).toStrictEqual(expectedErrors);
  });
});
