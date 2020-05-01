const { Allure, AllureRuntime, AllureConfig, AllureTest, AllureGroup } = require('allure-js-commons');

export default class AllureReporter {
  private allure: typeof Allure;

  private allureConfig: typeof AllureConfig;

  private allureRuntime: typeof AllureRuntime;

  private allureTest: typeof AllureTest;

  private allureGroup: typeof AllureGroup;

  private allureResultsPathDefault: string = './allure/allure-results';

  constructor(allureResultsPath?: string) {
    if (!allureResultsPath) {
      this.allureConfig = new AllureConfig(this.allureResultsPathDefault);
    } else {
      this.allureConfig = new AllureConfig(allureResultsPath);
    }

    this.allureRuntime = new AllureRuntime(this.allureConfig);
    this.allure = new Allure(this.allureRuntime);
  }

  public startGroup(name: string) {
    this.allureGroup = this.allureRuntime.startGroup(name);
  }

  public startTest(name: string) {
    this.allureTest = this.allureGroup.startTest(name);
  }

  public endTest() {
    this.allureTest.endTest();
  }

  public endGroup(name: string) {
    this.allureGroup.startGroup(name);
  }
}
