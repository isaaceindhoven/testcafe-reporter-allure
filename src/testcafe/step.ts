/* eslint-disable class-methods-use-this */
import { loadReporterConfig } from '../utils/config';

const reporterConfig = loadReporterConfig();

export class TestStep {
  public screenshotAmount: number;

  public name: string;

  constructor(name: string) {
    this.screenshotAmount = 0;
    this.name = name;
  }

  registerScreenshot(): void {
    this.screenshotAmount += 1;
  }

  addStepToTest(test: TestController): void {
    const meta: any = this.getMeta(test);
    if (meta) {
      if (!meta.steps) {
        meta.steps = [];
      }
      meta.steps.push(this);
    }
  }

  // Steps could be added to the metadata of the test.
  private getMeta(testController: TestController): any {
    // @ts-ignore
    return testController.testRun.test.meta;
  }

  // // Returns a new copy of the reporter thus may not be able to be used.
  // private getReporter(testController: TestController): AllureReporter {
  //   // @ts-ignore
  //   return testController.testRun.opts.reporter[0].name().getAllureReporter();
  // }
}

/* The TestController loses its parameters when returned as a TestControllerPromise. 
   Therefore the steps cannot be added without a clean TestController.
*/
export default async function step(name: string, testController: TestController, stepAction: any) {
  let stepPromise = stepAction;
  const testStep = new TestStep(name);

  if (reporterConfig.ENABLE_SCREENSHOTS) {
    stepPromise = stepPromise.takeScreenshot();
    testStep.registerScreenshot();
  }

  testStep.addStepToTest(testController);
  return stepPromise;
}
