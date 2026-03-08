module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|realm|@realm/react|@realm/fetch|@react-navigation|react-native-css-interop)/)',
  ],
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
};
