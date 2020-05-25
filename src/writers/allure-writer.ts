/* eslint-disable import/prefer-default-export */
import { Category, TestResult, TestResultContainer } from 'allure-js-commons';
import { IAllureWriter } from 'allure-js-commons/dist/src/writers';

export class AllureTestWriter implements IAllureWriter {
  public reporter = null;

  constructor(reporter: any) {
    this.reporter = reporter;
  }

  writeData(data: any) {
    this.reporter.write(JSON.stringify(data)).newline();
  }

  writeAttachment(name: string, content: Buffer | string) {
    this.writeData(content);
  }

  writeEnvironmentInfo(info?: Record<string, string | undefined>) {
    this.writeData(info);
  }

  writeCategoriesDefinitions(categories: Category[]) {
    this.writeData(categories);
  }

  writeGroup(result: TestResultContainer) {
    this.writeData(result);
  }

  writeResult(result: TestResult) {
    this.writeData(result);
  }
}
