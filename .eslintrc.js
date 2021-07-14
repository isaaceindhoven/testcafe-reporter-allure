module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.test.json'],
  },
  extends: ['airbnb-typescript/base', 'plugin:prettier/recommended'],
  ignorePatterns: ['docs/**/*.js'],
  overrides: [
    {
      files: '**/(unit|integration)/*.*',
      extends: ['plugin:jest/recommended'],
    },
    {
      files: '**/e2e/*.*',
      globals: {
        fixture: false,
        test: false,
      },
    },
  ],
};
