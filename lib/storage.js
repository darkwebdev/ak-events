const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function saveJson(filepath, obj) {
  ensureDir(path.dirname(filepath));
  fs.writeFileSync(filepath, JSON.stringify(obj, null, 2));
}

function saveText(filepath, text) {
  ensureDir(path.dirname(filepath));
  fs.writeFileSync(filepath, text, 'utf8');
}

function fileExists(filepath) {
  return fs.existsSync(filepath);
}

module.exports = { ensureDir, saveJson, saveText, fileExists };
