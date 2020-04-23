module.exports = {
  hooks: {
    // Pre-commit: Test if production build works, run unit and e2e tests, run lint-staged.
    'pre-commit': 'npm run build:prod && npm run test:unit && lint-staged',
    'prepare-commit-msg': 'exec < /dev/tty && git cz --hook || true',
  },
};
