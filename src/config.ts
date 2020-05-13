import * as path from 'path';

const defaultReporterConfig = {
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
  let customReporterConfig: object = null;
  try {
    // The presents of this config module is not guarenteed therefore this approach is needed.
    /* eslint-disable-next-line import/no-dynamic-require,global-require */
    customReporterConfig = require(path.resolve(process.cwd(), defaultReporterConfig.CONFIG_DIR));
  } catch (error) {
    customReporterConfig = {};
  }
  return customReporterConfig;
}

export default function ReporterConfig(): any {
  const customReporterConfig = loadCustomConfig();
  const mergedReporterConfig: object = { ...defaultReporterConfig, ...customReporterConfig };
  return mergedReporterConfig;
}
