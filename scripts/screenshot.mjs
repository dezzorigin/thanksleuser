// Screenshot dokumentasi: 8 adegan situs yang sedang berjalan (server lokal)
// ke docs/screenshots/*.png — dipakai README + video demo.
//
// Kenapa ada cache gambar: gambar Unsplash & cdn.21st.dev TIDAK bisa dimuat
// lewat forwarder VM ini (CONNECT ke host gambar menggantung; GET langsung
// via curl justru 200). Skrip ini mengunduh semua gambar eksternal yang
// dirujuk halaman via curl ke scripts/.imgcache/, lalu mencegat request
// gambar di Chromium dan menyajikannya dari cache — halaman yang direkam
// tetap sama persis, hanya transport gambarnya yang lokal.
//
// Prasyarat: puppeteer-core (coba node_modules dulu, lalu
// ~/workspace/absensirapat-audit/diag/node_modules), Chromium di cache
// (~/.cache/ms-playwright/chromium-1234), forwarder 127.0.0.1:18081 hidup,
// dan server lokal di PORT (default 8329 — jalankan `npm run dev` dulu
// atau biarkan skrip ini memakainya bila sudah jalan).
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(ROOT, 'scripts', '.imgcache');
const OUT = join(ROOT, 'docs', 'screenshots');
const PORT = process.env.PORT || '8329';
const BASE = `http://127.0.0.1:${PORT}/index.html`;

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let puppeteer;
try {
  puppeteer = require('puppeteer-core');
} catch {
  try {
    puppeteer = require('/home/hatch/workspace/absensirapat-audit/diag/node_modules/puppeteer-core');
  } catch {
    console.error('puppeteer-core tidak ditemukan. Pasang dulu: npm i -D puppeteer-core, atau sediakan di ~/workspace/absensirapat-audit/diag/node_modules.');
    process.exit(1);
  }
}

mkdirSync(CACHE, { recursive: true });
mkdirSync(OUT, { recursive: true });

// Kumpulkan semua URL gambar eksternal dari index.html + script.js + trips.json.
const sources = [
  readFileSync(join(ROOT, 'index.html'), 'utf-8'),
  readFileSync(join(ROOT, 'script.js'), 'utf-8'),
  readFileSync(join(ROOT, 'data', 'trips.json'), 'utf-8'),
].join('\n');
const urls = [...new Set([...sources.matchAll(/https:\/\/(?:images\.unsplash\.com|cdn\.21st\.dev)[^"'\\\s)]+/g)].map((m) => m[0]))];
console.log(`${urls.length} gambar eksternal ditemukan`);

const byUrl = new Map();
for (const url of urls) {
  const key = createHash('sha1').update(url).digest('hex').slice(0, 16);
  const ext = url.includes('.webp') ? 'webp' : url.includes('.png') ? 'png' : 'jpg';
  const file = join(CACHE, `${key}.${ext}`);
  if (!existsSync(file) || readFileSync(file).length < 1000) {
    try {
      execFileSync('curl', ['-sL', '--max-time', '30', '-o', file, url], { stdio: 'ignore' });
    } catch { /* biarkan gagal — halaman punya onerror fallback */ }
  }
  if (existsSync(file) && readFileSync(file).length >= 1000) byUrl.set(url, file);
}
console.log(`${byUrl.size}/${urls.length} gambar ter-cache`);

const exe = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  || join(process.env.HOME, '.cache/ms-playwright/chromium-1234/chrome-linux/chrome');
const browser = await puppeteer.launch({
  executablePath: exe,
  headless: 'new',
  args: ['--proxy-server=http://127.0.0.1:18081', '--no-sandbox', '--disable-dev-shm-usage'],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
await page.setRequestInterception(true);
page.on('request', (req) => {
  const url = req.url();
  if (byUrl.has(url)) {
    const file = byUrl.get(url);
    const ext = file.split('.').pop();
    const type = ext === 'webp' ? 'image/webp' : ext === 'png' ? 'image/png' : 'image/jpeg';
    req.respond({ status: 200, contentType: type, body: readFileSync(file) });
  } else {
    req.continue();
  }
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const shot = (name) => page.screenshot({ path: join(OUT, name) });
const scrollTo = async (sel) => {
  await page.evaluate((s) => {
    document.querySelector(s)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    window.scrollBy(0, -70);
  }, sel);
  await sleep(1400);
};

await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('.tour-card', { timeout: 45000 });
await sleep(3500);

await shot('01-hero.png');

await page.click('#destinasi-tabs .tab-btn[data-dest="gle-bae"]');
await scrollTo('#destinasi');
await shot('02-destinasi.png');

await scrollTo('#trips');
await shot('03-trips.png');

// Detail trip: kartu ke-5 (Kuta Malaka) masih bisa dibooking.
const cards = await page.$$('.tour-card');
await cards[4].click();
await page.waitForSelector('#trip-detail-modal.open', { timeout: 10000 });
await sleep(1200);
// Modal detail lebih tinggi dari viewport 900px — tinggikan sementara
// supaya tombol Booking ikut tertangkap di screenshot.
await page.setViewport({ width: 1440, height: 1150 });
await sleep(600);
await shot('04-trip-detail.png');
await page.setViewport({ width: 1440, height: 900 });

// Wizard booking dari modal detail.
await page.evaluate(() => {
  [...document.querySelectorAll('#trip-detail-modal button')]
    .find((b) => b.textContent.includes('Booking Slot Trip Ini'))?.click();
});
await page.waitForSelector('#booking-modal.open', { timeout: 10000 });
await sleep(1200);
await shot('05-booking-wizard.png');
await page.click('#modal-close-btn');
await sleep(800);

await scrollTo('#merchandise');
await shot('06-merchandise.png');

await scrollTo('#dokumentasi');
await shot('07-gallery.png');

await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
await sleep(1400);
await shot('08-footer.png');

await browser.close();
console.log('screenshots:', readdirSync(OUT).filter((f) => f.endsWith('.png')).join(', '));
