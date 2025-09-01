// eslint.config.js
import js from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist', 'node_modules'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 共通ルール
  {
    plugins: { import: pluginImport },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      '@typescript-eslint/no-require-imports': 'off', // 必要なら後述の.esm修正で消せる
    },
    languageOptions: {
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
  },

  // src 配下はブラウザGlobals（document, localStorage など）
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: { globals: globals.browser },
  },

  // 設定ファイルは Node Globals（module, require など）
  {
    files: [
      'vite.config.ts',
      'tailwind.config.js',
      'eslint.config.js',
      'postcss.config.cjs',
      'prettier.config.cjs',
    ],
    languageOptions: { globals: globals.node },
  },
];
