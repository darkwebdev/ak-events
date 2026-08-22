import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';
import { main } from '../src/server/optimiseImages.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('optimiseImages script', () => {
  const tmpDir = path.join(__dirname, 'tmp-images');
  beforeAll(async () => {
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    // create a tiny valid PNG using pngjs to ensure it's readable by pngjs
    const png = new PNG({ width: 1, height: 1 });
    // RGBA: red pixel
    png.data[0] = 255; // R
    png.data[1] = 0; // G
    png.data[2] = 0; // B
    png.data[3] = 255; // A
    const outPath = path.join(tmpDir, 'test.png');
    const buffer = PNG.sync.write(png);
    fs.writeFileSync(outPath, buffer);
  });

  afterAll(() => {
    cleanup(tmpDir);
  });

  // helper to remove all files in a temp dir and then the dir itself
  function cleanup(dir) {
    try {
      if (!fs.existsSync(dir)) return;
      const files = fs.readdirSync(dir);
      for (const f of files) fs.unlinkSync(path.join(dir, f));
      fs.rmdirSync(dir);
    } catch (e) {
      // ignore cleanup failures in tests
    }
  }

  // Extended timeout (default 5000ms) to allow longer for image processing in CI environments.
  test('creates jpg from png', async () => {
    const converted = await main(tmpDir);
    expect(typeof converted).toBe('number');
    expect(converted).toBeGreaterThan(0);

    const jpgPath = path.join(tmpDir, 'test.jpg');
    expect(fs.existsSync(jpgPath)).toBe(true);
    const stat = fs.statSync(jpgPath);
    expect(stat.size).toBeGreaterThan(0);
  }, 20000);
});
