module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  // Vitest's `test.globals: true` (see vitest.config.js) injects these ambiently,
  // matching Jest's old env:{jest:true} globals plus Vitest's own `vi`. There's no
  // built-in ESLint env for Vitest, so they're listed explicitly.
  globals: {
    describe: 'readonly',
    test: 'readonly',
    it: 'readonly',
    expect: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
    beforeAll: 'readonly',
    afterAll: 'readonly',
    vi: 'readonly',
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
    'import/extensions': 'off',
    'import/no-commonjs': 'error',
    // The server writes `.js` import specifiers pointing at `.ts` source files (the
    // standard TS-ESM convention — Vite/Vitest/tsx all resolve this correctly at
    // runtime), which eslint-plugin-import's resolver doesn't understand and flags as
    // broken. `yarn typecheck` (tsc) already validates every one of these imports
    // with full fidelity, so this rule would only ever produce false positives here.
    'import/no-unresolved': 'off',
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
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: false,
      },
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        // TypeScript's own compiler (see `yarn typecheck`) already catches unused
        // vars/undefined names with full type information — airbnb's plain-JS
        // versions of these rules can't see type-only imports/usages and would
        // false-positive on them.
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          // caughtErrors: 'none' matches this codebase's existing `catch (e) { /* ignore */ }`
          // convention (already pervasive in the original .js files) — ESLint 8's plain
          // no-unused-vars defaults to ignoring catch bindings, but the TS-aware rule
          // defaults to flagging them, so this has to be explicit to keep the same behavior.
          { args: 'none', varsIgnorePattern: '^_', caughtErrors: 'none' },
        ],
        'no-undef': 'off',
        // The scraper leans on `unknown`/loosely-typed third-party JSON (wiki HTML,
        // game-data tables) deliberately rather than fully re-describing schemas this
        // codebase doesn't own — see types.ts's own note on that tradeoff.
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
  ],
};
