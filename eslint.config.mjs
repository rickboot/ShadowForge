import { dirname } from 'path';
import { fileURLToPath } from 'url';
import nextPlugin from 'eslint-config-next/base';
import jestA11y from 'eslint-plugin-jsx-a11y';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  {
    extends: ['next/core-web-vitals'],
    plugins: ['jsx-a11y'],
    rules: {
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/no-noninteractive-tabindex': 'warn',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
    }
  }
];
