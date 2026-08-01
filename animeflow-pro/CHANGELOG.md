# Changelog

All notable changes to AnimeFlow Pro. Format follows
[Keep a Changelog](https://keepachangelog.com/); versions follow
[semantic versioning](https://semver.org/).

## [1.0.0] — 2026-08-01

First release.

### Pages (20)

`index`, `browse`, `anime-details`, `watch`, `search`, `schedule`,
`watchlist`, `dashboard`, `login`, `register`, `forgot-password`, `pricing`,
`about`, `faq`, `contact`, `blog`, `blog-post`, `components`, `documentation`,
`404`.

### Added

- Bootstrap 5.3 foundation, customised through SCSS variables rather than
  overrides; unused Bootstrap modules are never compiled in.
- Native dark and light colour modes with a persisted switcher and an inline
  boot script that applies the saved theme before first paint.
- 40+ build-time components in `src/lib/components.js`, each showcased on
  `components.html` next to the function that renders it.
- 38 documented JavaScript behaviours across 13 ES modules, bundled by esbuild.
- Command-palette search (⌘K / Ctrl-K / `/`) with debounced autocomplete over
  the JSON catalogue and a full combobox keyboard model.
- Watchlist, resume points and recently-viewed, all in `localStorage` and
  synchronised across every card on the page.
- Faceted catalogue browser: genre, status, studio and score filters, four sort
  orders, infinite scroll, removable filter chips, state reflected in the URL.
- Swipeable rails built on native scroll-snap — no carousel library, correct in
  RTL, operable by keyboard.
- Markdown-powered blog: drop a `.md` file into `src/content/blog/` and it is
  rendered at build time.
- Generated SVG artwork: 52 posters, 52 backdrops and 12 avatars, derived from
  a hue per record, so the package ships no third-party imagery.
- SEO: per-page canonical, Open Graph and Twitter tags, JSON-LD for `WebSite`,
  `TVSeries`, `FAQPage`, `Product`, `BlogPosting` and breadcrumbs, plus a
  generated `sitemap.xml`, `robots.txt` and web manifest.
- RTL: a generated mirrored stylesheet and a live direction switch in the header.
- Accessibility: skip link, landmarks, ARIA on every custom widget, keyboard
  operation throughout, and `prefers-reduced-motion` support.
- Two test suites in headless Chromium — a 20-page smoke test and 23 interaction
  tests — runnable with `npm test`.

### Performance notes

- No web fonts: a system stack, so nothing blocks first render.
- Popper.js is not shipped; dropdowns, tabs, collapse and alerts are
  implemented in `src/js/modules/widgets.js`. Only Bootstrap's `Modal` and
  `Offcanvas` are bundled.
- Each page inlines only the icons it references, so the sprite costs 6–18 kB
  rather than a flat 45 kB.
- YouTube is a click-to-load facade: no third-party request until play is
  pressed.
- Images are lazy with intrinsic dimensions; long pages use `content-visibility`.
