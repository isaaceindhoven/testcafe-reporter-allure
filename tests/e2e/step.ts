// TODO: move the step function to src, currently running into an error caused by how TestCafé exports the TestControllers
export default function step(t: TestController): TestControllerPromise {
  return t.takeScreenshot();
}
