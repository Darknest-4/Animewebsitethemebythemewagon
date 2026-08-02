/**
 * Page shell: <head>, header, footer and the global widgets that live on every
 * page (search dialog, cookie banner, toast host, back-to-top, bottom nav).
 *
 * A page module returns `{ meta, body }`; this file wraps it into a finished
 * HTML document.
 */

import { icon, btn, esc, avatarImg } from '../lib/components.js';

/* ------------------------------------------------------------------- head */

function head(meta, ctx) {
  const { site } = ctx;
  const title = meta.path === 'index.html' ? `${site.name} — ${site.tagline}` : `${meta.title} · ${site.name}`;
  const desc = meta.description || site.description;
  const url = `${site.url}/${meta.path}`;
  const image = `${site.url}/assets/img/og/${meta.og || 'default'}.png`;

  const jsonLd = [
    ...(meta.path === 'index.html'
      ? [{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: site.name,
          url: site.url,
          description: site.description,
          potentialAction: {
            '@type': 'SearchAction',
            target: { '@type': 'EntryPoint', urlTemplate: `${site.url}/search.html?q={search_term_string}` },
            'query-input': 'required name=search_term_string'
          }
        }]
      : []),
    ...(meta.breadcrumbLd
      ? [{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: meta.breadcrumbLd.map((b, i) => ({
            '@type': 'ListItem', position: i + 1, name: b.label, item: `${site.url}/${b.href || meta.path}`
          }))
        }]
      : []),
    ...(meta.jsonLd || [])
  ];

  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="author" content="${esc(site.author)}">
<link rel="canonical" href="${esc(url)}">
${meta.noindex ? '<meta name="robots" content="noindex, follow">\n' : ''}<meta name="theme-color" content="#0b0b14" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="color-scheme" content="dark light">

<!-- Open Graph -->
<meta property="og:type" content="${meta.ogType || 'website'}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="${site.locale}">
<meta property="og:title" content="${esc(meta.ogTitle || title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(meta.ogTitle || title)}">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="${site.twitter}">
<meta name="twitter:creator" content="${site.twitter}">
<meta name="twitter:title" content="${esc(meta.ogTitle || title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(image)}">

<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/img/favicon.svg">
<link rel="manifest" href="site.webmanifest">
${(meta.preconnect || []).map((h) => `<link rel="preconnect" href="${h}" crossorigin>`).join('\n')}
<link rel="preload" href="assets/css/animeflow.min.css" as="style">
<link rel="stylesheet" href="assets/css/animeflow.min.css" id="af-stylesheet">
<link rel="preload" href="assets/js/animeflow.min.js" as="script">

<script>
  /* Applies the saved colour mode and text direction before first paint,
     so the page never flashes the wrong theme. Keep this inline. */
  (function () {
    try {
      var t = (localStorage.getItem('af-theme') || '').replace(/"/g, '');
      var d = document.documentElement;
      d.setAttribute('data-bs-theme',
        t || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
      if ((localStorage.getItem('af-dir') || '').replace(/"/g, '') === 'rtl') { d.dir = 'rtl'; }
    } catch (e) {}
  })();
</script>
${jsonLd.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}`;
}

/* ----------------------------------------------------------------- header */

function navItem(item, active) {
  if (!item.children) {
    return `<li class="nav-item"><a class="nav-link${active === item.href ? ' active' : ''}" href="${item.href}"${active === item.href ? ' aria-current="page"' : ''}>${esc(item.label)}</a></li>`;
  }
  const id = `nav-${item.label.toLowerCase()}`;
  const isActive = item.children.some((c) => c.href === active);
  return `<li class="nav-item dropdown af-mega">
    <button class="nav-link${isActive ? ' active' : ''}" id="${id}" data-af-dropdown aria-expanded="false" aria-haspopup="true">${esc(item.label)} ${icon('chevron-down', 'af-caret')}</button>
    <div class="dropdown-menu af-mega-menu" aria-labelledby="${id}">
      <ul>
        ${item.children.map((c) => `<li><a class="af-mega-link${c.href === active ? ' is-active' : ''}" href="${c.href}">
          <span class="af-mega-icon">${icon(c.icon)}</span>
          <span><b>${esc(c.label)}</b><span class="af-muted">${esc(c.desc)}</span></span>
        </a></li>`).join('\n        ')}
      </ul>
    </div>
  </li>`;
}

function header(meta, ctx) {
  const { site, nav } = ctx;
  const active = meta.active || meta.path;
  return `<header class="af-header" data-header>
  <div class="container af-header-inner">
    <a class="af-brand" href="index.html">
      <img src="assets/img/logo.svg" alt="" width="40" height="40">
      <span>${esc(site.name.split(' ')[0])} <b>${esc(site.name.split(' ')[1] || '')}</b></span>
    </a>

    <nav class="af-nav d-none d-lg-block" aria-label="Main">
      <ul class="navbar-nav">
        ${nav.map((i) => navItem(i, active)).join('\n        ')}
      </ul>
    </nav>

    <div class="af-header-actions">
      <button type="button" class="af-icon-btn af-search-open" data-search-open aria-label="Search the catalogue" aria-keyshortcuts="/">
        ${icon('search')}<span class="af-kbd d-none d-xl-inline">/</span>
      </button>
      <button type="button" class="af-icon-btn" data-theme-toggle aria-label="Switch colour theme" aria-pressed="false">
        ${icon('sun', 'af-theme-light')}${icon('moon-stars', 'af-theme-dark')}
      </button>
      <button type="button" class="af-icon-btn d-none d-md-inline-flex" data-dir-toggle aria-label="Switch text direction" title="Toggle LTR / RTL">
        ${icon('translate')}
      </button>
      <a class="af-icon-btn af-watchlist-link d-none d-sm-inline-flex" href="watchlist.html" aria-label="My watchlist">
        ${icon('heart')}<span class="af-count" data-watchlist-count hidden>0</span>
      </a>
      ${btn({ label: 'Sign in', href: 'login.html', variant: 'ghost', cls: 'd-none d-xxl-inline-flex' })}
      ${btn({ label: 'Start free', href: 'register.html', variant: 'primary', size: 'sm', cls: 'd-none d-lg-inline-flex' })}
      <button class="af-icon-btn d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#af-mobile-nav" aria-controls="af-mobile-nav" aria-label="Open menu">${icon('list')}</button>
    </div>
  </div>
</header>

<div class="offcanvas offcanvas-end af-offcanvas" tabindex="-1" id="af-mobile-nav" aria-labelledby="af-mobile-nav-title">
  <div class="offcanvas-header">
    <h2 class="offcanvas-title h6" id="af-mobile-nav-title">Menu</h2>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <nav aria-label="Mobile">
      <ul class="af-mobile-nav">
        ${nav.map((i) => (i.children
          ? `<li><span class="af-mobile-heading">${esc(i.label)}</span><ul>${i.children.map((c) => `<li><a href="${c.href}">${icon(c.icon)}${esc(c.label)}</a></li>`).join('')}</ul></li>`
          : `<li><a class="af-mobile-top" href="${i.href}">${esc(i.label)}</a></li>`)).join('\n        ')}
      </ul>
    </nav>
    <div class="af-offcanvas-foot">
      ${btn({ label: 'Sign in', href: 'login.html', variant: 'outline-light', cls: 'w-100' })}
      ${btn({ label: 'Start free trial', href: 'register.html', variant: 'primary', cls: 'w-100' })}
    </div>
  </div>
</div>`;
}

/* ----------------------------------------------------------------- footer */

function footer(ctx) {
  const { site, footerNav, legalNav, socials } = ctx;
  return `<footer class="af-footer">
  <div class="container">
    <div class="af-footer-top">
      <div class="af-footer-brand">
        <a class="af-brand" href="index.html">
          <img src="assets/img/logo.svg" alt="" width="40" height="40">
          <span>${esc(site.name.split(' ')[0])} <b>${esc(site.name.split(' ')[1] || '')}</b></span>
        </a>
        <p class="af-muted">${esc(site.description)}</p>
        <form class="af-newsletter" data-newsletter novalidate>
          <label class="form-label" for="af-newsletter-email">Get the weekly simulcast digest</label>
          <div class="af-newsletter-row">
            <input class="form-control" type="email" id="af-newsletter-email" name="email" placeholder="you@example.com" autocomplete="email" required>
            ${btn({ label: 'Subscribe', variant: 'primary', type: 'submit' })}
          </div>
          <p class="form-text">No spam. Unsubscribe in one click.</p>
          <p class="invalid-feedback" data-error></p>
        </form>
      </div>
      ${footerNav.map((col) => `<nav class="af-footer-col" aria-label="${esc(col.title)}">
        <h2 class="af-footer-title">${esc(col.title)}</h2>
        <ul>${col.links.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}</ul>
      </nav>`).join('\n      ')}
    </div>
    <div class="af-footer-bottom">
      <p class="af-muted">© ${new Date().getFullYear()} ${esc(site.name)}. Demo content — every title, rating and review in this template is sample data.</p>
      <ul class="af-legal">${legalNav.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}</ul>
      <ul class="af-socials">
        ${socials.map((s) => `<li><a href="${s.href}" aria-label="${esc(s.label)}">${icon(s.icon)}</a></li>`).join('')}
      </ul>
    </div>
  </div>
</footer>`;
}

/* ------------------------------------------------------------ global bits */

function globals(ctx) {
  return `
<!-- Search dialog: live results come from assets/data/anime.json -->
<div class="af-search-dialog" data-search-dialog hidden>
  <div class="af-search-backdrop" data-search-close></div>
  <div class="af-search-panel" role="dialog" aria-modal="true" aria-labelledby="af-search-label">
    <h2 class="visually-hidden" id="af-search-label">Search the catalogue</h2>
    <div class="af-search-bar">
      ${icon('search')}
      <input type="search" class="af-search-input" data-search-input placeholder="Search 50+ titles — try “Frieren”, “MAPPA”, “Sci-Fi”…" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="af-search-results" aria-autocomplete="list">
      <button type="button" class="af-icon-btn" data-search-close aria-label="Close search">${icon('x-lg')}</button>
    </div>
    <div class="af-search-body">
      <p class="af-search-hint" data-search-hint>Popular right now</p>
      <ul class="af-search-results" id="af-search-results" role="listbox" data-search-results aria-label="Search results"></ul>
      <p class="af-search-foot"><kbd>↑</kbd><kbd>↓</kbd> to navigate · <kbd>Enter</kbd> to open · <kbd>Esc</kbd> to close</p>
    </div>
  </div>
</div>

<!-- Trailer modal, filled on demand by js/modules/video.js -->
<div class="modal fade af-modal" id="af-trailer" tabindex="-1" aria-labelledby="af-trailer-title" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title h6" id="af-trailer-title">Trailer</h2>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body"><div class="ratio ratio-16x9" data-trailer-host></div></div>
    </div>
  </div>
</div>

<!-- Newsletter pop-up, shown once per visitor -->
<div class="modal fade af-modal" id="af-newsletter-modal" tabindex="-1" aria-labelledby="af-newsletter-title" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content af-newsletter-modal">
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      <span class="af-newsletter-icon">${icon('stars')}</span>
      <h2 class="h4" id="af-newsletter-title">Never miss a premiere</h2>
      <p class="af-muted">One email a week with the new episodes, nothing else.</p>
      <form class="af-newsletter" data-newsletter novalidate>
        <div class="af-newsletter-row">
          <label class="visually-hidden" for="af-modal-email">Email address</label>
          <input class="form-control" type="email" id="af-modal-email" placeholder="you@example.com" autocomplete="email" required>
          ${btn({ label: 'Join', variant: 'primary', type: 'submit' })}
        </div>
        <p class="invalid-feedback" data-error></p>
      </form>
    </div>
  </div>
</div>

<!-- Image lightbox -->
<div class="af-lightbox" data-lightbox-host hidden>
  <button type="button" class="af-lightbox-close" data-lightbox-close aria-label="Close image">${icon('x-lg')}</button>
  <figure><img alt="" data-lightbox-img><figcaption data-lightbox-caption></figcaption></figure>
</div>

<!-- Cookie consent -->
<aside class="af-cookies" data-cookie-banner role="region" aria-label="Cookie notice" hidden>
  <p>We use cookies to remember your theme, language and watchlist. Analytics stay off until you say yes.</p>
  <div class="af-cookies-actions">
    <button type="button" class="btn btn-ghost btn-sm" data-cookie="reject">Reject</button>
    <button type="button" class="btn btn-primary btn-sm" data-cookie="accept">Accept all</button>
  </div>
</aside>

<!-- Toast host -->
<div class="af-toasts" data-toast-host aria-live="polite" aria-atomic="true"></div>

<button type="button" class="af-to-top" data-to-top aria-label="Back to top" hidden>${icon('arrow-up')}</button>

<!-- Mobile bottom navigation -->
<nav class="af-bottom-nav d-lg-none" aria-label="Quick">
  <a href="index.html" data-bottom="index.html">${icon('house')}<span>Home</span></a>
  <a href="browse.html" data-bottom="browse.html">${icon('grid')}<span>Browse</span></a>
  <button type="button" data-search-open>${icon('search')}<span>Search</span></button>
  <a href="watchlist.html" data-bottom="watchlist.html">${icon('heart')}<span>List</span><span class="af-count" data-watchlist-count hidden>0</span></a>
  <a href="dashboard.html" data-bottom="dashboard.html">${icon('person-circle')}<span>Me</span></a>
</nav>`;
}

/* ------------------------------------------------------------------ shell */

/**
 * Collects the icons referenced anywhere in the finished document, plus the
 * ones only ever injected at runtime by the JS (cards, toasts, empty states).
 */
function spriteFor(html, symbols, runtimeIcons = []) {
  const used = new Set([
    ...[...html.matchAll(/href="#i-([a-z0-9-]+)"/g)].map((m) => m[1]),
    ...runtimeIcons
  ]);
  const found = [...used].sort().map((name) => symbols[name]).filter(Boolean);
  return `<svg xmlns="http://www.w3.org/2000/svg" class="d-none" aria-hidden="true" focusable="false">${found.join('')}</svg>`;
}

export function renderPage({ meta, body, ctx }) {
  const html = `<!doctype html>
<html lang="en" data-bs-theme="dark">
<head>
${head(meta, ctx)}
</head>
<body class="af-body ${meta.bodyClass || ''}" data-page="${meta.path}">
<a class="af-skip" href="#main">Skip to content</a>
<div class="af-progress-bar" data-scroll-progress aria-hidden="true"></div>
<div class="af-cursor" data-cursor aria-hidden="true"><span class="af-cursor-dot"></span><span class="af-cursor-ring"></span></div>
<!--AF_SPRITE-->
${header(meta, ctx)}
<main id="main" class="af-main">
${body}
</main>
${footer(ctx)}
${globals(ctx)}
<script src="assets/js/animeflow.min.js" defer></script>
</body>
</html>
`;
  return html.replace('<!--AF_SPRITE-->', spriteFor(html, ctx.sprite, ctx.runtimeIcons));
}
