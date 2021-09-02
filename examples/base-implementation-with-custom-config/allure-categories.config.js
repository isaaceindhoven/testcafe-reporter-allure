module.exports = [
    {
        name: 'Not automated',
        messageRegex: '.*Not automated.*',
    },
    {
        name: 'Known bugs',
        messageRegex: '.*Known bug.*',
    },
    {
        name: 'Automated',
        matchedStatuses: ['failed', 'passed'],
    },
];
