module.exports = {
  hooks: {
    // Pre-commit: Test if production build works, run unit and e2e tests, run lint-staged.
    'pre-commit': 'npm run build:prod && npm run test:unit && npm run test:e2e && lint-staged',
    'prepare-commit-msg': 'exec < /dev/tty && git cz --hook || true',
  },
};
