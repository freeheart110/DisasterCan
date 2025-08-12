module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@expo|expo(nent)?|@expo/.*|@unimodules)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};
