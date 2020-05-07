declare global {
  namespace jest {
    interface Matchers<R> {
      toBeContainedWithinEnum: (expectedEnum: { [s: string]: string }) => CustomMatcherResult;
    }
  }
}

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
