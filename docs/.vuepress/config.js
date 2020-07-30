module.exports = {
  title: '@isaac.frontend/testcafe-reporter-allure',
  description: 'Documentation for @isaac.frontend/testcafe-reporter-allure',
  ...(process.env.NODE_ENV !== 'development' && { base: '/testcafe-reporter-allure/' }),
  themeConfig: {
    nav: [
      { text: 'Github', link: 'https://github.com/isaaceindhoven/testcafe-reporter-allure' },
      { text: 'ISAAC', link: 'https://isaac.nl' },
    ],
    sidebar: {
      '/': [
        {
          title: 'Setup',
          collapsable: false,
          children: ['/setup/installation', '/setup/configuration'],
        },
        {
          title: 'Usage',
          collapsable: false,
          children: ['/usage/metadata', '/usage/steps'],
        },
        {
          title: 'CI/CD',
          collapsable: false,
          children: ['/ci/jenkins'],
        },
      ],
    },
  },
};
