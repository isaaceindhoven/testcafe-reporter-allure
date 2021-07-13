import { Category, Status } from 'allure-js-commons';
import { defaultsDeep } from 'lodash';
import * as path from 'path';

const defaultReporterConfig = {
  REPORTER_CONFIG_FILE: './allure.config.js',
  CATEGORIES_CONFIG_FILE: './allure-categories.config.js',

  RESULT_DIR: './allure/allure-results',
  REPORT_DIR: './allure/allure-report',
  SCREENSHOT_DIR: './allure/screenshots',

  CLEAN_RESULT_DIR: true,
  CLEAN_REPORT_DIR: true,
  CLEAN_SCREENSHOT_DIR: true,

  ENABLE_SCREENSHOTS: true,
  ENABLE_QUARANTINE: false,
  ENABLE_LOGGING: false,
  CONCURRENCY: 1,

  META: {
    SEVERITY: 'Normal',
    ISSUE_URL: 'https://jira.example.nl/browse/',
  },
  LABEL: {
    ISSUE: 'JIRA Issue',
    FLAKY: 'Flaky test',
    SCREENSHOT_MANUAL: 'Screenshot taken manually',
    SCREENSHOT_ON_FAIL: 'Screenshot taken on fail',
    DEFAULT_STEP_NAME: 'Test Step',
  },
};

const defaultCategoriesConfig: Category[] = [
  {
    name: 'Ignored tests',
    matchedStatuses: [Status.SKIPPED],
  },
  {
    name: 'Product defects',
    matchedStatuses: [Status.FAILED],
    messageRegex: '.*Assertion failed.*',
  },
  {
    name: 'Test defects',
    matchedStatuses: [Status.FAILED],
  },
  {
    name: 'Warnings',
    matchedStatuses: [Status.PASSED],
    messageRegex: '.*Warning.*',
  },
  {
    name: 'Flaky tests',
    matchedStatuses: [Status.PASSED, Status.FAILED],
    messageRegex: '.*Flaky.*',
  },
];

function loadCustomConfig(configFile: string): object {
  let customConfig: object = null;
  try {
    // The presence of this config module is not guarenteed therefore this approach is needed.
    /* eslint-disable-next-line import/no-dynamic-require,global-require */
    customConfig = require(path.resolve(process.cwd(), configFile));
  } catch (error) {
    customConfig = {};
  }
  return customConfig;
}

export function loadReporterConfig(): any {
  const customConfig = loadCustomConfig(defaultReporterConfig.REPORTER_CONFIG_FILE);
  const mergedConfig: object = defaultsDeep(customConfig, defaultReporterConfig);
  return mergedConfig;
}

export function loadCategoriesConfig(): any {
  const customConfig = loadCustomConfig(defaultReporterConfig.CATEGORIES_CONFIG_FILE);
  if (customConfig instanceof Array) {
    return customConfig;
  }
  return defaultCategoriesConfig;
}
