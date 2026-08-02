/**
 * Smoke test: opens every built page in Chromium, fails on console errors,
 * failed requests, missing images and empty data-driven regions.
 *
 *   node tools/verify.js            headless run over dist/
 *   node tools/verify.js --shots    also writes screenshots to tools/shots/
 */

import { chromium } from 'playwright';
import { promises as fs } from 'node:fs';
import fsSync from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');
const PORT = 4173;
const shots = process.argv.includes('--shots');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.xml': 'application/xml',
  '.txt': 'text/plain', '.webmanifest': 'application/manifest+json'
};

const server = http.createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(DIST, url === '/' ? 'index.html' : url);
  try {
    const body = await fs.readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('not found');
  }
});

await new Promise((resolve) => server.listen(PORT, resolve));

const pages = (await fs.readdir(DIST)).filter((f) => f.endsWith('.html')).sort();
// Use a preinstalled Chromium when the environment provides one, so the
// smoke test does not need a browser download.
const preinstalled = process.env.CHROMIUM_PATH
  || ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/usr/bin/chromium', '/usr/bin/google-chrome']
    .find((p) => { try { return fsSync.existsSync(p); } catch { return false; } });

const browser = await chromium.launch(preinstalled ? { executablePath: preinstalled } : {});
let failures = 0;

// Pages whose main content is fetched, with the selector that must fill in.
const HYDRATED = {
  'browse.html': '[data-catalog-grid] .af-card:not(.af-skeleton-card)',
  'anime-details.html': '[data-d-episodes-list] .af-episode',
  'watch.html': '[data-watch-episodes] .af-episode',
  'dashboard.html': '[data-continue-grid] .af-continue',
  'blog-post.html': '[data-post-body]:not([hidden]) p'
};

for (const file of pages) {
  const context = await browser.newContext({ viewport: { width: 1360, height: 900 } });
  const page = await context.newPage();
  const problems = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`console: ${msg.text()}`);
  });
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
  page.on('requestfailed', (req) => {
    if (!req.url().includes('youtube')) problems.push(`request failed: ${req.url()}`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400 && !res.url().includes('youtube')) {
      problems.push(`${res.status()} ${res.url().replace(`http://localhost:${PORT}/`, '')}`);
    }
  });

  const query = file === 'anime-details.html' ? '?id=jujutsu-kaisen'
    : file === 'watch.html' ? '?id=solo-leveling&ep=3'
    : file === 'blog-post.html' ? '?slug=dropping-jquery'
    : file === 'search.html' ? '?q=frieren' : '';

  await page.goto(`http://localhost:${PORT}/${file}${query}`, { waitUntil: 'networkidle' });

  const needs = HYDRATED[file];
  if (needs) {
    try {
      await page.waitForSelector(needs, { timeout: 4000, state: 'attached' });
    } catch {
      problems.push(`hydration: nothing matched ${needs}`);
    }
  }

  // Every image must actually decode.
  const brokenImages = await page.evaluate(() => Array.from(document.images)
    .filter((img) => img.getAttribute('src') && img.complete && img.naturalWidth === 0)
    .map((img) => img.getAttribute('src')));
  brokenImages.forEach((src) => problems.push(`broken image: ${src}`));

  // Basic document sanity.
  const doc = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelectorAll('h1').length,
    main: !!document.querySelector('main#main'),
    canonical: !!document.querySelector('link[rel=canonical]'),
    og: !!document.querySelector('meta[property="og:title"]'),
    lang: document.documentElement.lang,
    unresolvedIcons: Array.from(document.querySelectorAll('use'))
      .map((u) => u.getAttribute('href'))
      .filter((h) => h && !document.querySelector(`symbol${h}`))
  }));
  if (!doc.title) problems.push('missing <title>');
  if (doc.h1 !== 1) problems.push(`expected 1 <h1>, found ${doc.h1}`);
  if (!doc.main) problems.push('missing <main id="main">');
  if (!doc.canonical) problems.push('missing canonical');
  if (!doc.og) problems.push('missing og:title');
  if (!doc.lang) problems.push('missing lang attribute');
  [...new Set(doc.unresolvedIcons)].forEach((h) => problems.push(`icon not in sprite: ${h}`));

  if (shots) {
    await fs.mkdir(path.join(__dirname, 'shots'), { recursive: true });
    await page.screenshot({ path: path.join(__dirname, 'shots', file.replace('.html', '.png')), fullPage: false });
  }

  const ok = problems.length === 0;
  if (!ok) failures += 1;
  console.log(`${ok ? '\x1b[32m  ok  \x1b[0m' : '\x1b[31m FAIL \x1b[0m'} ${file}`);
  [...new Set(problems)].forEach((p) => console.log(`        ${p}`));

  await context.close();
}

await browser.close();
server.close();

console.log(`\n${failures ? `\x1b[31m${failures} page(s) with problems\x1b[0m` : '\x1b[32mall pages clean\x1b[0m'}`);
process.exit(failures ? 1 : 0);
