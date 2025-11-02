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
  const eslint = new ESLint({ cwd: root });
  const linter = new Linter();

  // Register our custom rule on the Linter instance used below
  if (fs.existsSync(rulePath)) {
    try {
      const ruleImpl = require(rulePath);
      linter.defineRule('no-duplicate-exports', ruleImpl);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to load custom rule at', rulePath, e && e.message);
    }
  }

  // Auto-register rules from installed eslint plugins so plugin rule IDs like
  // "react/jsx-..." or "import/no-unresolved" are available to the Linter.
  try {
    const pkgJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    const deps = Object.assign({}, pkgJson.dependencies || {}, pkgJson.devDependencies || {});
    const pluginNames = Object.keys(deps).filter((n) => n.startsWith('eslint-plugin-') || n.includes('eslint-plugin'));

    for (const pluginName of pluginNames) {
      try {
        // Compute rule prefix: for scoped packages like @scope/eslint-plugin-foo we take the scope as prefix,
        // for unscoped packages eslint-plugin-xyz => prefix 'xyz'. This covers the common plugin naming.
        const prefix = pluginName.startsWith('@') ? pluginName.split('/')[0] : pluginName.replace(/^eslint-plugin-/, '');
        // Require the plugin from node_modules
        const plugin = require(pluginName);
        if (plugin && plugin.rules && typeof plugin.rules === 'object') {
          for (const [rname, rimpl] of Object.entries(plugin.rules)) {
            try {
              linter.defineRule(`${prefix}/${rname}`, rimpl);
            } catch (inner) {
              // ignore individual rule registration failures
            }
          }
        }
      } catch (e) {
        // ignore missing plugins — they might not be installed in this environment
      }
    }
  } catch (e) {
    // ignore package.json read problems
  }

  // Collect files under src and __tests__
  const files = [];
  walkDir(path.join(root, 'src'), files);
  walkDir(path.join(root, '__tests__'), files);

  let hadError = false;
  const eslintResults = [];

  for (const file of files) {
    const code = fs.readFileSync(file, 'utf8');
    // get resolved config from ESLint for this file
    const config = await eslint.calculateConfigForFile(file);

    // Linter expects config to include parserOptions and rules; calculateConfig provides that
    // Run verifyAndFix so we can apply fixes when --fix is passed
    const result = linter.verifyAndFix(code, config, { filename: file });

    // If fixed, write back
    if (doFix && result.output != null && result.fixed) {
      fs.writeFileSync(file, result.output, 'utf8');
    }

    // Convert Linter messages into ESLint format-compatible result
    const messages = result.messages.map((m) => ({
      ruleId: m.ruleId,
      severity: m.severity,
      message: m.message,
      line: m.line,
      column: m.column,
      nodeType: m.nodeType,
      endLine: m.endLine,
      endColumn: m.endColumn,
    }));

    eslintResults.push({
      filePath: file,
      messages,
      errorCount: messages.filter((m) => m.severity === 2).length,
      warningCount: messages.filter((m) => m.severity === 1).length,
      source: code,
    });

    if (messages.some((m) => m.severity === 2)) hadError = true;
  }

  // Use ESLint formatter to print results in a familiar style
  try {
    const argsFormatIndex = args.findIndex((a) => a === '--format' || a === '-f');
    let formatName = 'stylish';
    if (argsFormatIndex >= 0 && args[argsFormatIndex + 1]) formatName = args[argsFormatIndex + 1];

    const formatter = await eslint.loadFormatter(formatName);
    const output = formatter.format(eslintResults);
    if (output) console.log(output);
  } catch (e) {
    // fallback: print concise lines if formatter fails
    for (const res of eslintResults) {
      for (const m of res.messages) {
        const sev = m.severity === 2 ? 'error' : 'warning';
        console.log(`${res.filePath}:${m.line}:${m.column}: ${m.message} [${sev}${m.ruleId ? '/' + m.ruleId : ''}]`);
      }
    }
  }

  process.exitCode = hadError ? 1 : 0;

}
main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(2);
});
