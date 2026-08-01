# Anime website — two separate things in one repository

This repository holds two independent codebases. They share a subject and
nothing else — no markup, no stylesheet, no script, no asset.

```
.
├─ index.html, css/, js/, img/, …   ← 1. the original free ThemeWagon template
└─ animeflow-pro/                   ← 2. AnimeFlow Pro, written from scratch
```

---

## 1. The original template (repository root)

The free **Anime** template by [Colorlib](https://colorlib.com/) /
[ThemeWagon](https://themewagon.com/themes/free-bootstrap-4-html5-gaming-anime-website-template-anime/),
imported exactly as downloaded: Bootstrap 4, jQuery, eight HTML pages, and the
vendor archives in `Source/`.

It is kept here unmodified, including its copyright notice. Its licence
(`readme.txt`) forbids removing that notice without buying a licence, and does
not allow reselling the template as your own product — so it has been left
alone rather than refurbished.

## 2. AnimeFlow Pro (`animeflow-pro/`)

An original premium UI kit built to replace it, rather than patch it:

- **Bootstrap 5.3**, customised through SCSS variables — no Bootstrap 4, no jQuery
- **20 pages** — home, catalogue, details, player, search, schedule, watchlist,
  dashboard, three auth screens, pricing, about, FAQ, contact, blog, article,
  component library, documentation, 404
- **40+ components**, each a function that returns HTML, all showcased on one page
- **38 JavaScript behaviours** in 13 ES modules: command-palette search with live
  autocomplete, localStorage watchlist, faceted filters with infinite scroll,
  swipeable rails, scroll reveal, toasts, lightbox, cookie banner, form
  validation, click-to-load video, and more
- **Dark and light themes** with no flash on load, plus **RTL** support
- **SEO**: Open Graph, Twitter cards, JSON-LD, generated sitemap and robots.txt
- **Accessibility**: skip link, landmarks, ARIA on custom widgets, full keyboard
  operation, reduced-motion support
- **Tested**: a 20-page smoke test and 23 interaction tests in headless Chromium

```bash
cd animeflow-pro
open dist/index.html     # it is already built

npm install && npm run serve   # or work on the source
npm test                       # run both suites
```

Full details in [`animeflow-pro/README.md`](animeflow-pro/README.md);
the built documentation page is `animeflow-pro/dist/documentation.html`.

---

### A note on selling either of these

The root template cannot be resold — that is its licence, not an opinion.
AnimeFlow Pro is original work and carries its own draft terms in
[`animeflow-pro/LICENSE.md`](animeflow-pro/LICENSE.md); read it, adapt it, and
have a lawyer check it before putting the package on a marketplace.

All catalogue content in AnimeFlow Pro — titles, ratings, reviews, studios — is
sample data, and all artwork is generated procedurally at build time. No real
posters, key art or trademarks are included, and none should be added without
clearing the rights.
