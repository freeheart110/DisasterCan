module.exports = {
  root: true,
  extends: [
    '@react-native/eslint-config', // base React-Native rules
    'plugin:@typescript-eslint/recommended', // TS-specific linting
    'prettier',                     
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
  env: { 'jest': true },           
};