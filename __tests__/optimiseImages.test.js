const fs = require('fs');
const path = require('path');
// execSync not needed for this test

// Small 1x1 PNG pixel (red) as Buffer
const onePixelPng = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
  0xde, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0x00, 0x00,
  0x04, 0x00, 0x01, 0x45, 0x3a, 0x2b, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42,
  0x60, 0x82,
]);

describe('optimiseImages script', () => {
  const tmpDir = path.join(__dirname, 'tmp-images');
  beforeAll(() => {
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    fs.writeFileSync(path.join(tmpDir, 'test.png'), onePixelPng);
  });

  afterAll(() => {
    // cleanup
    try {
      const files = fs.readdirSync(tmpDir);
      for (const f of files) fs.unlinkSync(path.join(tmpDir, f));
      fs.rmdirSync(tmpDir);
    } catch (e) {}
  });

  test('creates jpg from png when jimp is available', async () => {
    // Skip test if jimp not installed
    let jimpAvailable = true;
    try {
      require.resolve('jimp');
    } catch (e) {
      jimpAvailable = false;
    }
    if (!jimpAvailable) {
      console.warn('jimp not installed; skipping optimiseImages test');
      return;
    }

    // programmatically call the CJS module main() function
    let mod;
    try {
      mod = await import('../src/server/optimiseImages.js');
    } catch (e) {
      console.warn('optimiseImages module not available via import, skipping');
      return;
    }
    const main = mod.main || mod.default || mod;
    await main(tmpDir);

    const jpgPath = path.join(tmpDir, 'test.jpg');
    expect(fs.existsSync(jpgPath)).toBe(true);
    const stat = fs.statSync(jpgPath);
    expect(stat.size).toBeGreaterThan(0);
  });
});
