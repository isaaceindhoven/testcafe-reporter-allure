module.exports = {
  '.*.{js,ts,tsx}': ['eslint --ext .js,.ts --ignore-pattern !.* --ignore-path .gitignore . --fix', 'git add .'],
};
