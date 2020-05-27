/* eslint-disable @typescript-eslint/no-unused-vars */
import AllureReporter from '../reporter/allure-reporter';

// Returns a new copy of the reporter thus may not be able to be used.
function getReporter(testController: TestController): AllureReporter {
  // @ts-ignore
  return testController.testRun.opts.reporter[0].name().getAllureReporter();
}

// Steps could be added to the metadata of the test.
function getMeta(testController: TestController): any {
  // @ts-ignore
  return testController.testRun.test.meta;
}

/* The TestController loses its parameters when returned as a TestControllerPromise. 
   Therefore the steps cannot be added without a clean TestController.
*/
export default async function step(testController: TestController, testStep: any) {
  // console.log(testController.testRun.test.meta);
  // console.log(testController.testRun.opts.reporter[0].name());
  const reporter: AllureReporter = getReporter(testController);

  const meta = getMeta(testController);
  meta.step = 'test';
  // reporter.addStep('test');
  return testStep.takeScreenshot();
}
