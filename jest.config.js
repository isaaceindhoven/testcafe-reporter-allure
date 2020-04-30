module.exports = {
  preset: 'ts-jest',
  verbose: true,
  roots: ['src', 'tests/unit'],
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!dist/', '!tests/'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
    },
  },
};
