// Preload this file with `node -r` to register custom ESLint rules before ESLint loads config
const path = require('path');
const { linter } = require('eslint');

try {
  const rulePath = path.resolve(__dirname, '../eslint-rules/no-duplicate-exports.cjs');
  // load the rule implementation and register it under the expected id
  const rule = require(rulePath);
  linter.defineRule('no-duplicate-exports', rule);
} catch (e) {
  // don't crash; ESLint will still run and report missing rule if it wasn't registered
  // but we log for easier debugging
  // eslint-disable-next-line no-console
  console.error('Failed to register custom eslint rule:', e && e.message);
}
