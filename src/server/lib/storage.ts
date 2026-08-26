import fs from 'fs';
import path from 'path';

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function saveJson(filepath: string, obj: unknown): void {
  ensureDir(path.dirname(filepath));
  fs.writeFileSync(filepath, JSON.stringify(obj, null, 2));
}

function saveText(filepath: string, text: string): void {
  ensureDir(path.dirname(filepath));
  fs.writeFileSync(filepath, text, 'utf8');
}

function fileExists(filepath: string): boolean {
  return fs.existsSync(filepath);
}

// Load JSON from filepath, returning `fallback` if the file doesn't exist or fails to parse.
function loadJson<T>(filepath: string, fallback: T): T {
  if (!fs.existsSync(filepath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8')) as T;
  } catch (e) {
    return fallback;
  }
}

export { ensureDir, saveJson, saveText, fileExists, loadJson };
