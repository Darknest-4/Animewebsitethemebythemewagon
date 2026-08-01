---
title: Designing a dark mode that does not hurt to look at
date: 2026-04-02
author: Aisha Rahman
category: Design
cover: frieren-beyond-journeys-end
excerpt: Pure black backgrounds, pure white text and saturated accents are the three fastest ways to make a dark theme unpleasant. Here is what we did instead.
---

Most dark modes are a light mode with the colours inverted. They pass a contrast checker and still feel wrong after twenty minutes. Three decisions fixed that for us.

## Never use pure black, never use pure white

The background here is `#07070e`, not `#000000`. The body text is `#eceaf5`, not `#ffffff`. The contrast ratio is still 15:1 — far past the AA threshold — but the edges stop vibrating.

Pure black has a second problem: on OLED screens, pixels physically switch off, and scrolling produces a visible smear as they turn back on. A few percent of lightness removes it entirely.

## Give elevation a colour, not a shadow

Shadows barely read on a dark surface. Instead, each level of elevation gets its own slightly lighter background:

```css
--af-bg:        #07070e;  /* page */
--af-surface:   #12121d;  /* card */
--af-surface-2: #19192 7; /* input, hover */
--af-surface-3: #21212f;  /* pressed, track */
```

Four steps is enough for an interface this size. More than that and the levels stop being distinguishable.

## Desaturate the accents

The brand violet in light mode is `#7c5cff`. Used unchanged on a near-black background it glows and leaves an afterimage. Dark backgrounds make saturated colours read as brighter than they measure.

The fix is not a different hue — it is lower saturation and a slightly higher lightness for large fills, with the original kept for small elements like icons and focus rings where the area is too small to glare.

## What Bootstrap 5.3 gives you for free

The colour-mode API is genuinely good. One attribute on the root element:

```html
<html data-bs-theme="dark">
```

Every component variable resolves against it, so `.btn`, `.form-control` and `.accordion` follow without a single override. All we add is our own custom properties inside the same selector.

The one thing you must add yourself is the inline script in `<head>` that reads the saved preference **before first paint**. Without it, every visitor on a dark theme gets a white flash on every navigation. It is eight lines and it is not optional.

## Test both, always

The habit that caught the most bugs: never look at a component in one theme only. Half of our contrast failures were in light mode, written by people working in dark mode, and would have shipped otherwise.
