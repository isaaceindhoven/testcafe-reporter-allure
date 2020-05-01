/* eslint-disable no-console,@typescript-eslint/no-unused-vars */
// Above eslint rules disabled for development
const AllureReporter = require('./allure-reporter').default;

module.exports = () => {
  return {
    allureReporter: null,

    async reportTaskStart(startTime: Date, userAgents: string[], testCount: number): Promise<void> {
      this.allureReporter = new AllureReporter();
      this.write('Task has been started').newline();
    },

    async reportFixtureStart(name: string, path: string, meta: object): Promise<void> {
      try {
        this.allureReporter.startGroup(name);
        this.write(`Fixture "${name}" has been started`).newline();
      } catch (error) {
        console.log(error);
      }
    },

    async reportTestStart(name: string, meta: object): Promise<void> {
      try {
        this.allureReporter.startTest(name);
        this.write(`Test "${name}" has been started`).newline();
      } catch (error) {
        console.log(error);
      }
    },

    async reportTestDone(name: string, testRunInfo, meta: object): Promise<void> {
      try {
        this.allureReporter.endTest();
        // const hasErr = !!testRunInfo.errs.length;

        // if (hasErr) {
        //   testRunInfo.errs.forEach((err, idx) => {
        //     this.newline()
        //       .write(this.formatError(err, `${idx + 1}) `));
        //   });
        // }
        this.write(`Test "${name}" has been finished`).newline();
      } catch (error) {
        console.log(error);
      }
    },

    async reportTaskDone(endTime: Date, passed: number, warnings: string[], result: object): Promise<void> {
      try {
        this.allureReporter.endGroup();
        this.write('Task has been completed').newline();
      } catch (error) {
        console.log(error);
      }
    },
  };
};
