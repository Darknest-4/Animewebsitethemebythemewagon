/**
 * Interaction test: drives the features that only exist at runtime — search,
 * theming, watchlist, filters, tabs, accordion, dropdowns, RTL, lightbox.
 *
 *   node tools/interactions.js
 */

import { chromium } from 'playwright';
import { promises as fs } from 'node:fs';
import fsSync from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');
const PORT = 4175;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json'
};

const server = http.createServer(async (req, res) => {
  const file = path.join(DIST, decodeURIComponent(req.url.split('?')[0]));
  try {
    const body = await fs.readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end('not found'); }
});
await new Promise((r) => server.listen(PORT, r));

const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/usr/bin/chromium']
  .find((p) => fsSync.existsSync(p));
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const context = await browser.newContext({ viewport: { width: 1360, height: 900 } });
const page = await context.newPage();

const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

const results = [];
const check = async (name, fn) => {
  try { await fn(); results.push([true, name]); }
  catch (err) { results.push([false, `${name} — ${err.message.split('\n')[0]}`]); }
};
const url = (p) => `http://localhost:${PORT}/${p}`;
const expect = (cond, msg) => { if (!cond) throw new Error(msg); };

await page.goto(url('index.html'), { waitUntil: 'networkidle' });

await check('theme toggle switches and persists', async () => {
  const before = await page.getAttribute('html', 'data-bs-theme');
  await page.click('[data-theme-toggle]');
  const after = await page.getAttribute('html', 'data-bs-theme');
  expect(before !== after, 'theme did not change');
  await page.reload({ waitUntil: 'networkidle' });
  expect(await page.getAttribute('html', 'data-bs-theme') === after, 'theme did not persist');
  await page.click('[data-theme-toggle]');
});

await check('"/" opens the search dialog', async () => {
  await page.keyboard.press('/');
  await page.waitForSelector('[data-search-dialog]:not([hidden])', { timeout: 2000 });
  expect(await page.evaluate(() => document.activeElement?.matches('[data-search-input]')), 'input not focused');
});

await check('search returns matching titles', async () => {
  await page.fill('[data-search-input]', 'frieren');
  await page.waitForFunction(() => document.querySelectorAll('[data-search-results] li[role=option]').length > 0, null, { timeout: 3000 });
  const first = await page.textContent('[data-search-results] li:first-child b');
  expect(/frieren/i.test(first), `unexpected first result: ${first}`);
});

await check('arrow keys move the search selection', async () => {
  await page.keyboard.press('ArrowDown');
  const selected = await page.$$eval('[data-search-results] li[aria-selected=true]', (els) => els.length);
  expect(selected === 1, `expected 1 selected option, got ${selected}`);
});

await check('Escape closes the search dialog', async () => {
  await page.keyboard.press('Escape');
  await page.waitForSelector('[data-search-dialog]', { state: 'hidden', timeout: 2000 });
});

await check('watchlist heart toggles, counts and persists', async () => {
  const heart = page.locator('[data-watchlist]').first();
  await heart.scrollIntoViewIfNeeded();
  await heart.click({ force: true });
  expect(await heart.getAttribute('aria-pressed') === 'true', 'aria-pressed not set');
  await page.waitForSelector('[data-watchlist-count]:not([hidden])', { timeout: 2000 });
  await page.goto(url('watchlist.html'), { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-watchlist-grid] .af-card', { timeout: 3000 });
});

await check('mega menu opens and closes', async () => {
  await page.goto(url('index.html'), { waitUntil: 'networkidle' });
  await page.click('[data-af-dropdown]');
  await page.waitForSelector('.dropdown-menu.show', { timeout: 2000 });
  await page.keyboard.press('Escape');
  expect(await page.$('.dropdown-menu.show') === null, 'menu stayed open');
});

await check('browse filters narrow the grid', async () => {
  await page.goto(url('browse.html'), { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-catalog-grid] .af-card:not(.af-skeleton-card)', { timeout: 4000 });
  const total = await page.textContent('[data-catalog-count]');
  await page.check('#side-g0');
  await page.waitForTimeout(300);
  const filtered = await page.textContent('[data-catalog-count]');
  expect(parseInt(filtered, 10) > 0, 'filter returned nothing');
  expect(filtered !== total, `count unchanged: ${total} → ${filtered}`);
  expect(new URL(page.url()).searchParams.get('genre'), 'filter not reflected in the URL');
});

await check('active filter chip removes the filter', async () => {
  await page.click('[data-chip-remove]');
  await page.waitForTimeout(300);
  expect(await page.$('[data-chip-remove]') === null, 'chip survived removal');
});

await check('sorting reorders results', async () => {
  const first = () => page.$eval('[data-catalog-grid] .af-card', (el) => el.dataset.slug);
  const before = await first();
  await page.selectOption('[data-filter="sort"]', 'title');
  await page.waitForTimeout(300);
  expect(await first() !== before, 'order unchanged after sorting');
});

await check('infinite scroll appends more cards', async () => {
  await page.selectOption('[data-filter="sort"]', 'popular');
  await page.waitForTimeout(200);
  const before = await page.$$eval('[data-catalog-grid] .af-card', (e) => e.length);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(700);
  const after = await page.$$eval('[data-catalog-grid] .af-card', (e) => e.length);
  expect(after > before, `no new cards: ${before} → ${after}`);
});

await check('details page hydrates from ?id=', async () => {
  await page.goto(url('anime-details.html?id=cowboy-bebop'), { waitUntil: 'networkidle' });
  const title = await page.textContent('[data-d-title]');
  expect(title.includes('Cowboy Bebop'), `title was "${title}"`);
  expect(await page.$$eval('[data-d-episodes-list] .af-episode', (e) => e.length) > 0, 'no episodes rendered');
});

await check('tabs switch panels', async () => {
  await page.click('#af-detail-tabs-t1');
  expect(await page.getAttribute('#af-detail-tabs-t1', 'aria-selected') === 'true', 'tab not selected');
  expect(await page.isVisible('#af-detail-tabs-p1'), 'panel not shown');
});

await check('lightbox opens from the gallery', async () => {
  await page.click('[data-lightbox]');
  await page.waitForSelector('[data-lightbox-host]:not([hidden])', { timeout: 2000 });
  await page.keyboard.press('Escape');
  await page.waitForSelector('[data-lightbox-host]', { state: 'hidden', timeout: 2000 });
});

await check('watch page switches episodes', async () => {
  await page.goto(url('watch.html?id=cowboy-bebop&ep=1'), { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-goto-episode="4"]', { timeout: 3000 });
  await page.click('[data-goto-episode="4"]');
  await page.waitForTimeout(200);
  const label = await page.textContent('[data-w-episode]');
  expect(label.includes('Episode 4'), `label was "${label}"`);
  expect(page.url().includes('ep=4'), 'URL not updated');
});

await check('accordion opens and closes', async () => {
  await page.goto(url('faq.html'), { waitUntil: 'networkidle' });
  const second = page.locator('#af-faq .accordion-button').nth(1);
  await second.click();
  await page.waitForTimeout(450);
  expect(await second.getAttribute('aria-expanded') === 'true', 'did not open');
  expect(await page.getAttribute('#af-faq .accordion-button', 'aria-expanded') === 'false', 'sibling stayed open');
});

await check('pricing toggle switches to yearly', async () => {
  await page.goto(url('pricing.html'), { waitUntil: 'networkidle' });
  const premium = '.af-price.is-featured [data-price-monthly]';
  const before = await page.textContent(premium);
  await page.click('#af-billing');
  await page.waitForTimeout(200);
  const after = await page.textContent(premium);
  const period = await page.textContent('.af-price.is-featured [data-price-period]');
  expect(before !== after && period === '/year', `${before} → ${after} (${period})`);
});

await check('form validation blocks an empty submit', async () => {
  await page.goto(url('contact.html'), { waitUntil: 'networkidle' });
  await page.click('button[type="submit"]');
  await page.waitForSelector('.is-invalid', { timeout: 2000 });
  const message = await page.textContent('.af-field .invalid-feedback');
  expect(message.trim().length > 0, 'no error message rendered');
});

await check('password strength meter reacts', async () => {
  await page.goto(url('register.html'), { waitUntil: 'networkidle' });
  await page.fill('#reg-password', 'abc');
  const weak = await page.getAttribute('#reg-meter', 'data-score');
  await page.fill('#reg-password', 'Str0ng!Passphrase42');
  const strong = await page.getAttribute('#reg-meter', 'data-score');
  expect(Number(strong) > Number(weak), `${weak} → ${strong}`);
});

await check('RTL switch flips direction and stylesheet', async () => {
  await page.goto(url('index.html'), { waitUntil: 'networkidle' });
  await page.click('[data-dir-toggle]');
  await page.waitForTimeout(200);
  expect(await page.getAttribute('html', 'dir') === 'rtl', 'dir not set');
  const href = await page.getAttribute('#af-stylesheet', 'href');
  expect(href.includes('rtl'), `stylesheet is ${href}`);
  await page.click('[data-dir-toggle]');
});

await check('dashboard renders continue-watching', async () => {
  await page.goto(url('dashboard.html'), { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-continue-grid] .af-continue', { timeout: 3000 });
});

await check('search results page reads ?q=', async () => {
  await page.goto(url('search.html?q=mappa'), { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-search-page] .af-card', { timeout: 3000 });
  const heading = await page.textContent('[data-search-heading]');
  expect(/result/i.test(heading), `heading was "${heading}"`);
});

await check('trailer modal loads the iframe only on click', async () => {
  await page.goto(url('anime-details.html?id=cowboy-bebop'), { waitUntil: 'networkidle' });
  expect(await page.$('#af-trailer iframe') === null, 'iframe present before click');
  await page.click('[data-trailer]');
  await page.waitForSelector('#af-trailer iframe', { timeout: 3000 });
});

await browser.close();
server.close();

console.log();
results.forEach(([ok, name]) => console.log(`${ok ? '\x1b[32m  ok  \x1b[0m' : '\x1b[31m FAIL \x1b[0m'} ${name}`));
const failed = results.filter(([ok]) => !ok).length;
const ignorable = (e) => e.includes('youtube') || e.includes('ERR_BLOCKED') || e.includes('net::');
const real = [...new Set(errors)].filter((e) => !ignorable(e));
if (real.length) { console.log('\nJavaScript errors:'); real.forEach((e) => console.log(`  ${e}`)); }
console.log(`\n${failed || real.length ? `\x1b[31m${failed} failed, ${real.length} JS error(s)\x1b[0m` : '\x1b[32mall interactions pass\x1b[0m'}`);
process.exit(failed || real.length ? 1 : 0);
