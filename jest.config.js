module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|realm|@realm/react|@realm/fetch)/)',
  ],
};
