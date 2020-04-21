import customLog from '../src/index';

test('CustomLog test', () => {
  expect(customLog('Test')).toBe('Log: Test!');
});
