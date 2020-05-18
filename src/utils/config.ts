import { Category, Status } from 'allure-js-commons';
import * as path from 'path';

const defaultReporterConfig = {
  REPORTER_CONFIG_FILE: './allure.config.js',
  CATEGORIES_CONFIG_FILE: './allure-categories.config.js',
  RESULT_DIR: './allure/allure-results',
  REPORT_DIR: './allure/allure-report',
  CLEAN_RESULT_DIR: true,
  CLEAN_REPORT_DIR: true,
  META: {
    SEVERITY: 'Normal',
    ISSUE_URL: 'https://jira.example.nl/browse/',
  },
  LABEL: {
    ISSUE: 'JIRA Issue',
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
];

function loadCustomConfig(configFile: string): object {
  let customConfig: object = null;
  try {
    // The presents of this config module is not guarenteed therefore this approach is needed.
    /* eslint-disable-next-line import/no-dynamic-require,global-require */
    customConfig = require(path.resolve(process.cwd(), configFile));
  } catch (error) {
    customConfig = {};
  }
  return customConfig;
}

export function loadReporterConfig(): any {
  const customConfig = loadCustomConfig(defaultReporterConfig.REPORTER_CONFIG_FILE);
  const mergedConfig: object = { ...defaultReporterConfig, ...customConfig };
  return mergedConfig;
}

export function loadCategoriesConfig(): any {
  const customConfig = loadCustomConfig(defaultReporterConfig.CATEGORIES_CONFIG_FILE);
  if (customConfig instanceof Array) {
    return customConfig;
  }
  return defaultCategoriesConfig;
}
