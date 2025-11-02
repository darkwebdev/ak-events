// Expose rules so ESLint picks them up reliably when using --rulesdir
module.exports = {
  'no-duplicate-exports': require('./no-duplicate-exports.cjs'),
};
