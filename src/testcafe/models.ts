export {};
declare global {
  interface TestController {
    testRun: TestRun;
  }
  interface TestRun {
    test: Test;
    opts: object;
  }
  interface Test {
    meta: object;
  }
}

// https://devexpress.github.io/testcafe/documentation/reference/plugin-api/reporter.html#screenshots-object
export interface Screenshot {
  screenshotPath?: string;
  thumbnailPath?: string;
  userAgent?: string;
  quarantineAttempt?: number;
  takenOnFail?: boolean;
}

// https://devexpress.github.io/testcafe/documentation/reference/plugin-api/reporter.html#testruninfo-object
export interface TestRunInfo {
  errs?: object[];
  warnings?: string[];
  durationMs?: number;
  unstable?: boolean;
  screenshotPath?: string;
  screenshots?: Screenshot[];
  quarantine?: object;
  skipped?: boolean;
}
