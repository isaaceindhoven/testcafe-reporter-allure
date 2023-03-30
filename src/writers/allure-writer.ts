/* eslint-disable import/prefer-default-export */
import { Category, TestResult, TestResultContainer, InMemoryAllureWriter } from 'allure-js-commons';
import { PathLike } from 'fs';

export class AllureTestWriter extends InMemoryAllureWriter {
  public reporter = null;

  constructor(reporter: any) {
    super();
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

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  writeAttachmentFromPath(_fromPath: PathLike, _fileName: string) {
    // eslint-disable-next-line no-console
    console.warn('writeAttachmentFromPath not implemented');
  }
}
