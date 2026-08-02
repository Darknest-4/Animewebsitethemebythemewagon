# AnimeFlow Pro

A premium **Bootstrap 5.3** streaming / anime UI kit. Twenty pages, forty-plus
components, thirty-eight documented JavaScript behaviours, dark and light
themes, RTL support — and no jQuery anywhere in the chain.

Written from scratch for this repository. It is **not** a modification of the
free ThemeWagon template that lives in the repository root; see
[Licensing](#licensing) for why that distinction matters.

---

## Quick start

```bash
# Just want the site? It is already built.
open dist/index.html

# Want to change the SCSS or the JS? (Node 18+)
npm install
npm run serve      # http://localhost:3000, rebuilds on save
npm run build      # one-off production build
npm test           # 20-page smoke test + 23 interaction tests, in Chromium
```

`dist/` is the deliverable. It is a finished static site with no runtime
dependency on Node, a bundler, or a CDN — drop the folder on any host.

---

## What is in the box

### 20 pages

| Catalogue | Account | Marketing | Reference |
| --- | --- | --- | --- |
| `index.html` | `dashboard.html` | `pricing.html` | `components.html` |
| `browse.html` | `watchlist.html` | `about.html` | `documentation.html` |
| `anime-details.html` | `login.html` | `faq.html` | `404.html` |
| `watch.html` | `register.html` | `contact.html` | |
| `search.html` | `forgot-password.html` | `blog.html` | |
| `schedule.html` | | `blog-post.html` | |

### 40+ components

Every visual block is a function in `src/lib/components.js` that returns an
HTML string — cards, rails, ratings, pricing tables, episode lists, toasts,
filters, timelines, galleries, forms. `components.html` renders one of each
next to the function that produced it.

### 38 JavaScript behaviours

Numbered in the source comments, indexed in `documentation.html`:

| Module | Features |
| --- | --- |
| `store.js` | catalogue fetch + cache, recently viewed, resume points |
| `theme.js` | dark/light switch, LTR/RTL switch, both persisted |
| `ui.js` | toasts, cookie banner, back-to-top, scroll progress, sticky header, bottom nav, lightbox, copy buttons, newsletter pop-up, custom cursor |
| `search.js` | ⌘K / Ctrl-K / `/` command palette, debounced autocomplete, combobox keyboard model, results page |
| `card.js` | runtime card renderer + skeletons |
| `watchlist.js` | localStorage watchlist, cross-page sync, counters, watchlist page |
| `catalog.js` | faceted filters, sorting, infinite scroll, filter chips in the URL |
| `rails.js` | arrows, drag, swipe, keyboard paging, RTL-correct scrolling |
| `motion.js` | scroll reveal, parallax, counters, typewriter, image fade-in |
| `forms.js` | validation, password strength, reveal toggle, async submit |
| `video.js` | trailer modal and click-to-load facades |
| `pages.js` | details hydration, episode lists, player, countdown, dashboard, pricing toggle, blog, share |
| `widgets.js` | dropdown, tabs, collapse, alerts — so Popper.js never ships |

---

## Weight

Measured on the built output:

| Asset | Minified | Gzipped |
| --- | --- | --- |
| `animeflow.min.css` | 250 kB | 37 kB |
| `animeflow.min.js` | 67 kB | 21 kB |
| Typical inner page | 45–66 kB | 11–16 kB |
| Home page (60 cards) | 210 kB | 24 kB |

Roughly half the stylesheet is Bootstrap's utility API, kept on purpose.
Comment out the `utilities/api` import in `src/scss/main.scss` and it drops to
about 118 kB (24 kB gzipped).

Only two Bootstrap JS components are bundled — `Modal` and `Offcanvas` — because
their backdrop, scrollbar and focus-trap handling is worth the kilobytes.
Dropdowns, tabs, collapse and alerts are implemented in `widgets.js`, which is
what keeps Popper.js (20 kB on its own) out of the bundle.

---

## Structure

```
animeflow-pro/
├─ dist/                    ← the deliverable, ready to upload
│  ├─ *.html                20 pages
│  ├─ assets/css/           animeflow.css, .min.css, .rtl.min.css
│  ├─ assets/js/            animeflow.js, .min.js
│  ├─ assets/img/           generated posters, backdrops, avatars
│  ├─ assets/data/          anime.json, posts.json
│  └─ sitemap.xml, robots.txt, site.webmanifest
├─ src/
│  ├─ data/                 anime.js, site.js   ← all content lives here
│  ├─ scss/                 _variables, _theme, _base, _layout, _components, _pages
│  ├─ js/                   animeflow.js + modules/
│  ├─ lib/components.js     every UI block as a function
│  ├─ layouts/base.js       <head>, header, footer, global dialogs
│  ├─ pages/                one file per page group
│  └─ content/blog/         markdown articles
├─ tools/                   verify.js, interactions.js, shoot.js
└─ build.js                 the generator
```

---

## Connecting a real API

Every rail, filter, search box and detail page reads one file:
`assets/data/anime.json`. Point `DATA_URL` in `src/js/modules/store.js` at your
own endpoint, keep the field names, and the whole interface keeps working.

```js
const DATA_URL = 'https://api.example.com/v1/catalogue';
```

Required fields per record: `slug`, `title`, `year`, `studio`, `genres[]`,
`episodes`, `duration`, `rating`, `status`, `type`, `synopsis`. `slug` is the
identity — it drives URLs and the localStorage keys for watchlists and resume
points. There is a worked example in `dist/blog-post.html?slug=hooking-up-your-api`.

---

## Accessibility

- Skip link, landmarks, exactly one `<h1>` per page
- Visible focus rings everywhere — restyled, never removed
- The search dialog implements the combobox pattern (`aria-expanded`,
  `aria-activedescendant`, arrow keys, Escape, focus restore)
- Rails are labelled scroll regions, reachable and operable by keyboard
- Watchlist buttons are toggle buttons with `aria-pressed` and titled labels
- Every image has an `alt` and intrinsic `width`/`height`
- `prefers-reduced-motion` disables reveals, smooth scrolling, the cursor, the
  background blobs and the 404 glitch
- Both themes were checked for WCAG AA contrast, muted text included

---

## Testing

```bash
npm test
```

Runs two suites in headless Chromium:

- **`tools/verify.js`** — loads all 20 pages and fails on console errors, failed
  requests, broken images, unresolved icon references, missing canonical/OG
  tags, missing landmarks, and data-driven regions that never hydrated.
- **`tools/interactions.js`** — drives 23 real user flows: theme persistence,
  search (open, type, arrow keys, Escape), watchlist round-trip, mega menu,
  filters, sorting, infinite scroll, detail hydration, tabs, lightbox, episode
  switching, accordion, pricing toggle, form validation, password strength,
  RTL switch, dashboard, and the click-to-load trailer.

`node tools/shoot.js <page> <width>x<height>` writes a screenshot in both
colour modes, which is handy when reviewing a design change.

---

## Browser support

Every evergreen browser from the last two years: Chrome, Edge, Firefox,
Safari 15.4+ and their mobile equivalents. Internet Explorer is not supported.

The template relies on `aspect-ratio`, `:focus-visible`, logical properties,
`scroll-snap`, `IntersectionObserver` and CSS custom properties — all baseline
since 2022.

---

## Demo content

Every title, rating, review, studio and statistic in this package is **sample
data**, written to make the interface look alive. The artwork is generated by
`build.js` from a hue value per title — no real key art, posters or screenshots
are included, and none should be added without clearing the rights first.

Replace `src/data/anime.js` with your own catalogue before launching anything.

---

## Licensing

**This package** (`animeflow-pro/`) is original work: all HTML, SCSS,
JavaScript, copy and generated artwork were written for this repository. See
[`LICENSE.md`](LICENSE.md) for the terms.

**The repository root** contains a separate, unmodified copy of the free
*Anime* template by Colorlib / ThemeWagon. That template has its own licence
which forbids removing its copyright notice without purchasing one, and does
not permit reselling it as your own product. Nothing from it is used here —
AnimeFlow Pro shares no markup, stylesheet, script or asset with it.

Third-party code bundled into this package:

| Project | Licence |
| --- | --- |
| [Bootstrap 5.3](https://getbootstrap.com/) | MIT |
| [Bootstrap Icons](https://icons.getbootstrap.com/) | MIT |

Build-time only, never shipped: `sass`, `esbuild`, `marked`, `rtlcss`, `playwright`.

> If you intend to sell this commercially, have a lawyer read `LICENSE.md`
> first. It is written to be clear, not to be legal advice.
