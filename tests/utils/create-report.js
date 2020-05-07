/* eslint-disable prefer-spread */
const normalizeNewline = require('normalize-newline');
const { embeddingUtils } = require('testcafe');
const { InMemoryAllureWriter } = require('allure-js-commons/dist/src/writers');
const pluginFactory = require('../../src');
const { AllureTestWriter } = require('../../src/writers/allure-writer');
const reporterTestCalls = require('./reporter-test-calls');

module.exports = {
  splitOnNewline(data) {
    return data.split(/\r?\n/);
  },

  createJsonReport() {
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
  },

  createObjectReport() {
    const plugin = embeddingUtils.buildReporterPlugin(pluginFactory);
    const writer = new InMemoryAllureWriter();
    plugin.preloadConfig({ writer });

    reporterTestCalls.forEach((call) => {
      plugin[call.method].apply(plugin, call.args);
    });

    return writer;
  },
};
