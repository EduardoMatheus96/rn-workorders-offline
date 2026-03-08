module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/fileMock.js',
    '@react-native-community/netinfo': '<rootDir>/node_modules/@react-native-community/netinfo/jest/netinfo-mock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|realm|@realm/react|@realm/fetch|@react-navigation|react-native-css-interop|react-native-vector-icons)/)',
  ],
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
};
