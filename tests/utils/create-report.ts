/* eslint-disable prefer-spread */
import * as normalizeNewline from 'normalize-newline';
// @ts-ignore
import { embeddingUtils } from 'testcafe';
import { InMemoryAllureWriter } from 'allure-js-commons/dist/src/writers';
import pluginFactory from '../../src';
import { AllureTestWriter } from '../../src/writers/allure-writer';
import reporterTestCalls from './reporter-test-calls';

export function splitOnNewline(data) {
  return data.split(/\r?\n/);
}

export function createJsonReport() {
  const outStream = {
    data: '',

    write(text) {
      this.data += text;
    },
  };

  const plugin = embeddingUtils.buildReporterPlugin(pluginFactory, outStream);
  const reporter = plugin.getReporter();
  const writer = new AllureTestWriter(reporter);
  plugin.preloadConfig({ writer });

  reporterTestCalls.forEach((call) => {
    plugin[call.method].apply(plugin, call.args);
  });

  const rawReport = outStream.data.replace(/\s*?\(.+?:\d+:\d+\)/g, ' (some-file:1:1)');

  return normalizeNewline(rawReport).trim();
}

export function createObjectReport() {
  const plugin = embeddingUtils.buildReporterPlugin(pluginFactory);
  const writer = new InMemoryAllureWriter();
  plugin.preloadConfig({ writer });

  reporterTestCalls.forEach((call) => {
    plugin[call.method].apply(plugin, call.args);
  });

  return writer;
}
