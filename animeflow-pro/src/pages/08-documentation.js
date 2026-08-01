import { btn, icon, breadcrumb, codeBlock, callout, esc, badge } from '../lib/components.js';

export const meta = {
  path: 'documentation.html',
  title: 'Documentation',
  description: 'How to install, build, theme, extend and deploy AnimeFlow Pro — including the full feature index and accessibility notes.',
  priority: '0.8'
};

const FEATURES = [
  ['1–3', 'Catalogue store', 'fetch + cache, recently viewed, resume points', 'modules/store.js'],
  ['4–5', 'Theme & direction', 'dark/light switch and LTR/RTL switch, both persisted', 'modules/theme.js'],
  ['6', 'Toasts', 'queue, variants, auto-dismiss, screen-reader announcements', 'modules/ui.js'],
  ['7', 'Cookie consent', 'accept/reject, remembered', 'modules/ui.js'],
  ['8', 'Back to top', 'appears past 600px, moves focus on activation', 'modules/ui.js'],
  ['9', 'Scroll progress', 'gradient bar tied to document height', 'modules/ui.js'],
  ['10', 'Sticky header', 'glass background once scrolled', 'modules/ui.js'],
  ['11', 'Bottom navigation', 'mobile bar with active state', 'modules/ui.js'],
  ['12', 'Lightbox', 'focus trap, Escape, focus restore', 'modules/ui.js'],
  ['13', 'Copy to clipboard', 'code blocks across the docs', 'modules/ui.js'],
  ['14', 'Newsletter pop-up', 'once per visitor, dwell or scroll trigger', 'modules/ui.js'],
  ['15', 'Custom cursor', 'pointer-fine only, disabled for reduced motion', 'modules/ui.js'],
  ['16–18', 'Search dialog', '⌘K / Ctrl-K / “/”, debounced, combobox keyboard model', 'modules/search.js'],
  ['19', 'Search results page', 'shareable ?q= URLs', 'modules/search.js'],
  ['20–21', 'Card renderer', 'runtime twin of the build-time component, plus skeletons', 'modules/card.js'],
  ['22–26', 'Watchlist', 'toggle, cross-page sync, counters, page, recently viewed', 'modules/watchlist.js'],
  ['27–31', 'Catalogue browser', 'facets, sort, infinite scroll, skeletons, filter chips in the URL', 'modules/catalog.js'],
  ['32', 'Rails', 'arrows, drag, swipe, keyboard paging, RTL-correct', 'modules/rails.js'],
  ['33–37', 'Motion', 'scroll reveal, parallax, counters, typewriter, image fade-in', 'modules/motion.js'],
  ['38–42', 'Forms', 'validation, password strength, reveal, async submit, newsletter', 'modules/forms.js'],
  ['43–44', 'Video', 'trailer modal and click-to-load facades, nothing loaded up front', 'modules/video.js'],
  ['45–52', 'Pages', 'details, episodes, player, countdown, dashboard, pricing, blog, share', 'modules/pages.js'],
  ['53–56', 'Widgets', 'dropdown, tabs, collapse and alerts — written here so Popper.js never ships', 'modules/widgets.js']
];

const section = (id, title, body) => `<section id="${id}" class="af-section" style="padding-block:1.5rem">
  <h2 class="h4 mb-3">${esc(title)}</h2>
  ${body}
</section>`;

export function render(ctx) {
  const nav = [
    ['Getting started', [['install', 'Installation'], ['structure', 'File structure'], ['commands', 'Build commands']]],
    ['Customising', [['theming', 'Colours & theming'], ['data', 'The data layer'], ['components', 'Components'], ['icons', 'Icons']]],
    ['Reference', [['features', 'Feature index'], ['a11y', 'Accessibility'], ['rtl', 'RTL support'], ['seo', 'SEO'], ['performance', 'Performance'], ['support', 'Browser support'], ['credits', 'Credits & licence']]]
  ];

  return `
<section class="container af-page-head">
  ${breadcrumb([{ label: 'Home', href: 'index.html' }, { label: 'Documentation' }])}
  <h1>Documentation</h1>
  <p>Everything you need to run, theme and extend AnimeFlow Pro. Version 1.0.0 — Bootstrap 5.3, zero runtime dependencies.</p>
</section>

<section class="container">
  <div class="af-docs">
    <nav class="af-docs-side" aria-label="Documentation">
      ${nav.map(([group, items]) => `<p class="af-docs-heading">${esc(group)}</p>
      <ul>${items.map(([id, label]) => `<li><a href="#${id}">${esc(label)}</a></li>`).join('')}</ul>`).join('\n      ')}
    </nav>

    <div class="af-prose" style="max-inline-size:none">

      ${section('install', 'Installation', `
        <p>The <code>dist/</code> folder is a finished static site. If you only want to edit HTML and CSS, you do not need Node at all — open <code>dist/index.html</code> or upload the folder to any host.</p>
        ${codeBlock(`# 1. Use it as-is
open dist/index.html

# 2. Or set up the build (Node 18+)
npm install
npm run serve     # localhost:3000 with rebuild on save
npm run build     # one-off production build`, 'bash')}
        ${callout('tip', 'No lock-in.', '<p class="mb-0">The build step only generates the static files. Nothing in <code>dist/</code> requires Node to run.</p>')}`)}

      ${section('structure', 'File structure', `
        ${codeBlock(`animeflow-pro/
├─ dist/                    ← the deliverable, ready to upload
│  ├─ *.html                20 pages
│  ├─ assets/css/           animeflow.css, .min.css, .rtl.min.css
│  ├─ assets/js/            animeflow.js, .min.js
│  ├─ assets/img/           generated posters, backdrops, avatars
│  ├─ assets/data/          anime.json, posts.json
│  ├─ sitemap.xml, robots.txt, site.webmanifest
├─ src/
│  ├─ data/                 anime.js, site.js  ← content lives here
│  ├─ scss/                 _variables, _theme, _base, _layout, _components, _pages
│  ├─ js/                   animeflow.js + modules/
│  ├─ lib/components.js     every UI block as a function
│  ├─ layouts/base.js       <head>, header, footer, dialogs
│  ├─ pages/                one file per page group
│  └─ content/blog/         markdown articles
└─ build.js                 the generator`, 'text')}`)}

      ${section('commands', 'Build commands', `
        <table class="table af-table" style="text-align:left">
          <thead><tr><th>Command</th><th>What it does</th></tr></thead>
          <tbody>
            <tr><th scope="row"><code>npm run build</code></th><td style="text-align:left">Compiles SCSS, bundles JS, generates artwork and writes all 20 pages plus the SEO files.</td></tr>
            <tr><th scope="row"><code>npm run serve</code></th><td style="text-align:left">The same build, then a static server on port 3000 that rebuilds when <code>src/</code> changes.</td></tr>
            <tr><th scope="row"><code>npm run watch</code></th><td style="text-align:left">Rebuild on change without the server.</td></tr>
            <tr><th scope="row"><code>npm run clean</code></th><td style="text-align:left">Deletes <code>dist/</code>.</td></tr>
          </tbody>
        </table>`)}

      ${section('theming', 'Colours & theming', `
        <p>Brand colours live in one place. Change them in <code>src/scss/_variables.scss</code> and every button, focus ring, badge and gradient follows, because Bootstrap is customised through its own variables rather than overridden afterwards.</p>
        ${codeBlock(`$af-violet: #7c5cff;   // primary
$af-cyan:   #22d3ee;   // accent
$af-pink:   #f472b6;   // gradient stop
$primary:   $af-violet;`, 'scss')}
        <p>Light and dark values are custom properties in <code>_theme.scss</code>, scoped to <code>[data-bs-theme]</code>:</p>
        ${codeBlock(`[data-bs-theme="dark"] {
  --af-bg: #07070e;
  --af-surface: #12121d;
  --af-text: #eceaf5;
}`, 'scss')}
        ${callout('warn', 'Keep the inline boot script.', '<p class="mb-0">The eight-line script in <code>&lt;head&gt;</code> applies the saved theme before first paint. Remove it and every page load flashes the wrong theme.</p>')}`)}

      ${section('data', 'The data layer', `
        <p>All content comes from <code>src/data/anime.js</code>, which the build writes out as <code>assets/data/anime.json</code>. The front-end only ever reads that JSON, so pointing the template at a live API is a one-line change in <code>src/js/modules/store.js</code>:</p>
        ${codeBlock(`const DATA_URL = 'https://api.example.com/v1/catalogue';`, 'js')}
        <p>Required fields per record: <code>slug</code>, <code>title</code>, <code>year</code>, <code>studio</code>, <code>genres[]</code>, <code>episodes</code>, <code>duration</code>, <code>rating</code>, <code>status</code>, <code>type</code>, <code>synopsis</code>. <code>slug</code> is the identity used by URLs, watchlists and resume points.</p>
        ${callout('info', 'Demo content.', '<p class="mb-0">The titles, ratings, reviews and studios shipped with the template are sample data for presentation. Replace them with your own catalogue before launch.</p>')}`)}

      ${section('components', 'Components', `
        <p>Each block is a function returning an HTML string in <code>src/lib/components.js</code>. The <a href="components.html">component library page</a> renders one of each with its function name.</p>
        ${codeBlock(`import { animeCard, rail } from '../lib/components.js';

rail({
  title: 'Trending this week',
  items: anime.filter((a) => a.tags.includes('trending')),
  link: 'browse.html'
});`, 'js')}
        <p>If you are editing the built HTML directly instead, copy the markup out of <code>dist/components.html</code> — it is the same output.</p>`)}

      ${section('icons', 'Icons', `
        <p>Icons are Bootstrap Icons, inlined as an SVG sprite at the top of every page. No icon font, no extra request, and they inherit <code>currentColor</code>.</p>
        ${codeBlock(`<svg class="af-icon" aria-hidden="true"><use href="#i-heart"></use></svg>`)}
        <p>To add one, put its name in the <code>ICONS</code> array in <code>build.js</code> and rebuild.</p>`)}

      ${section('features', 'Feature index', `
        <p>Thirty-eight behaviours, each numbered in the source comments so you can jump straight to the implementation.</p>
        <div class="table-responsive af-table-wrap">
          <table class="table af-table" style="text-align:left">
            <thead><tr><th>#</th><th>Feature</th><th>Notes</th><th>File</th></tr></thead>
            <tbody>
              ${FEATURES.map(([n, name, note, file]) => `<tr>
                <th scope="row" style="white-space:nowrap">${n}</th>
                <td style="text-align:left"><b>${esc(name)}</b></td>
                <td style="text-align:left" class="af-muted">${esc(note)}</td>
                <td style="text-align:left"><code>${esc(file)}</code></td>
              </tr>`).join('\n              ')}
            </tbody>
          </table>
        </div>`)}

      ${section('a11y', 'Accessibility', `
        <ul>
          <li>A skip link, and one <code>&lt;main&gt;</code>, <code>&lt;header&gt;</code>, <code>&lt;footer&gt;</code> and <code>&lt;nav&gt;</code> per page.</li>
          <li>Visible focus rings everywhere, never removed — only restyled.</li>
          <li>The search dialog implements the combobox pattern: <code>aria-expanded</code>, <code>aria-activedescendant</code>, arrow keys, Escape and focus restore.</li>
          <li>Rails are labelled scroll regions with <code>tabindex="0"</code>, reachable and operable by keyboard.</li>
          <li>Watchlist buttons are toggle buttons with <code>aria-pressed</code> and labels that name the title.</li>
          <li>Every image has an <code>alt</code> (empty for decoration) and intrinsic <code>width</code>/<code>height</code>.</li>
          <li><code>prefers-reduced-motion</code> disables reveal animations, smooth scrolling, the cursor, the blobs and the 404 glitch.</li>
          <li>Both themes were checked for WCAG AA contrast, including the muted text colour.</li>
        </ul>`)}

      ${section('rtl', 'RTL support', `
        <p>The build generates <code>animeflow.rtl.min.css</code> alongside the main stylesheet, and the header carries a live direction switch. Our own CSS uses logical properties (<code>margin-inline-start</code>, <code>inset-inline-end</code>) so most of it needs no mirroring at all.</p>
        ${codeBlock(`<html lang="ar" dir="rtl">
  <link rel="stylesheet" href="assets/css/animeflow.rtl.min.css">`)}`)}

      ${section('seo', 'SEO', `
        <ul>
          <li>Per-page <code>&lt;title&gt;</code>, description and canonical URL.</li>
          <li>Open Graph and Twitter card tags on every page.</li>
          <li>JSON-LD: <code>WebSite</code> with <code>SearchAction</code> on the home page, <code>TVSeries</code> on details, <code>FAQPage</code> on the FAQ, <code>Product</code> on pricing, <code>BlogPosting</code> on articles, plus breadcrumbs.</li>
          <li><code>sitemap.xml</code> and <code>robots.txt</code> generated at build time; private pages carry <code>noindex</code> and are excluded.</li>
          <li>Rails on the home page are static HTML, so crawlers see real content without executing JavaScript.</li>
        </ul>
        ${callout('warn', 'Set your domain.', '<p class="mb-0">Change <code>site.url</code> in <code>src/data/site.js</code> before building, or canonicals and the sitemap will point at the placeholder domain.</p>')}`)}

      ${section('performance', 'Performance', `
        <ul>
          <li>No web fonts — a system stack, so nothing blocks the first render.</li>
          <li>One stylesheet, one deferred script. Bootstrap modules the template does not use are never compiled in.</li>
          <li>Images are lazy with intrinsic dimensions, so nothing shifts as they arrive.</li>
          <li>YouTube is a facade: no third-party request happens until someone presses play.</li>
          <li>Long pages use <code>content-visibility</code> to skip painting what is off screen.</li>
          <li>Scroll handlers are throttled; animation uses transforms only.</li>
          <li>Each page inlines only the icons it uses, so the sprite costs 6–18 kB instead of a flat 45 kB.</li>
        </ul>
        <p>What version 1.0.0 actually weighs, measured on the built output:</p>
        <div class="table-responsive af-table-wrap">
          <table class="table af-table" style="text-align:left">
            <thead><tr><th>Asset</th><th>Minified</th><th>Gzipped</th></tr></thead>
            <tbody>
              <tr><th scope="row"><code>animeflow.min.css</code></th><td style="text-align:left">250 kB</td><td style="text-align:left">37 kB</td></tr>
              <tr><th scope="row"><code>animeflow.min.js</code></th><td style="text-align:left">67 kB</td><td style="text-align:left">21 kB</td></tr>
              <tr><th scope="row">A typical inner page</th><td style="text-align:left">45–66 kB</td><td style="text-align:left">11–16 kB</td></tr>
              <tr><th scope="row">The home page (60 cards)</th><td style="text-align:left">210 kB</td><td style="text-align:left">24 kB</td></tr>
            </tbody>
          </table>
        </div>
        <p>Roughly half the stylesheet is Bootstrap's utility API. Comment out the <code>utilities/api</code> import in <code>src/scss/main.scss</code> if you do not use those classes and it drops to about 118 kB (24 kB gzipped).</p>
        ${callout('tip', 'Before you deploy.', '<p class="mb-0">Serve over HTTP/2 with gzip or brotli, and set a long <code>Cache-Control</code> on <code>assets/</code>. Those two settings matter more than anything left in the code.</p>')}`)}

      ${section('support', 'Browser support', `
        <p>Every evergreen browser from the last two years: Chrome, Edge, Firefox, Safari 15.4+, and their mobile equivalents. Internet Explorer is not supported and never will be.</p>
        <p>The template uses <code>aspect-ratio</code>, <code>:focus-visible</code>, logical properties, <code>scroll-snap</code>, <code>IntersectionObserver</code> and CSS custom properties — all baseline since 2022.</p>`)}

      ${section('credits', 'Credits & licence', `
        <ul>
          <li><a href="https://getbootstrap.com/">Bootstrap 5.3</a> — MIT</li>
          <li><a href="https://icons.getbootstrap.com/">Bootstrap Icons</a> — MIT</li>
          <li>Poster, backdrop and avatar artwork — generated by <code>build.js</code>, original to this package</li>
          <li>All page copy, SCSS and JavaScript — original to this package</li>
        </ul>
        <p>See <code>LICENSE.md</code> in the package root for the terms covering your own projects.</p>
        <div class="d-flex flex-wrap gap-2 mt-4">
          ${btn({ label: 'Component library', href: 'components.html', variant: 'primary', icon: 'palette' })}
          ${btn({ label: 'Contact support', href: 'contact.html', variant: 'outline-light', icon: 'chat-dots' })}
        </div>`)}

    </div>
  </div>
</section>`;
}
