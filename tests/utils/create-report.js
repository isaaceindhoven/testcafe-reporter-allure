/* eslint-disable prefer-spread */
import { embeddingUtils } from 'testcafe';
import * as pluginFactory from '../../src';
import * as reporterTestCalls from './reporter-test-calls';

export default function createReport() {
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

  // NOTE: mock stack entries
  return outStream.data.replace(/\s*?\(.+?:\d+:\d+\)/g, ' (some-file:1:1)');
}
