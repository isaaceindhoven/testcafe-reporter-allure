import { Severity } from 'allure-js-commons';
import step from './testcafe/step';
import { loadReporterConfig } from './utils/config';

const reporterConfig = loadReporterConfig();

export { step, reporterConfig, Severity };
