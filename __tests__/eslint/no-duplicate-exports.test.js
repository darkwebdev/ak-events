import { RuleTester } from 'eslint';
import rule from '../../eslint-rules/no-duplicate-exports.cjs';

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2020, sourceType: 'module' } });

ruleTester.run('no-duplicate-exports', rule, {
  valid: [`export function b() {}`, `module.exports = { a: function() {} }`],
  invalid: [
    {
      code: `export function a() {}\nexport default { a }`,
      errors: [{ message: "'a' is exported more than once" }],
    },
    {
      code: `function a() {}\nmodule.exports = { a }\nexports.a = a;`,
      errors: [{ message: "'a' is exported more than once" }],
    },
  ],
});
