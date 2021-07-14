const sharedConfig = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
};

module.exports = {
  projects: [
    {
      displayName: 'unit',
      roots: ['src', 'tests/unit'],
      collectCoverage: true,
      collectCoverageFrom: ['src/**/*.{ts,tsx}', '!dist/', '!tests/'],
      coverageThreshold: {
        global: {
          branches: 0,
          functions: 0,
          lines: 0,
          statements: 0,
        },
      },
      ...sharedConfig,
    },
    {
      displayName: 'integration',
      roots: ['src', 'tests/integration'],
      ...sharedConfig,
    },
  ],
};
