module.exports = {
  '*.{js,ts,tsx}': ['eslint --fix'],
  // Do not ignore config files
  '.*.{js,ts,tsx}': ['eslint --ignore-pattern !.* --fix'],
};
