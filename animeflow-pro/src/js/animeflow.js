/**
 * AnimeFlow Pro — entry point.
 *
 * Everything is plain ES modules bundled by esbuild. Only two Bootstrap
 * components are imported (Modal and Offcanvas); dropdowns, tabs, collapse and
 * alerts are implemented in modules/widgets.js so Popper.js never ships.
 * No jQuery anywhere in the chain.
 *
 * Feature index (38 behaviours, numbered in the module comments):
 *   store 1-3 · theme 4-5 · ui 6-15 · search 16-19 · card 20-21
 *   watchlist 22-26 · catalog 27-31 · rails 32 · motion 33-37
 *   forms 38-42 · video 43-44 · pages 45-52 · widgets 53-56
 */

import Offcanvas from 'bootstrap/js/dist/offcanvas.js';
import Modal from 'bootstrap/js/dist/modal.js';

import { initTheme } from './modules/theme.js';
import { initWidgets } from './modules/widgets.js';
import { initUI, toast } from './modules/ui.js';
import { initSearch } from './modules/search.js';
import { initWatchlist } from './modules/watchlist.js';
import { initCatalog } from './modules/catalog.js';
import { initRails } from './modules/rails.js';
import { initMotion } from './modules/motion.js';
import { initForms } from './modules/forms.js';
import { initVideo } from './modules/video.js';
import { initPages } from './modules/pages.js';
import { cardHTML, skeletonHTML } from './modules/card.js';
import { getCatalogue } from './modules/store.js';

// Only Modal and Offcanvas come from Bootstrap; dropdowns, tabs, collapse and
// alerts are ours (see modules/widgets.js), which keeps Popper.js out entirely.
window.bootstrap = { Offcanvas, Modal };

function boot() {
  initTheme();
  initWidgets();
  initUI();
  initWatchlist();
  initSearch();
  initRails();
  initMotion();
  initForms();
  initVideo();
  initCatalog();
  initPages();
  document.documentElement.classList.add('af-ready');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}

/** Small public surface, handy for wiring the template into a real backend. */
window.AnimeFlow = { toast, cardHTML, skeletonHTML, getCatalogue, initRails, version: '1.0.0' };
