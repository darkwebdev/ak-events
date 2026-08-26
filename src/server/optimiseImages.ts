import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import jpegJs from 'jpeg-js';

const defaultDir = () => path.join(process.cwd(), 'public/data/images');

async function processFile(file: string, dir: string): Promise<boolean | undefined> {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  const input = path.join(dir, file);
  const output = path.join(dir, `${base}.jpg`);
  if (ext === '.jpg' || ext === '.jpeg') return undefined;
  if (fs.existsSync(output)) {
    // already converted
    return undefined;
  }

  try {
    // Only handle PNG files using pngjs. For other formats (webp/gif) we skip.
    if (ext === '.png') {
      const inputBuf = fs.readFileSync(input);
      const png = PNG.sync.read(inputBuf);
      // png.data is RGBA Buffer
      const { data, width, height } = png;
      const encoded = jpegJs.encode({ data, width, height }, 80);
      fs.writeFileSync(output, encoded.data);
      return true;
    }

    console.warn('unsupported format for conversion:', input);
    return false;
  } catch (e) {
    console.error('Failed to convert', input, e && (e as Error).message);
    return false;
  }
}

export async function main(dirArg?: string): Promise<number | undefined> {
  const dirToUse = dirArg || process.argv[2] || defaultDir();
  if (!fs.existsSync(dirToUse)) {
    console.error('Images directory not found:', dirToUse);
    return undefined;
  }
  const files = fs.readdirSync(dirToUse);
  let convertedCount = 0;
  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    if (['.png', '.webp', '.gif', '.jpeg'].includes(ext)) {
      // do not parallelize to avoid memory spikes
      // eslint-disable-next-line no-await-in-loop
      const ok = await processFile(f, dirToUse);
      if (ok) convertedCount += 1;
    }
  }
  return convertedCount;
}
