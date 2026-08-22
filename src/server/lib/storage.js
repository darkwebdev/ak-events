import fs from 'fs';
import path from 'path';

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

// Load JSON from filepath, returning `fallback` if the file doesn't exist or fails to parse.
function loadJson(filepath, fallback) {
  if (!fs.existsSync(filepath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (e) {
    return fallback;
  }
}

export { ensureDir, saveJson, saveText, fileExists, loadJson };
