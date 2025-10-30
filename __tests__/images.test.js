let jpgifyLocal;
beforeAll(async () => {
  const mod = await import('../src/client/utils/images.js');
  jpgifyLocal = mod.jpgifyLocal;
});

describe('jpgifyLocal', () => {
  test('returns nulls for empty input', () => {
    const res = jpgifyLocal(null);
    expect(res.displaySrc).toBeNull();
    expect(res.originalSrc).toBeNull();
  });

  test('remote URLs are returned unchanged', () => {
    const url = '/image.png';
    const res = jpgifyLocal(url);
    expect(res.displaySrc).toBeDefined();
    expect(res.originalSrc).toBeDefined();
  });

  test('relative local filename returns jpg display and original paths', () => {
    const raw = 'banner.png';
    const res = jpgifyLocal(raw);
    expect(
      res.displaySrc.endsWith('/data/images/banner.jpg') ||
        res.displaySrc.endsWith('data/images/banner.jpg')
    ).toBe(true);
    expect(
      res.originalSrc.endsWith('/data/images/banner.png') ||
        res.originalSrc.endsWith('data/images/banner.png')
    ).toBe(true);
  });

  test('absolute local path is handled', () => {
    const raw = '/data/images/foo.webp';
    const res = jpgifyLocal(raw);
    expect(
      res.displaySrc.endsWith('/data/images/foo.jpg') ||
        res.displaySrc.endsWith('data/images/foo.jpg')
    ).toBe(true);
    expect(
      res.originalSrc.endsWith('/data/images/foo.webp') ||
        res.originalSrc.endsWith('data/images/foo.webp')
    ).toBe(true);
  });
});
