/* eslint-disable func-names */
const createCallsiteRecord = require('callsite-record');

export default function () {
  try {
    throw new Error('Create error');
  } catch (err) {
    return createCallsiteRecord({ forError: err });
  }
}
