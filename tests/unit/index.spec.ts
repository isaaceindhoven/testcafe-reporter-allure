import customLog from '../../src/index';

describe('Filter function', () => {
  it('CustomLog test', () => {
    expect(customLog('Test')).toBe('Log: Test!');
  });
});
