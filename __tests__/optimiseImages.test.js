const fs = require('fs');
const path = require('path');

describe('optimiseImages script', () => {
  // allow longer for image processing in CI environments
  jest.setTimeout(20000);
  const tmpDir = path.join(__dirname, 'tmp-images');
  beforeAll(async () => {
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    // create a tiny valid PNG using pngjs to ensure it's readable by pngjs
    // eslint-disable-next-line global-require
    const { PNG } = require('pngjs');
    const png = new PNG({ width: 1, height: 1 });
    // RGBA: red pixel
    png.data[0] = 255; // R
    png.data[1] = 0; // G
    png.data[2] = 0; // B
    png.data[3] = 255; // A
    const outPath = path.join(tmpDir, 'test.png');
    const buffer = PNG.sync.write(png);
    require('fs').writeFileSync(outPath, buffer);
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

  test('creates jpg from png', async () => {
    // Import the module at test-time; the module is import-safe and will not
    // execute work on import.
    // eslint-disable-next-line global-require
    const { main } = require('../src/server/optimiseImages.js');
    const converted = await main(tmpDir);
    expect(typeof converted).toBe('number');
    expect(converted).toBeGreaterThan(0);

    const jpgPath = path.join(tmpDir, 'test.jpg');
    expect(fs.existsSync(jpgPath)).toBe(true);
    const stat = fs.statSync(jpgPath);
    expect(stat.size).toBeGreaterThan(0);
  });
});
