import astro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';

const astroRecommended = astro.configs['flat/recommended'];
const astroConfig = Array.isArray(astroRecommended)
  ? astroRecommended
  : [astroRecommended].filter(Boolean);
const reactHooksRules =
  reactHooks.configs.flat?.recommended?.rules ??
  reactHooks.configs.recommended.rules;

export default [
  {
    ignores: ['dist/', '.astro/', 'node_modules/', 'public/'],
  },
  ...astroConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      ...reactHooksRules,
    },
  },
];
