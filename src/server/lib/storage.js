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

export { ensureDir, saveJson, saveText, fileExists };

export default { ensureDir, saveJson, saveText, fileExists };
