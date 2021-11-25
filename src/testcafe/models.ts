import { CallsiteRecord } from 'callsite-record';

export {};
/* https://github.com/DevExpress/testcafe/issues/2826#issuecomment-524377039
TestCafe does not export the TestController interface, to reduce the chance of making mistakes within the code
the following global interfaces are created to help use the unexported testRun object. 
Only the nessesary functions are exported to reduce the complexity and because the TestController is not needed
within the tests, there 't' provides all definitions to use it within the context of the e2e-tests. */

/* eslint-disable @typescript-eslint/no-unused-vars */
declare global {
  interface TestController {
    testRun: TestRun;
  }
  interface TestRun {
    test: Test;
  }
  interface Test {
    meta: object;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

// https://devexpress.github.io/testcafe/documentation/reference/plugin-api/reporter.html#screenshots-object
export interface Screenshot {
  screenshotPath?: string;
  thumbnailPath?: string;
  userAgent?: string;
  quarantineAttempt?: number;
  takenOnFail?: boolean;
}

export type TestCafeError = {
  errMsg: string;
  originError?: string;
  callsite?: CallsiteRecord;
};

// https://devexpress.github.io/testcafe/documentation/reference/plugin-api/reporter.html#testruninfo-object
export interface TestRunInfo {
  errs?: TestCafeError[];
  warnings?: string[];
  durationMs?: number;
  unstable?: boolean;
  screenshotPath?: string;
  screenshots?: Screenshot[];
  quarantine?: object;
  skipped?: boolean;
}

export interface ErrorObject {
  errMsg?: string;
  callsite?: CallSite;
  userAgent?: string;
}

export interface CallSite extends CallsiteRecord {
  filename?: string;
  lineNum?: string;
}
