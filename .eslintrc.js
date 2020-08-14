module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.test.json'],
  },
  extends: ['airbnb-typescript/base', 'plugin:prettier/recommended'],
  ignorePatterns: ['docs/**/*.js'],
};
