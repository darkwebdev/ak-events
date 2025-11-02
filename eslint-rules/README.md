Custom ESLint rules for this repository

Location: eslint-rules/

Purpose

- This directory contains custom ESLint rules used by our lint script (`scripts/lint-with-local-rules.cjs`).
- Rules are written in CommonJS (`.cjs`) to ensure compatibility with our scripts and ESLint's plugin loading.

How to add a new rule

1. Create a new file in `eslint-rules/`, named `my-rule.cjs`.
2. Export the rule using `module.exports = { meta, create }`.
   - `meta`: metadata including `type`, `docs`, `schema`, and `messages`.
   - `create(context)`: return visitor methods that call `context.report(...)`.

Example skeleton:

```javascript
// eslint-rules/my-rule.cjs
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'short description',
      recommended: false,
    },
    schema: [],
    messages: {
      myMessage: 'This is a problem: {{name}}',
    },
  },
  create(context) {
    return {
      Identifier(node) {
        // ...analysis...
        context.report({ node, messageId: 'myMessage', data: { name: node.name } });
      },
    };
  },
};
```

Registering the rule

- The lint script loads rules directly from `eslint-rules/` and defines them on an internal `Linter` instance.
- To add your rule to the lint pipeline, ensure the file name ends with `.cjs` and implement `module.exports` as above.

If you want to expose the rules as a plugin

- Create an `eslint-rules/index.cjs` that aggregates and exports rules:

```javascript
// eslint-rules/index.cjs
const myRule = require('./my-rule.cjs');
const noDuplicateExports = require('./no-duplicate-exports.cjs');

module.exports = {
  rules: {
    'my-rule': myRule,
    'no-duplicate-exports': noDuplicateExports,
  },
};
```

Then you can configure `.eslintrc.cjs` to refer to the rules via the `local-rules` plugin entry if you install a helper plugin, or leave the lint script to load them directly.

Why we use CommonJS (.cjs)

- Our custom lint runner and some ESLint plugin loaders use `require()` and expect CommonJS modules. Using `.cjs` avoids loader mismatch and keeps the setup simple.

Testing

- Add tests under `__tests__/eslint/` which import the rule file directly:
  `import rule from '../../eslint-rules/no-duplicate-exports.cjs';`
- Use `RuleTester` from ESLint to validate valid/invalid code samples.
