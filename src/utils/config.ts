import * as path from 'path';

const defaultConfig = {
  CONFIG_FILE: './allure.config.js',
  RESULT_DIR: './allure/allure-results',
  REPORT_DIR: './allure/allure-report',
  CLEAN_RESULT_DIR: true,
  CLEAN_REPORT_DIR: true,
  META: {
    SEVERITY: 'Normal',
    ISSUE_URL: 'https://jira.example.nl/browse/',
  },
  LABEL: {
    SEVERITY: 'severity',
    ISSUE: 'JIRA Issue',
  },
};

function loadCustomConfig(): object {
  let customConfig: object = null;
  try {
    // The presents of this config module is not guarenteed therefore this approach is needed.
    /* eslint-disable-next-line import/no-dynamic-require,global-require */
    customConfig = require(path.resolve(process.cwd(), defaultConfig.CONFIG_FILE));
  } catch (error) {
    customConfig = {};
  }
  return customConfig;
}

export default function Config(): any {
  const customConfig = loadCustomConfig();
  const mergedConfig: object = { ...defaultConfig, ...customConfig };
  return mergedConfig;
}
