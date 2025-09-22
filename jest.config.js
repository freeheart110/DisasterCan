module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', {
      useESM: true,
      tsconfig: './tsconfig.json',
    }],
  },

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native' +
      '|@react-native' +
      '|@expo' +
      '|expo(nent)?' +
      '|@expo/.*' +
      '|@unimodules' +
      '|firebase' +
      '|@firebase' +
      '|react-navigation)',
  ],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};