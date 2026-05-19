// ESLint 9 flat config. Base: eslint-config-expo (RN/Expo).
const expoFlat = require('eslint-config-expo/flat');

module.exports = [
  ...expoFlat,
  {
    // Specs Jest: jest.mock() precisa vir antes dos imports (hoisting) e
    // require() é usado para acessar o módulo mockado — padrão do Jest.
    files: ['**/*.jest.test.ts', '**/*.jest.test.tsx'],
    rules: {
      'import/first': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'coverage/**',
      'babel.config.js',
      'jest.config.js',
      'eslint.config.js',
    ],
  },
];
