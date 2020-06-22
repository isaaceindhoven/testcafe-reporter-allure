module.exports = {
  branches: ['master'],
  ci: true,
  dryRun: false,
  plugins: [
    // https://github.com/semantic-release/commit-analyzer/
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        // https://github.com/semantic-release/commit-analyzer/#releaserules
        // https://github.com/semantic-release/commit-analyzer/blob/master/lib/default-release-rules.js
        // These rules extend the default rules, uses the Convential Commit types
        releaseRules: [
          { type: 'build', release: 'patch' },
          { type: 'ci', release: 'patch' },
          { type: 'chore', release: 'patch' },
          { type: 'docs', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'style', release: 'patch' },
          { type: 'test', release: 'patch' },
        ],
      },
    ],

    // https://github.com/semantic-release/release-notes-generator
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'feat', section: 'Features' },
            { type: 'fix', section: 'Bug Fixes' },
            { type: 'chore', section: 'Chores', hidden: false },
            { type: 'docs', section: 'Documentation', hidden: false },
            { type: 'style', section: 'Styles', hidden: false },
            { type: 'refactor', section: 'Refactors', hidden: false },
            { type: 'perf', section: 'Performance', hidden: false },
            { type: 'test', section: 'Tests', hidden: false },
          ],
        },
      },
    ],

    // https://github.com/semantic-release/changelog
    // Must be called before npm and git plugins
    // Uses the result of the release-notes-generator to generate the CHANGELOG.md.
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
        changelogTitle:
          '# Changelog\n\nAll notable changes to this project will be documented in this file. See\n[Conventional Commits](https://conventionalcommits.org) for commit guidelines.',
      },
    ],

    // https://github.com/semantic-release/npm
    '@semantic-release/npm',

    // https://github.com/semantic-release/git
    [
      '@semantic-release/git',
      {
        message: 'chore(release): v<%= nextRelease.version %>',
        assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'],
      },
    ],

    // https://github.com/semantic-release/github
    '@semantic-release/github',
  ],
};
