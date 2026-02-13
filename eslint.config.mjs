
export default [
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
      languageOptions: {
          parser: tsParser,
          parserOptions: {
              ecmaVersion: 'latest',
              sourceType: 'module',
              ecmaFeatures: { jsx: true },
          },
      },
    // Override or add rules here
    rules: {},
  },
];
