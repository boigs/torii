// @ts-check

import eslint from '@eslint/js';
import prettierConfigsRecommended  from 'eslint-config-prettier';
import next from 'eslint-config-next';
import reactConfigsRecommended from 'eslint-plugin-react/configs/recommended';
import vitest from 'eslint-plugin-vitest';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    }
  },
  next,
  reactConfigsRecommended,
  vitest.configs.recommended,
  prettierConfigsRecommended
);