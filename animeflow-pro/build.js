#!/usr/bin/env node
/**
 * AnimeFlow Pro — build script.
 *
 *   node build.js            one-off build into dist/
 *   node build.js --clean    remove dist/
 *   node build.js --watch    rebuild on change
 *   node build.js --serve    static server on :3000 (combine with --watch)
 *
 * Everything it produces is plain static output: HTML, one CSS file (plus an
 * RTL twin), one JS bundle, generated SVG artwork and a JSON catalogue. The
 * dist/ folder is the deliverable — it has no runtime dependency on Node.
 */

import { promises as fs } from 'node:fs';
import fsSync from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as sass from 'sass';
import * as esbuild from 'esbuild';
import rtlcss from 'rtlcss';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');
const ASSETS = path.join(DIST, 'assets');
const argv = new Set(process.argv.slice(2));

const log = (label, msg) => console.log(`  \x1b[35m${label.padEnd(9)}\x1b[0m ${msg}`);

/* ------------------------------------------------------------------ helpers */

const write = async (file, contents) => {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, contents);
};

const rel = (file) => path.relative(DIST, file).split(path.sep).join('/');

/* ------------------------------------------------------------- icon sprite */

/** Icons pulled out of bootstrap-icons and inlined as one <symbol> sprite. */
const ICONS = [
  'play-fill', 'play-circle-fill', 'pause-fill', 'heart', 'heart-fill', 'star-fill',
  'star-half', 'star', 'search', 'x-lg', 'list', 'chevron-down', 'chevron-right',
  'chevron-left', 'chevron-up', 'arrow-up', 'arrow-right', 'arrow-left', 'moon-stars',
  'sun', 'translate', 'grid', 'calendar-week', 'film', 'speedometer2',
  'box-arrow-in-right', 'person-plus', 'key', 'tag', 'journal-text', 'info-circle',
  'question-circle', 'envelope', 'exclamation-triangle', 'house', 'bookmark',
  'bookmark-fill', 'clock', 'eye', 'share', 'download', 'gear', 'bell', 'check-lg',
  'check-circle-fill', 'x-circle-fill', 'info-circle-fill', 'exclamation-triangle-fill',
  'three-dots', 'plus-lg', 'dash-lg', 'funnel', 'sort-down', 'collection-play',
  'trophy', 'fire', 'lightning-charge', 'bootstrap', 'phone', 'universal-access',
  'twitter-x', 'discord', 'youtube', 'instagram', 'github', 'quote', 'send',
  'geo-alt', 'telephone', 'chat-dots', 'shield-check', 'cloud-arrow-down', 'badge-hd',
  'cast', 'badge-cc', 'people', 'person-circle', 'box-arrow-right', 'sliders',
  'volume-up', 'fullscreen', 'skip-forward-fill', 'skip-backward-fill', 'trash',
  'pencil', 'link-45deg', 'clipboard-check', 'emoji-smile', 'stars', 'globe',
  'credit-card', 'rocket-takeoff', 'palette', 'code-slash', 'layers', 'archive'
];

/**
 * Returns a lookup of name → <symbol>. The layout inlines only the symbols a
 * given page actually references, which keeps ~30 kB of unused icon paths off
 * every single document.
 */
export const RUNTIME_ICONS = [
  'star', 'star-half', 'star-fill', 'play-fill', 'play-circle-fill', 'heart', 'heart-fill',
  'check-circle-fill', 'x-circle-fill', 'exclamation-triangle-fill', 'info-circle-fill',
  'x-lg', 'search', 'funnel', 'bookmark', 'bookmark-fill'
];

async function buildSprite() {
  const dir = path.join(__dirname, 'node_modules', 'bootstrap-icons', 'icons');
  const symbols = {};
  const missing = [];
  for (const name of ICONS) {
    const file = path.join(dir, `${name}.svg`);
    if (!fsSync.existsSync(file)) { missing.push(name); continue; }
    const svg = await fs.readFile(file, 'utf8');
    const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
    symbols[name] = `<symbol id="i-${name}" viewBox="0 0 16 16">${inner}</symbol>`;
  }
  if (missing.length) log('icons', `\x1b[33mskipped unknown: ${missing.join(', ')}\x1b[0m`);
  return symbols;
}

/* ------------------------------------------------------- generated artwork */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const initials = (title) =>
  title.replace(/[^\p{L}\p{N} ]/gu, ' ').split(/\s+/).filter(Boolean).slice(0, 2)
    .map((w) => w[0].toUpperCase()).join('');

/** 2:3 poster: gradient field, orbit rings, monogram, title plate. */
function poster({ title, hue, year, type }) {
  const h2 = (hue + 55) % 360;
  const id = Math.abs([...title].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7)) % 1000;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600" role="img" aria-label="${esc(title)} poster artwork">
<defs>
<linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${hue} 72% 30%)"/><stop offset=".55" stop-color="hsl(${h2} 68% 18%)"/><stop offset="1" stop-color="hsl(${(hue + 200) % 360} 45% 8%)"/>
</linearGradient>
<radialGradient id="r${id}" cx=".28" cy=".22" r=".85">
<stop offset="0" stop-color="hsl(${hue} 95% 68%)" stop-opacity=".75"/><stop offset="1" stop-color="hsl(${hue} 95% 60%)" stop-opacity="0"/>
</radialGradient>
<linearGradient id="p${id}" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#05050c" stop-opacity="0"/><stop offset="1" stop-color="#05050c" stop-opacity=".92"/>
</linearGradient>
</defs>
<rect width="400" height="600" fill="url(#g${id})"/>
<rect width="400" height="600" fill="url(#r${id})"/>
<g fill="none" stroke="hsl(${hue} 90% 78%)" stroke-opacity=".28">
<circle cx="300" cy="150" r="120" stroke-width="1.5"/><circle cx="300" cy="150" r="78" stroke-width="1"/><circle cx="300" cy="150" r="164" stroke-width=".75"/>
</g>
<g stroke="hsl(${h2} 90% 72%)" stroke-opacity=".18" stroke-width="26">
<path d="M-60 470 L200 210"/><path d="M20 560 L300 280"/>
</g>
<text x="200" y="330" font-family="system-ui,Segoe UI,Roboto,sans-serif" font-size="150" font-weight="800" letter-spacing="-6" text-anchor="middle" fill="#fff" fill-opacity=".92">${esc(initials(title))}</text>
<rect y="380" width="400" height="220" fill="url(#p${id})"/>
<text x="28" y="536" font-family="system-ui,Segoe UI,Roboto,sans-serif" font-size="21" font-weight="700" fill="#fff">${esc(title.length > 24 ? title.slice(0, 23) + '…' : title)}</text>
<text x="28" y="562" font-family="system-ui,Segoe UI,Roboto,sans-serif" font-size="15" fill="#fff" fill-opacity=".62">${esc(type)} · ${year}</text>
</svg>`;
}

/** 16:9 backdrop used behind heroes and player pages. */
function backdrop({ title, hue }) {
  const h2 = (hue + 60) % 360;
  const id = Math.abs([...title].reduce((a, c) => (a * 17 + c.charCodeAt(0)) | 0, 3)) % 1000;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" role="img" aria-label="${esc(title)} key art">
<defs>
<linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${hue} 65% 26%)"/><stop offset=".5" stop-color="hsl(${h2} 60% 14%)"/><stop offset="1" stop-color="hsl(${(hue + 210) % 360} 50% 7%)"/>
</linearGradient>
<radialGradient id="bl${id}" cx=".7" cy=".3" r=".6">
<stop offset="0" stop-color="hsl(${h2} 96% 65%)" stop-opacity=".6"/><stop offset="1" stop-color="hsl(${h2} 96% 65%)" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="1280" height="720" fill="url(#bg${id})"/>
<rect width="1280" height="720" fill="url(#bl${id})"/>
<g fill="none" stroke="#fff" stroke-opacity=".1">
<path d="M0 560 C 260 470 420 640 760 520 S 1120 400 1280 470" stroke-width="2"/>
<path d="M0 620 C 300 540 460 700 800 580 S 1140 470 1280 530" stroke-width="1.5"/>
</g>
<g fill="hsl(${hue} 95% 80%)" fill-opacity=".5">
<circle cx="180" cy="160" r="3"/><circle cx="340" cy="90" r="2"/><circle cx="980" cy="180" r="2.5"/><circle cx="1120" cy="90" r="2"/><circle cx="640" cy="120" r="2"/>
</g>
</svg>`;
}

/** Round avatar with initials, used for team, reviews and the account menu. */
function avatar({ name, hue }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160" role="img" aria-label="${esc(name)}">
<defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 78% 58%)"/><stop offset="1" stop-color="hsl(${(hue + 50) % 360} 74% 40%)"/></linearGradient></defs>
<rect width="160" height="160" rx="80" fill="url(#a)"/>
<text x="80" y="102" text-anchor="middle" font-family="system-ui,Segoe UI,Roboto,sans-serif" font-size="62" font-weight="700" fill="#fff">${esc(initials(name))}</text>
</svg>`;
}

/** Wordmark + favicon. */
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" role="img" aria-label="AnimeFlow Pro">
<defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a78bfa"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs>
<rect width="40" height="40" rx="12" fill="url(#lg)"/>
<path d="M13 11.5 26.5 20 13 28.5Z" fill="#0b0b14"/>
</svg>`;

async function buildArtwork(anime, siteData) {
  const { team, testimonials, reviewers } = siteData;
  let n = 0;
  for (const a of anime) {
    await write(path.join(ASSETS, 'img/posters', `${a.slug}.svg`), poster(a));
    n++;
  }
  for (const a of anime) {
    await write(path.join(ASSETS, 'img/backdrops', `${a.slug}.svg`), backdrop(a));
    n++;
  }
  for (const p of [...team, ...testimonials, ...reviewers]) {
    await write(path.join(ASSETS, 'img/avatars', `${slugify(p.name)}.svg`), avatar({ name: p.name, hue: p.hue }));
    n++;
  }
  await write(path.join(ASSETS, 'img/logo.svg'), logoSvg);
  await write(path.join(ASSETS, 'img/favicon.svg'), logoSvg);
  return n + 2;
}

export const slugify = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* ---------------------------------------------------------------- markdown */

async function loadPosts() {
  const dir = path.join(SRC, 'content', 'blog');
  if (!fsSync.existsSync(dir)) return [];
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.md'));
  const posts = [];
  for (const file of files) {
    const raw = await fs.readFile(path.join(dir, file), 'utf8');
    const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
    const meta = {};
    let body = raw;
    if (match) {
      body = raw.slice(match[0].length);
      for (const line of match[1].split('\n')) {
        const i = line.indexOf(':');
        if (i === -1) continue;
        const key = line.slice(0, i).trim();
        let value = line.slice(i + 1).trim();
        if (value.startsWith('[')) value = JSON.parse(value.replace(/'/g, '"'));
        meta[key] = value;
      }
    }
    const words = body.split(/\s+/).length;
    posts.push({
      ...meta,
      slug: meta.slug || file.replace(/\.md$/, ''),
      html: marked.parse(body, { mangle: false, headerIds: true }),
      readingTime: Math.max(1, Math.round(words / 220)),
      excerpt: meta.excerpt || body.replace(/[#>*`_]/g, '').trim().split('\n')[0].slice(0, 180)
    });
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

/* ------------------------------------------------------------------ styles */

async function buildStyles() {
  const entry = path.join(SRC, 'scss', 'main.scss');
  const out = sass.compile(entry, {
    loadPaths: [path.join(__dirname, 'node_modules'), path.join(SRC, 'scss')],
    style: 'compressed',
    quietDeps: true,
    silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'mixed-decls', 'legacy-js-api', 'abs-percent']
  });
  await write(path.join(ASSETS, 'css', 'animeflow.min.css'), out.css);
  const ltr = sass.compile(entry, {
    loadPaths: [path.join(__dirname, 'node_modules'), path.join(SRC, 'scss')],
    style: 'expanded',
    quietDeps: true,
    silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'mixed-decls', 'legacy-js-api', 'abs-percent']
  });
  await write(path.join(ASSETS, 'css', 'animeflow.css'), ltr.css);
  const rtl = rtlcss.process(out.css);
  await write(path.join(ASSETS, 'css', 'animeflow.rtl.min.css'), rtl);
  return (out.css.length / 1024).toFixed(1);
}

/* --------------------------------------------------------------- scripts */

async function buildScripts() {
  const shared = {
    entryPoints: [path.join(SRC, 'js', 'animeflow.js')],
    bundle: true,
    format: 'iife',
    target: ['es2020'],
    legalComments: 'none',
    logLevel: 'silent'
  };
  const min = await esbuild.build({
    ...shared, minify: true, outfile: path.join(ASSETS, 'js', 'animeflow.min.js'), write: false
  });
  await write(path.join(ASSETS, 'js', 'animeflow.min.js'), min.outputFiles[0].text);
  const dev = await esbuild.build({
    ...shared, minify: false, outfile: path.join(ASSETS, 'js', 'animeflow.js'), write: false
  });
  await write(path.join(ASSETS, 'js', 'animeflow.js'), dev.outputFiles[0].text);
  return (min.outputFiles[0].text.length / 1024).toFixed(1);
}

/* ------------------------------------------------------------------ pages */

async function loadModule(file) {
  // cache-bust so --watch picks up edits
  return import(`${pathToFileURL(file).href}?t=${Date.now()}`);
}

async function buildPages(ctx) {
  const dir = path.join(SRC, 'pages');
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.js')).sort();
  const { renderPage } = await loadModule(path.join(SRC, 'layouts', 'base.js'));
  const built = [];

  for (const file of files) {
    const mod = await loadModule(path.join(dir, file));
    const pages = mod.pages ? await mod.pages(ctx) : [{ meta: mod.meta, body: await mod.render(ctx) }];
    for (const page of pages) {
      const html = renderPage({ ...page, ctx });
      const outfile = path.join(DIST, page.meta.path);
      await write(outfile, html);
      built.push(page.meta);
    }
  }
  return built;
}

/* ------------------------------------------------------------ seo sidecars */

function sitemap(pages, site) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .filter((p) => !p.noindex)
    .map((p) => `  <url>\n    <loc>${site.url}/${p.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq || 'weekly'}</changefreq>\n    <priority>${p.priority || '0.7'}</priority>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemap s.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
    .replace('sitemap s', 'sitemaps');
}

const robots = (site) => `# AnimeFlow Pro
User-agent: *
Allow: /
Disallow: /dashboard.html
Disallow: /watchlist.html

Sitemap: ${site.url}/sitemap.xml
`;

const webmanifest = (site) => JSON.stringify({
  name: site.name,
  short_name: 'AnimeFlow',
  description: site.description,
  start_url: '/index.html',
  display: 'standalone',
  background_color: '#0b0b14',
  theme_color: site.themeColor,
  icons: [{ src: 'assets/img/favicon.svg', sizes: 'any', type: 'image/svg+xml' }]
}, null, 2);

/* ------------------------------------------------------------------- build */

async function build() {
  const t0 = Date.now();
  const animeMod = await loadModule(path.join(SRC, 'data', 'anime.js'));
  const siteMod = await loadModule(path.join(SRC, 'data', 'site.js'));
  const posts = await loadPosts();
  const sprite = await buildSprite();

  const ctx = { ...animeMod, ...siteMod, posts, sprite, runtimeIcons: RUNTIME_ICONS, slugify };

  await fs.mkdir(DIST, { recursive: true });
  const art = await buildArtwork(ctx.anime, ctx);
  log('artwork', `${art} generated SVG files`);

  const css = await buildStyles();
  log('styles', `animeflow.min.css — ${css} kB`);

  const js = await buildScripts();
  log('scripts', `animeflow.min.js — ${js} kB`);

  await write(path.join(ASSETS, 'data', 'anime.json'), JSON.stringify({
    updated: new Date().toISOString(),
    genres: ctx.genres,
    studios: ctx.studios,
    schedule: ctx.schedule,
    anime: ctx.anime
  }, null, 0));
  await write(path.join(ASSETS, 'data', 'posts.json'), JSON.stringify(
    posts.map(({ html, ...rest }) => rest), null, 0));
  log('data', `anime.json — ${ctx.anime.length} titles, posts.json — ${posts.length} articles`);

  const pages = await buildPages(ctx);
  log('pages', `${pages.length} HTML files`);

  await write(path.join(DIST, 'sitemap.xml'), sitemap(pages, ctx.site));
  await write(path.join(DIST, 'robots.txt'), robots(ctx.site));
  await write(path.join(DIST, 'site.webmanifest'), webmanifest(ctx.site));
  log('seo', 'sitemap.xml, robots.txt, site.webmanifest');

  console.log(`\n  \x1b[32m✓ built in ${Date.now() - t0} ms\x1b[0m → ${rel(DIST)}/\n`);
}

/* ------------------------------------------------------------------- cli */

if (argv.has('--clean')) {
  await fs.rm(DIST, { recursive: true, force: true });
  console.log('  cleaned dist/');
} else {
  await build().catch((err) => { console.error(err); process.exit(1); });
}

if (argv.has('--watch')) {
  let timer = null;
  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(() => build().catch((e) => console.error(e.message)), 120);
  };
  for (const sub of ['pages', 'layouts', 'lib', 'scss', 'js', 'data', 'content']) {
    const dir = path.join(SRC, sub);
    if (fsSync.existsSync(dir)) fsSync.watch(dir, { recursive: true }, rebuild);
  }
  console.log('  watching src/ …');
}

if (argv.has('--serve')) {
  const types = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
    '.json': 'application/json', '.svg': 'image/svg+xml', '.xml': 'application/xml',
    '.txt': 'text/plain', '.webmanifest': 'application/manifest+json'
  };
  http.createServer(async (req, res) => {
    let file = path.join(DIST, decodeURIComponent(req.url.split('?')[0]));
    if (req.url === '/' || file.endsWith(path.sep)) file = path.join(file, 'index.html');
    try {
      const body = await fs.readFile(file);
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      const notFound = await fs.readFile(path.join(DIST, '404.html')).catch(() => 'Not found');
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(notFound);
    }
  }).listen(3000, () => console.log('  serving http://localhost:3000'));
}
