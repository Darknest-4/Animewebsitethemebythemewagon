---
title: An accessible carousel is mostly just a scroll container
date: 2026-02-11
author: Jonas Lindqvist
category: Accessibility
cover: hunter-x-hunter
excerpt: Carousels have a bad reputation because carousel libraries have a bad reputation. Built on native scrolling, they are one of the easier widgets to get right.
---

Every accessibility audit I have run in the last five years flagged the carousel. Not because horizontal lists are inherently hostile, but because the libraries implementing them do three things that break assistive technology.

## The three sins

**Cloning slides.** Infinite loops are usually built by duplicating the first and last items. A screen reader now announces the same title twice, and the user has no way to know which copy they are on.

**Removing items from the accessibility tree.** Off-screen slides get `display: none` or `aria-hidden`, so a keyboard user tabbing through the page skips content that is visually one swipe away.

**Hijacking focus.** Autoplay that moves the viewport while someone is reading is disorienting for everyone and disabling for people with vestibular conditions.

## What we do instead

The rail is a grid that scrolls:

```css
.af-rail-track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 13.6rem;
  gap: 1.25rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
```

Every card is in the DOM, in reading order, always. Nothing is cloned, nothing is hidden, and the container scrolls with the platform's own physics.

## The parts you still have to write

### Make the track focusable

```html
<div class="af-rail-track" tabindex="0" role="region" aria-label="Trending this week">
```

`tabindex="0"` puts the scroll container in the tab order, so keyboard users can reach it and use the arrow keys. `role="region"` with a label makes it a landmark a screen reader can jump to. Both are one attribute each and they are what make the widget navigable.

### Label the arrow buttons properly

"Next" tells a screen-reader user nothing when there are six rails on the page. `aria-label="Scroll Trending this week right"` tells them exactly what moves.

### Hide arrows at the ends, do not disable them

A `hidden` button leaves the tab order cleanly. A disabled button stays focusable in some combinations and announces as a dead control.

### Respect reduced motion

Every `scrollBy` in the module checks the media query and falls back to `behavior: 'auto'`. Smooth scrolling is exactly the kind of movement that triggers motion sensitivity.

## The test that matters

Unplug the mouse. Reload the page. Reach every card, open one, come back, and check where focus landed. If that works, the widget is fine — no library required.
