#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { ESLint, Linter } = require('eslint');

const root = process.cwd();
const rulePath = path.join(root, 'eslint-rules', 'no-duplicate-exports.cjs');

const args = process.argv.slice(2);
const doFix = args.includes('--fix');

function walkDir(dir, acc) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkDir(full, acc);
    else if (e.isFile() && (full.endsWith('.js') || full.endsWith('.jsx'))) acc.push(full);
  }
}

async function main() {
  // Collect files: either from command line args or default directories
  let files = [];
  if (args.length > 0 && !args.includes('--fix')) {
    // Use files specified on command line
    files = args.filter(arg => !arg.startsWith('--'));
  } else {
    // Default: collect files under src and __tests__
    walkDir(path.join(root, 'src'), files);
    walkDir(path.join(root, '__tests__'), files);
  }

  // Create ESLint instance
  const eslint = new ESLint({
    cwd: root,
    useEslintrc: true,
    fix: doFix
  });

  // Run ESLint
  const results = await eslint.lintFiles(files);

  // Apply fixes if requested
  if (doFix) {
    await ESLint.outputFixes(results);
  }

  // Now run custom rules manually
  const customRule = require(rulePath);
  const linter = new Linter();
  linter.defineRule('no-duplicate-exports', customRule);

  let hasCustomErrors = false;
  for (const file of files) {
    const code = fs.readFileSync(file, 'utf8');
    // Configure parser options based on file extension
    const isJsx = file.endsWith('.jsx');
    const config = { 
      rules: { 'no-duplicate-exports': 'error' },
      parserOptions: { 
        ecmaVersion: 2020, 
        sourceType: 'module',
        ...(isJsx && { ecmaFeatures: { jsx: true } })
      }
    };
    const customResult = linter.verifyAndFix(code, config, { filename: file });

    if (customResult.messages.length > 0) {
      hasCustomErrors = true;
      // Add custom messages to the results
      const existingResult = results.find(r => r.filePath === file);
      if (existingResult) {
        existingResult.messages.push(...customResult.messages.map(m => ({
          ruleId: m.ruleId,
          severity: m.severity,
          message: m.message,
          line: m.line,
          column: m.column,
          endLine: m.endLine,
          endColumn: m.endColumn,
        })));
        existingResult.errorCount += customResult.messages.filter(m => m.severity === 2).length;
        existingResult.warningCount += customResult.messages.filter(m => m.severity === 1).length;
      }
    }
  }

  // Format and output results
  const formatter = await eslint.loadFormatter('stylish');
  const output = formatter.format(results);
  if (output) console.log(output);

  // Set exit code
  const hasErrors = results.some(result => result.errorCount > 0) || hasCustomErrors;
  process.exitCode = hasErrors ? 1 : 0;
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(2);
});
