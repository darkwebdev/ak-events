module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.js'] }],
    // allow explicit file extensions in imports (the repo often imports .js/.jsx)
    'import/extensions': 'off',
    // this project uses PropTypes in some places but not everywhere; keep warnings off for now
    'react/prop-types': 'off',
    // allow older patterns like loops in server-side scripts
    'no-restricted-syntax': 'off',
    'no-continue': 'off',
    'no-console': 'off',
    'no-plusplus': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: true, optionalDependencies: false, peerDependencies: false },
    ],
    // relax many stylistic rules for now to avoid noisy failures across the repo
    'import/prefer-default-export': 'off',
    'react/jsx-props-no-spreading': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/no-noninteractive-element-to-interactive-role': 'off',
    'no-unused-vars': ['error', { args: 'none', varsIgnorePattern: '^_' }],
    radix: 'off',
    'no-await-in-loop': 'off',
    'no-empty': 'off',
    'global-require': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'consistent-return': 'off',
    'no-return-assign': 'off',
    'no-shadow': 'off',
    // additional relaxations to reduce noise for now
    'no-use-before-define': 'off',
    'no-useless-escape': 'warn',
    'no-restricted-globals': 'warn',
    'react/no-array-index-key': 'off',
    'react/destructuring-assignment': 'off',
    'prefer-const': 'warn',
  },
};
