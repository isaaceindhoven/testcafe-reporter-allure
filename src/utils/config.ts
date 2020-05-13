import * as path from 'path';

const defaultConfig = {
  CONFIG_DIR: 'allure.config.js',
  RESULT_DIR: './allure/allure-results',
  META: {
    SEVERITY: 'Trivial',
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
    customConfig = require(path.resolve(process.cwd(), defaultConfig.CONFIG_DIR));
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
