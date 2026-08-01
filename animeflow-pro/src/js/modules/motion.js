/**
 * 33 — scroll reveal (an AOS-shaped API without the 15 kB dependency)
 * 34 — parallax layers
 * 35 — counting statistics
 * 36 — typewriter effect
 * 37 — native lazy-loading with a fade-in once decoded
 *
 * All four honour prefers-reduced-motion: the end state is applied instantly
 * instead of being animated.
 */

import { $$, throttle, prefersReducedMotion } from '../utils.js';

/* 33 — reveal ---------------------------------------------------------- */

function initReveal() {
  const items = $$('[data-reveal]');
  if (!items.length) return;
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-revealed'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.revealDelay || 0);
      setTimeout(() => entry.target.classList.add('is-revealed'), delay);
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  items.forEach((el) => io.observe(el));
}

/* 34 — parallax -------------------------------------------------------- */

function initParallax() {
  const layers = $$('[data-parallax]');
  if (!layers.length || prefersReducedMotion()) return;
  const update = () => {
    const y = window.scrollY;
    layers.forEach((el) => {
      const speed = Number(el.dataset.parallax) || 0.2;
      el.style.transform = `translate3d(0, ${(y * speed).toFixed(1)}px, 0)`;
    });
  };
  window.addEventListener('scroll', throttle(update, 16), { passive: true });
  update();
}

/* 35 — counters -------------------------------------------------------- */

function countTo(el) {
  const target = Number(el.dataset.count) || 0;
  const suffix = el.dataset.suffix || '';
  if (prefersReducedMotion()) { el.textContent = `${target}${suffix}`; return; }
  const duration = 1200;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = `${Math.round(target * eased)}${suffix}`;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initCounters() {
  const els = $$('[data-count]');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach(countTo); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countTo(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  els.forEach((el) => io.observe(el));
}

/* 36 — typewriter ------------------------------------------------------ */

function initTypewriter() {
  $$('[data-typewriter]').forEach((el) => {
    const words = el.dataset.typewriter.split('|').map((w) => w.trim()).filter(Boolean);
    if (!words.length) return;
    if (prefersReducedMotion()) { el.textContent = words[0]; return; }
    let w = 0, c = 0, deleting = false;
    const tick = () => {
      const word = words[w];
      c += deleting ? -1 : 1;
      el.textContent = word.slice(0, c);
      let wait = deleting ? 45 : 85;
      if (!deleting && c === word.length) { deleting = true; wait = 1600; }
      else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; wait = 350; }
      setTimeout(tick, wait);
    };
    tick();
  });
}

/* 37 — image loading --------------------------------------------------- */

function initImages() {
  $$('img[loading="lazy"]').forEach((img) => {
    if (img.complete) { img.dataset.loaded = 'true'; return; }
    img.addEventListener('load', () => { img.dataset.loaded = 'true'; }, { once: true });
    img.addEventListener('error', () => { img.dataset.loaded = 'error'; }, { once: true });
  });
}

export function initMotion() {
  initReveal();
  initParallax();
  initCounters();
  initTypewriter();
  initImages();
}

// Re-run reveal/lazy wiring after cards are injected by fetch-driven pages.
document.addEventListener('af:cardsrendered', () => { initReveal(); initImages(); });
