const puppeteer = require('puppeteer');

async function createRenderer(opts = {}) {
  const browser = await puppeteer.launch(Object.assign({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] }, opts.launchOptions || {}));
  async function render(url, options = {}) {
    const page = await browser.newPage();
    try {
      const waitUntil = options.waitUntil || 'networkidle2';
      await page.goto(url, { waitUntil });
      if (options.delay && options.delay > 0) await new Promise(r => setTimeout(r, options.delay));
      return await page.content();
    } finally {
      try { await page.close(); } catch (e) { /* ignore */ }
    }
  }

  async function close() {
    try { await browser.close(); } catch (e) { /* ignore */ }
  }

  return { render, close };
}

module.exports = { createRenderer };
