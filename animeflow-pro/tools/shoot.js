/**
 * Screenshot helper: renders a page in both colour modes at a given viewport.
 *
 *   node tools/shoot.js index.html 1360x900
 *   node tools/shoot.js browse.html 420x900
 */

import { chromium } from 'playwright';
import { promises as fs } from 'node:fs';
import fsSync from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');
const PORT = 4174;

const target = process.argv[2] || 'index.html';
const [w, h] = (process.argv[3] || '1360x900').split('x').map(Number);
const full = process.argv.includes('--full');

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
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(PORT, r));

const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/usr/bin/chromium']
  .find((p) => fsSync.existsSync(p));
const browser = await chromium.launch(exe ? { executablePath: exe } : {});

await fs.mkdir(path.join(__dirname, 'shots'), { recursive: true });

for (const scheme of ['dark', 'light']) {
  const context = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme });
  const page = await context.newPage();
  await page.goto(`http://localhost:${PORT}/${target}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  const name = `${target.replace('.html', '')}-${scheme}-${w}.png`;
  await page.screenshot({ path: path.join(__dirname, 'shots', name), fullPage: full });
  console.log(`  wrote tools/shots/${name}`);
  await context.close();
}

await browser.close();
server.close();
