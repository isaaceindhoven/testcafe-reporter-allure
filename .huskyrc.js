module.exports = {
  hooks: {
    'pre-commit': 'npx --no-install lint-staged',
    'commit-msg': 'npx --no-install commitlint --edit HUSKY_GIT_PARAMS',
  },
};
