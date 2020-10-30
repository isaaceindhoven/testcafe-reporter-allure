/* eslint-disable @typescript-eslint/no-unused-vars */
declare global {
  namespace jest {
    interface Matchers<R> {
      // eslint-disable-next-line no-undef
      toBeContainedWithinEnum: (expectedEnum: { [s: string]: string }) => CustomMatcherResult;
    }
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

// eslint-disable-next-line no-undef
expect.extend({
  toBeContainedWithinEnum(received: string, expectedEnum: { [s: string]: string }) {
    if (received.toUpperCase() in expectedEnum) {
      return {
        message: () => `expected ${received} present within the enum.`,
        pass: true,
      };
    }
    return {
      message: () => `expected ${received} not preset within the enum.`,
      pass: false,
    };
  },
});

export default undefined;
