# AnimeFlow Pro — licence

Version 1.0.0

**This is a draft written in plain language, not legal advice.** If you are
going to sell this template, have a lawyer review and adapt these terms before
you publish them. Marketplaces such as CodeCanyon, Gumroad or your own store
may also impose their own licence text that overrides this file.

---

## What this covers

The files in the `animeflow-pro/` directory: the HTML in `dist/`, the SCSS, the
JavaScript modules, the build script, the page copy and the generated SVG
artwork. All of it was written originally for this package.

It does **not** cover:

- Bootstrap and Bootstrap Icons, which are bundled under their own MIT licence
  (see [Third-party components](#third-party-components))
- the separate free *Anime* template by Colorlib / ThemeWagon that sits in the
  repository root, which has its own, different licence
- any anime title, studio name, artwork or trademark you add yourself

---

## Regular licence

You may:

- use the template to build **one end product** — one website, one web
  application, one client project
- modify it as much as you like, including changing the design beyond
  recognition
- charge your client for the work you do with it
- deploy it commercially, including on a site that sells subscriptions

An **end product** is a finished website or application in which the template
is a component, not the thing being sold. Your users may access the end
product; they may not obtain the template itself as a distributable file.

You may **not**:

- redistribute, resell, sublicense or give away the template files themselves,
  modified or not
- sell it as a template, theme, UI kit, starter or page builder
- include it in a product where the template is the primary value — for
  example a "500 templates" bundle, a theme marketplace listing, or a
  site-builder tool that hands the layouts to end users
- use it in more than one end product without buying another licence

---

## Extended licence

Same as above, with one difference: the end product may be sold to end users,
and the template may be used in a product where end users pay for access to
the design itself (a SaaS site builder, for example). Still one end product per
licence, and still no redistribution of the source files on their own.

---

## Ownership

You own what you build. The author retains copyright in the template itself. No
attribution is required in your end product, and you are free to remove any
"AnimeFlow" branding from the files you ship — the wordmark, the favicon and
the sample copy are all yours to replace.

---

## Demo content

Every title, rating, review, studio name and statistic shipped in
`src/data/anime.js` is **sample data**, written to make the interface look
populated. It is not licensed reference data and should not be treated as
accurate. The poster, backdrop and avatar artwork is generated procedurally by
`build.js` and contains no third-party imagery.

Replace all of it before launch. Nothing in this licence grants any right to
anime titles, character art, logos or trademarks — if you publish a real
catalogue, that is between you and the rights holders.

---

## Warranty

The template is provided "as is", without warranty of any kind, express or
implied, including but not limited to the warranties of merchantability,
fitness for a particular purpose and non-infringement. The author is not liable
for any claim, damages or other liability arising from the use of the template.

---

## Third-party components

| Project | Version | Licence | Where |
| --- | --- | --- | --- |
| [Bootstrap](https://getbootstrap.com/) | 5.3 | MIT | compiled into `animeflow.min.css`; `Modal` and `Offcanvas` bundled into `animeflow.min.js` |
| [Bootstrap Icons](https://icons.getbootstrap.com/) | 1.13 | MIT | inlined as an SVG sprite per page |

Both MIT licences permit commercial use, modification and redistribution, and
require their copyright notice to be preserved. Copies live in
`node_modules/bootstrap/LICENSE` and `node_modules/bootstrap-icons/LICENSE`
after `npm install`; include them in any package you distribute.

Build-time tooling — `sass`, `esbuild`, `marked`, `rtlcss` and `playwright` —
is never shipped to the browser and imposes no obligations on your end product.
