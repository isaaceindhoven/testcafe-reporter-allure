/* eslint-disable prefer-spread */
const normalizeNewline = require('normalize-newline');
const { embeddingUtils } = require('testcafe');
const pluginFactory = require('../../src');
const { AllureTestWriter } = require('../../src/writers/allure-writer');
const reporterTestCalls = require('./reporter-test-calls');

module.exports = {
  createReport() {
    const outStream = {
      data: '',

      write(text) {
        this.data += text;
      },
    };

    const plugin = embeddingUtils.buildReporterPlugin(pluginFactory, outStream);
    const reporter = plugin.getReporter();
    plugin.preloadConfig({ writer: new AllureTestWriter(reporter) });

    reporterTestCalls.forEach((call) => {
      plugin[call.method].apply(plugin, call.args);
    });

    const rawReport = outStream.data.replace(/\s*?\(.+?:\d+:\d+\)/g, ' (some-file:1:1)');

    return normalizeNewline(rawReport).trim();
  },
};
