module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.test.json'],
  },
  extends: ['airbnb-typescript/base', 'plugin:prettier/recommended', 'plugin:jest/recommended'],
  overrides: [
    {
      files: ['**/e2e/**'],
      rules: {
        'jest/expect-expect': 'off',
        'jest/no-test-callback': 'off',
      },
    },
  ],
};
