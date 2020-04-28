/* eslint-disable prefer-spread */
const { buildReporterPlugin } = require('testcafe').embeddingUtils;
const pluginFactory = require('../../src');
const reporterTestCalls = require('./reporter-test-calls');

module.exports = function createReport() {
  const outStream = {
    data: '',

    write(text) {
      this.data += text;
    },
  };

  const plugin = buildReporterPlugin(pluginFactory, outStream);

  reporterTestCalls.forEach((call) => {
    plugin[call.method].apply(plugin, call.args);
  });

  // NOTE: mock stack entries
  return outStream.data.replace(/\s*?\(.+?:\d+:\d+\)/g, ' (some-file:1:1)');
};
