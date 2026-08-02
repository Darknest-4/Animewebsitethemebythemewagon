/**
 * 22 — watchlist stored in localStorage
 * 23 — heart buttons stay in sync across every card on the page
 * 24 — header + bottom-nav counters
 * 25 — the watchlist page (render, remove, clear, empty state)
 * 26 — "recently viewed" rail on the dashboard
 */

import { $, $$, on, storage } from '../utils.js';
import { getCatalogue, getRecent } from './store.js';
import { cardHTML } from './card.js';
import { toast } from './ui.js';

const KEY = 'af-watchlist';

export const getWatchlist = () => storage.get(KEY, []);
export const isSaved = (slug) => getWatchlist().includes(slug);

export function toggleWatchlist(slug) {
  const list = getWatchlist();
  const index = list.indexOf(slug);
  const added = index === -1;
  if (added) list.unshift(slug); else list.splice(index, 1);
  storage.set(KEY, list);
  syncButtons();
  syncCount();
  document.dispatchEvent(new CustomEvent('af:watchlistchange', { detail: { slug, added, list } }));
  return added;
}

/** 23 — every button for the same title reflects the same state. */
export function syncButtons(root = document) {
  const list = getWatchlist();
  $$('[data-watchlist]', root).forEach((btn) => {
    const saved = list.includes(btn.dataset.watchlist);
    btn.setAttribute('aria-pressed', String(saved));
    const title = btn.closest('[data-title]')?.dataset.title;
    if (title) {
      btn.setAttribute('aria-label', `${saved ? 'Remove' : 'Add'} ${title} ${saved ? 'from' : 'to'} watchlist`);
    }
  });
}

/** 24 — badge counters. */
export function syncCount() {
  const count = getWatchlist().length;
  $$('[data-watchlist-count]').forEach((el) => {
    el.textContent = String(count);
    el.hidden = count === 0;
  });
}

/* 25 — watchlist page --------------------------------------------------- */

async function renderWatchlistPage() {
  const host = $('[data-watchlist-grid]');
  if (!host) return;
  const { anime } = await getCatalogue();
  const saved = getWatchlist();
  const items = saved.map((slug) => anime.find((a) => a.slug === slug)).filter(Boolean);
  const counter = $('[data-watchlist-total]');
  if (counter) counter.textContent = `${items.length} title${items.length === 1 ? '' : 's'}`;

  if (!items.length) {
    host.innerHTML = `<div class="af-empty" style="grid-column:1/-1">
      <span class="af-empty-icon"><svg class="af-icon" aria-hidden="true"><use href="#i-heart"></use></svg></span>
      <h3>Your watchlist is empty</h3>
      <p class="af-muted">Tap the heart on any poster and it will show up here — stored in your browser, no account needed.</p>
      <a class="btn btn-primary" href="browse.html">Find something to watch</a>
    </div>`;
    $('[data-watchlist-clear]')?.setAttribute('disabled', '');
    return;
  }
  $('[data-watchlist-clear]')?.removeAttribute('disabled');
  host.innerHTML = items.map((a) => cardHTML(a)).join('');
  syncButtons(host);
}

/* 26 — recently viewed --------------------------------------------------- */

async function renderRecent() {
  const host = $('[data-recent-grid]');
  if (!host) return;
  const { anime } = await getCatalogue();
  const items = getRecent().map((slug) => anime.find((a) => a.slug === slug)).filter(Boolean).slice(0, 6);
  if (!items.length) {
    host.closest('[data-recent-section]')?.setAttribute('hidden', '');
    return;
  }
  host.closest('[data-recent-section]')?.removeAttribute('hidden');
  host.innerHTML = items.map((a) => cardHTML(a)).join('');
  syncButtons(host);
}

export function initWatchlist() {
  syncCount();
  syncButtons();

  on(document, 'click', '[data-watchlist]', async (event, btn) => {
    event.preventDefault();
    const slug = btn.dataset.watchlist;
    const added = toggleWatchlist(slug);
    const title = btn.closest('[data-title]')?.dataset.title || 'Title';
    toast(
      added ? 'Added to watchlist' : 'Removed from watchlist',
      title,
      added ? 'success' : 'info',
      2600
    );
    if ($('[data-watchlist-grid]')) renderWatchlistPage();
  });

  $('[data-watchlist-clear]')?.addEventListener('click', () => {
    storage.set(KEY, []);
    syncCount();
    renderWatchlistPage();
    toast('Watchlist cleared', '', 'info');
  });

  renderWatchlistPage();
  renderRecent();
}
