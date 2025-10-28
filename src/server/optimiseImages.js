import fs from 'fs';
import path from 'path';
import * as JimpPkg from 'jimp';
import { fileURLToPath } from 'url';

const Jimp = (JimpPkg && (JimpPkg.Jimp || JimpPkg.default)) || JimpPkg;

const defaultDir = () => path.join(process.cwd(), 'public/data/images');

async function processFile(file, dir) {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  const input = path.join(dir, file);
  const output = path.join(dir, `${base}.jpg`);
  if (ext === '.jpg' || ext === '.jpeg') return;
  if (fs.existsSync(output)) {
    console.log('JPG exists, skipping', output);
    return;
  }
  try {
    if (!Jimp || (typeof Jimp.read !== 'function' && typeof Jimp !== 'function'))
      throw new Error('Jimp.read not available');
    let image;
    if (typeof Jimp.read === 'function') {
      image = await Jimp.read(input);
    } else if (typeof Jimp === 'function' && typeof Jimp.create === 'function') {
      image = await new Promise((resolve, reject) => {
        Jimp.create(input, (err, img) => (err ? reject(err) : resolve(img)));
      });
    } else {
      // try Jimp.Jimp.read
      const J = Jimp.Jimp || Jimp;
      if (J && typeof J.read === 'function') image = await J.read(input);
      else throw new Error('Jimp.read not available');
    }
    try {
      if (typeof image.background === 'function') image.background(0xffffffff);
    } catch (e) {}
    if (typeof image.quality === 'function' && typeof image.writeAsync === 'function') {
      await image.quality(80).writeAsync(output);
    } else if (typeof image.quality === 'function' && typeof image.write === 'function') {
      image.quality(80).write(output);
    } else if (typeof image.getBufferAsync === 'function') {
      const buf = await image.getBufferAsync(Jimp.MIME_JPEG);
      fs.writeFileSync(output, buf);
    } else {
      throw new Error('No supported write method on Jimp image');
    }
    console.log('Converted', input, '->', output);
  } catch (e) {
    console.error('Failed to convert', input, e && e.message);
  }
}

export async function main(dirArg) {
  const dirToUse = dirArg || process.argv[2] || defaultDir();
  if (!fs.existsSync(dirToUse)) {
    console.error('Images directory not found:', dirToUse);
    return;
  }
  const files = fs.readdirSync(dirToUse);
  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    if (['.png', '.webp', '.gif', '.jpeg'].includes(ext)) {
      await processFile(f, dirToUse);
    }
  }
}

// If run as CLI, execute
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  main().catch((err) => {
    console.error('optimiseImages failed:', err && err.message);
    process.exit(1);
  });
}
