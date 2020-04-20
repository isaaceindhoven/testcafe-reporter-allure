module.exports = {
  'hooks': {
    "pre-commit": "npm run build:prod && npm run test:unit && lint-staged",
    "prepare-commit-msg": "exec < /dev/tty && git cz --hook || true"
  }
};
