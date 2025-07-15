module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/react-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@expo|expo(nent)?|@expo/.*|@unimodules)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};