import { TestStep } from '../../../src/testcafe/step';
import { loadReporterConfig } from '../../../src/utils/config';

const reporterConfig = loadReporterConfig();

describe('TestStep', () => {
  it('Should initialise correctly with a name', () => {
    const stepName = 'TestStep';
    const step: TestStep = new TestStep(stepName);

    expect(step.screenshotAmount).toBe(0);
    expect(step.name).toBe(stepName);
  });
  it('Should initialise correctly without a name', () => {
    const stepName = null;
    const step: TestStep = new TestStep(stepName);

    expect(step.screenshotAmount).toBe(0);
    expect(step.name).toBe(reporterConfig.LABEL.DEFAULT_STEP_NAME);
  });
  it('Should register a screenshot', () => {
    const stepName = 'TestStep';
    const step: TestStep = new TestStep(stepName);

    step.registerScreenshot();

    expect(step.screenshotAmount).toBe(1);
  });
  it('Should get meta from a testcontroller', () => {
    const stepName = 'TestStep';
    const step: TestStep = new TestStep(stepName);
    const expectedMeta: any = {};
    const testcontroller = { testRun: { test: { meta: expectedMeta } } };

    // @ts-ignore
    const actualMeta = step.getMeta(testcontroller);

    expect(actualMeta).toBe(expectedMeta);
  });
  it('Should create a new meta if none exists', () => {
    const stepName = 'TestStep';
    const step: TestStep = new TestStep(stepName);
    const testcontroller = { testRun: { test: { meta: null } } };

    // @ts-ignore
    const actualMeta = step.getMeta(testcontroller);

    expect(actualMeta).toBeDefined();
    expect(testcontroller.testRun.test.meta).toBeDefined();
  });
  it('Should add step to a test', () => {
    const stepName = 'TestStep';
    const step: TestStep = new TestStep(stepName);
    const testcontroller = { testRun: { test: { meta: null } } };

    // @ts-ignore
    step.addStepToTest(testcontroller);

    expect(testcontroller.testRun.test.meta.steps).toBeDefined();
    expect(testcontroller.testRun.test.meta.steps.length).toBe(1);
    expect(testcontroller.testRun.test.meta.steps[0]).toStrictEqual(step);
  });
  it('Should not overwrite previous test step', () => {
    const stepName = 'TestStep';
    const step: TestStep = new TestStep(stepName);
    const secondStepName = 'TestStep';
    const secondStep: TestStep = new TestStep(secondStepName);
    const testcontroller = { testRun: { test: { meta: null } } };

    // @ts-ignore
    step.addStepToTest(testcontroller);
    // @ts-ignore
    secondStep.addStepToTest(testcontroller);

    expect(testcontroller.testRun.test.meta.steps).toBeDefined();
    expect(testcontroller.testRun.test.meta.steps.length).toBe(2);
    expect(testcontroller.testRun.test.meta.steps[0]).toStrictEqual(step);
    expect(testcontroller.testRun.test.meta.steps[1]).toStrictEqual(secondStep);
  });
});
