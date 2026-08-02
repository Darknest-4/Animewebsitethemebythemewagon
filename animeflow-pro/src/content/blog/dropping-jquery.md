---
title: What we learned removing jQuery from a streaming front-end
date: 2026-05-18
author: Mateo Alvarez
category: Engineering
cover: steins-gate
excerpt: Four jQuery plugins were doing the work of about 180 lines of modern JavaScript. Here is what replaced them, and what broke on the way.
---

The template this project replaced shipped 340 kB of JavaScript before a single frame of video played. jQuery itself was the smallest part of that — the real weight sat in four plugins doing work the platform has handled natively for years.

## What was actually in there

The old bundle broke down roughly like this:

- **jQuery 3.5** — 88 kB, used mostly for `$(...)`, `.on()` and `.addClass()`
- **Owl Carousel** — 45 kB, for two horizontal rails
- **Nice Select** — 12 kB, to restyle three `<select>` elements
- **SlickNav** — 22 kB, to turn the desktop menu into a mobile drawer
- **Magnific Popup** — 25 kB, for one image lightbox

None of these were badly written. They were solving 2014 problems that have since moved into browsers.

## The replacements

### Carousels became scroll containers

The rails on every page are now a CSS grid with `grid-auto-flow: column` and `scroll-snap-type: x mandatory`. That is the entire carousel. Momentum scrolling, touch, trackpad gestures and RTL all come from the browser, correctly, for free.

The only JavaScript left is the pair of arrow buttons and a `scroll` listener that hides them at each end — about forty lines, and the rail still works with the script blocked.

> The general shape of this migration: delete the plugin, discover the platform already does 90% of it, then write the missing 10% yourself.

### Select boxes stayed select boxes

Nice Select existed because native `<select>` was hard to style. Since then `accent-color`, `appearance` and generous control over the closed state have made a plain select perfectly presentable. On mobile, the native picker beats any custom dropdown anyway.

### The mobile drawer became an offcanvas

Bootstrap 5.3 ships one, with focus management and inert background handling already correct. Deleting SlickNav also deleted three accessibility bugs we had not noticed.

### The lightbox became fifty lines

Open, trap focus, close on Escape, restore focus to the element that opened it. That is the whole feature. Getting focus restoration right matters more than any animation.

## What broke

Two things, both worth knowing about:

1. **Drag-scrolling fires a click.** When you drag a rail with the mouse and release over a card, the browser dispatches a click and you navigate somewhere you did not intend. The fix is a capture-phase click listener that swallows the event when the pointer moved more than a few pixels.
2. **`scrollLeft` is negative in RTL.** Every arrow-button calculation needs `Math.abs()` or the arrows disappear the moment you switch direction. This is standards-compliant behaviour and it will surprise you exactly once.

## The numbers

| | Before | After |
| --- | --- | --- |
| JavaScript, minified | 340 kB | 67 kB |
| JavaScript, gzipped | 106 kB | 21 kB |
| Runtime libraries | 5 | 0 |
| Requests before first paint | 11 | 3 |

Two honest caveats. First, some of that gain came from dropping web fonts and lazy-loading images, not from the jQuery removal alone. Second, "zero runtime libraries" means nothing is fetched separately — two Bootstrap components, Modal and Offcanvas, are still bundled into that 67 kB, because their backdrop and focus-trap handling is genuinely worth the space. Everything else, including the menus that used to need Popper.js, is ours.

The dependency count is the number that decides how this project feels in two years.
