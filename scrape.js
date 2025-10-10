const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');

const url = 'https://oldwell.info/';

async function scrapeEvents() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait a bit for dynamic content
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('Evaluating page for events...');
  const events = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('*')).filter(el =>
      el.textContent.includes('wiki.gg') &&
      (el.textContent.includes('Event') || el.textContent.includes('Story') || el.textContent.includes('Vignette') || el.textContent.includes('Strategies') || el.textContent.includes('Contract') || el.textContent.includes('Rerun') || el.textContent.includes('Collab') || el.textContent.includes('Special')) &&
      !el.textContent.includes('Maintenance')
    );
    console.log('Found', elements.length, 'event elements');
    const events = [];
    elements.forEach(el => {
      const text = el.textContent;
      let splitOn = '';
      if (text.includes('Event')) splitOn = 'Event';
      else if (text.includes('Story')) splitOn = 'Story';
      else if (text.includes('Vignette')) splitOn = 'Vignette';
      else if (text.includes('Strategies')) splitOn = 'Strategies';
      else if (text.includes('Contract')) splitOn = 'Contract';
      else if (text.includes('Rerun')) splitOn = 'Rerun';
      else if (text.includes('Collab')) splitOn = 'Collab';
      else if (text.includes('Special')) splitOn = 'Special';
      if (splitOn) {
        const name = text.split(splitOn)[0].trim().replace('🔗', '').trim().replace(/\s*(limited|side)\s*$/i, '');
        const dateMatch = text.match(/Date:\s*(\d{2}\.\d{2}\.\d{4})/);
        let dateStr = null;
        if (dateMatch) {
          dateStr = dateMatch[1];
        }
        const img = el.querySelector('img');
        let image = null;
        if (img) {
          image = img.src;
        }
        if (name && !name.includes('Arknights:') && name.length > 3) {
          events.push({ name, dateStr, type: splitOn, image });
        }
      }
    });
    console.log('Extracted', events.length, 'events');
    // Deduplicate by name
    const uniqueEvents = events.filter((e, i, arr) => arr.findIndex(e2 => e2.name === e.name) === i);
    return uniqueEvents;
  });

  await browser.close();

  console.log('Scraped events:', events);

  // Process events
  const processed = events.map(event => {
    let start, end;
    if (event.dateStr) {
      const [dd, mm, yyyy] = event.dateStr.split('.');
      start = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
      const startDate = new Date(start);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7);
      end = endDate.toISOString().split('T')[0];
    } else {
      start = 'TBD';
      end = '';
    }
    return { name: event.name, start, end, type: event.type, image: event.image };
  });

  console.log('Processed events:', processed);

  // Save to events.json (all events, no filtering)
  fs.writeFileSync('events.json', JSON.stringify(processed, null, 2));
  console.log('Saved all events to events.json');

  // Download images
  const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
      const options = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://oldwell.info/'
        }
      };
      https.get(url, options, (res) => {
        if (res.statusCode === 200) {
          const file = fs.createWriteStream(filepath);
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        } else {
          reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        }
      }).on('error', reject);
    });
  };

  for (const event of processed) {
    if (event.image) {
      const filename = event.image.split('/').pop();
      const filepath = `images/${filename}`;
      try {
        await downloadImage(event.image, filepath);
        event.image = filepath; // update to local path
        console.log('Downloaded image for', event.name);
      } catch (err) {
        console.error('Error downloading image for', event.name, err.message);
        event.image = null;
      }
    }
  }

  // Save updated events.json with local image paths
  fs.writeFileSync('events.json', JSON.stringify(processed, null, 2));
  console.log('Updated events.json with local image paths');
}

scrapeEvents().catch(console.error);
