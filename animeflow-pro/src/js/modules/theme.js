/**
 * Feature 4 — colour-mode switcher (dark / light, persisted).
 * Feature 5 — text-direction switcher (LTR / RTL, persisted).
 *
 * The initial value is applied by the inline script in <head> so nothing
 * flashes; this module only handles changes made after load.
 */

import { $, $$ } from '../utils.js';

const KEY = 'af-theme';
const DIR_KEY = 'af-dir';

// Written as raw strings, not JSON: the inline boot script in <head> reads them
// back with a plain getItem() before any of this code has loaded.
const remember = (key, value) => { try { localStorage.setItem(key, value); } catch { /* private mode */ } };
const recall = (key) => { try { return localStorage.getItem(key); } catch { return null; } };

export function currentTheme() {
  return document.documentElement.getAttribute('data-bs-theme') || 'dark';
}

export function setTheme(mode, { announce = true } = {}) {
  document.documentElement.setAttribute('data-bs-theme', mode);
  remember(KEY, mode);
  $$('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(mode === 'light'));
    btn.setAttribute('aria-label', mode === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  });
  document.dispatchEvent(new CustomEvent('af:themechange', { detail: { mode, announce } }));
}

function setDirection(dir) {
  const html = document.documentElement;
  html.dir = dir;
  remember(DIR_KEY, dir);
  // Swap in the mirrored stylesheet so Bootstrap's own spacing flips too.
  const sheet = $('#af-stylesheet');
  if (sheet) {
    const ltr = 'assets/css/animeflow.min.css';
    const rtl = 'assets/css/animeflow.rtl.min.css';
    const next = dir === 'rtl' ? rtl : ltr;
    if (!sheet.getAttribute('href').endsWith(next)) sheet.setAttribute('href', next);
  }
  document.dispatchEvent(new CustomEvent('af:dirchange', { detail: { dir } }));
}

export function initTheme() {
  // Apply the saved direction's stylesheet once on load.
  if (recall(DIR_KEY) === 'rtl') setDirection('rtl');
  setTheme(currentTheme(), { announce: false });

  $$('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  });

  $$('[data-dir-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setDirection(document.documentElement.dir === 'rtl' ? 'ltr' : 'rtl');
    });
  });

  // Follow the OS only while the visitor has never made a choice.
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (event) => {
    if (recall(KEY) === null) setTheme(event.matches ? 'light' : 'dark');
  });
}
