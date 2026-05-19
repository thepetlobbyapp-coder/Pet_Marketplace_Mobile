/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  // Só arquivos *.jest.test.ts(x). Os specs do harness em src/__tests__
  // NÃO são test files de jest — são importados pela bridge e rodam via
  // runAllSuites(), sem reescrita.
  testMatch: ['**/*.jest.test.ts', '**/*.jest.test.tsx'],
  // transformIgnorePatterns: usar o do preset jest-expo (cobre react-native,
  // @react-native, expo, etc.). Não sobrescrever — sobrescrever quebra o
  // transform dos polyfills do React Native.
};
