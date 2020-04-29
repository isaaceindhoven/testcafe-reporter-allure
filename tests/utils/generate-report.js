/* eslint-disable prefer-spread */
const { readFileSync } = require('fs');
const { resolve } = require('path');
const normalizeNewline = require('normalize-newline');
const { embeddingUtils } = require('testcafe');
const pluginFactory = require('../../src');
const reporterTestCalls = require('./reporter-test-calls');

module.exports = {
  readReport() {
    const rawReport = readFileSync(resolve(__dirname, '../data/report'), { encoding: 'utf8' });

    return normalizeNewline(rawReport).trim();
  },

  createReport() {
    const outStream = {
      data: '',

      write(text) {
        this.data += text;
      },
    };

    const plugin = embeddingUtils.buildReporterPlugin(pluginFactory, outStream);

    reporterTestCalls.forEach((call) => {
      plugin[call.method].apply(plugin, call.args);
    });

    const rawReport = outStream.data.replace(/\s*?\(.+?:\d+:\d+\)/g, ' (some-file:1:1)');

    return normalizeNewline(rawReport).trim();
  },
};
