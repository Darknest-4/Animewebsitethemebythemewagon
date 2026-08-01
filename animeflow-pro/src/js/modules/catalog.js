/**
 * 27 — faceted filtering (genre, status, studio, minimum score)
 * 28 — sorting
 * 29 — infinite scroll with a "load more" fallback
 * 30 — skeleton placeholders while the catalogue is fetched
 * 31 — active-filter chips, removable, reflected in the URL
 */

import { $, $$, on, debounce } from '../utils.js';
import { getCatalogue } from './store.js';
import { cardHTML, skeletonHTML } from './card.js';
import { syncButtons } from './watchlist.js';

const PAGE_SIZE = 18;

const state = {
  genre: new Set(),
  status: new Set(),
  studio: '',
  score: 0,
  sort: 'popular',
  query: '',
  shown: PAGE_SIZE
};

const sorters = {
  popular: (a, b) => b.tags.length - a.tags.length || b.rating - a.rating,
  rating: (a, b) => b.rating - a.rating,
  newest: (a, b) => b.year - a.year,
  title: (a, b) => a.title.localeCompare(b.title)
};

function applyFilters(all) {
  return all.filter((a) => {
    if (state.genre.size && !a.genres.some((g) => state.genre.has(g))) return false;
    if (state.status.size && !state.status.has(a.status)) return false;
    if (state.studio && a.studio !== state.studio) return false;
    if (state.score && a.rating < state.score) return false;
    if (state.query && !`${a.title} ${a.studio} ${a.genres.join(' ')}`.toLowerCase().includes(state.query.toLowerCase())) return false;
    return true;
  }).sort(sorters[state.sort] || sorters.popular);
}

function chipsHTML() {
  const chips = [
    ...[...state.genre].map((g) => ({ type: 'genre', value: g })),
    ...[...state.status].map((s) => ({ type: 'status', value: s })),
    ...(state.studio ? [{ type: 'studio', value: state.studio }] : []),
    ...(state.score ? [{ type: 'score', value: `${state.score}+ rating` }] : [])
  ];
  if (!chips.length) return '';
  return chips.map((c) => `<span class="af-chip" data-chip="${c.type}:${c.value}">${c.value}
    <button type="button" class="af-chip-x" data-chip-remove data-type="${c.type}" data-value="${c.value}" aria-label="Remove filter ${c.value}">
      <svg class="af-icon" aria-hidden="true"><use href="#i-x-lg"></use></svg></button></span>`).join('')
    + `<button type="button" class="af-ghost-btn" data-filter-reset>Clear all</button>`;
}

function syncURL() {
  const url = new URLSearchParams();
  if (state.genre.size) url.set('genre', [...state.genre].join(','));
  if (state.status.size) url.set('status', [...state.status].join(','));
  if (state.studio) url.set('studio', state.studio);
  if (state.score) url.set('score', state.score);
  if (state.sort !== 'popular') url.set('sort', state.sort);
  const qs = url.toString();
  history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
}

function readURL() {
  const url = new URLSearchParams(location.search);
  url.get('genre')?.split(',').filter(Boolean).forEach((g) => state.genre.add(g));
  url.get('status')?.split(',').filter(Boolean).forEach((s) => state.status.add(s));
  state.studio = url.get('studio') || '';
  state.score = Number(url.get('score') || 0);
  state.sort = url.get('sort') || 'popular';
}

/** Mirrors the parsed URL back onto both copies of the filter form. */
function syncControls() {
  $$('[data-filters]').forEach((form) => {
    $$('[data-filter="genre"]', form).forEach((cb) => { cb.checked = state.genre.has(cb.value); });
    $$('[data-filter="status"]', form).forEach((cb) => { cb.checked = state.status.has(cb.value); });
    const studio = $('[data-filter="studio"]', form);
    if (studio) studio.value = state.studio;
    const sort = $('[data-filter="sort"]', form);
    if (sort) sort.value = state.sort;
    const score = $('[data-filter="score"]', form);
    if (score) score.value = String(state.score);
    const out = $('[data-filter-out="score"]', form);
    if (out) out.textContent = state.score.toFixed(1);
  });
}

export async function initCatalog() {
  const grid = $('[data-catalog-grid]');
  if (!grid) return;

  const countEl = $('[data-catalog-count]');
  const chipHost = $('[data-active-filters]');
  const moreBtn = $('[data-load-more]');
  const sentinel = $('[data-infinite]');

  grid.innerHTML = skeletonHTML(12);
  readURL();
  syncControls();

  const { anime } = await getCatalogue();

  function render({ append = false } = {}) {
    const results = applyFilters(anime);
    const slice = results.slice(0, state.shown);

    if (countEl) countEl.textContent = `${results.length} title${results.length === 1 ? '' : 's'}`;
    if (chipHost) chipHost.innerHTML = chipsHTML();

    if (!results.length) {
      grid.innerHTML = `<div class="af-empty" style="grid-column:1/-1">
        <span class="af-empty-icon"><svg class="af-icon" aria-hidden="true"><use href="#i-funnel"></use></svg></span>
        <h3>Nothing matches those filters</h3>
        <p class="af-muted">Loosen one of them — dropping the minimum rating usually helps.</p>
        <button type="button" class="btn btn-primary" data-filter-reset>Reset filters</button></div>`;
    } else if (append) {
      const start = grid.querySelectorAll('.af-card:not(.af-skeleton-card)').length;
      grid.insertAdjacentHTML('beforeend', slice.slice(start).map((a) => cardHTML(a)).join(''));
    } else {
      grid.innerHTML = slice.map((a) => cardHTML(a)).join('');
    }

    syncButtons(grid);
    const done = state.shown >= results.length;
    if (moreBtn) moreBtn.hidden = done;
    if (sentinel) sentinel.hidden = done;
    syncURL();
  }

  const update = () => { state.shown = PAGE_SIZE; render(); };

  // Filter events — both the sidebar form and the mobile offcanvas copy.
  on(document, 'change', '[data-filter]', (event, el) => {
    const kind = el.dataset.filter;
    if (kind === 'genre' || kind === 'status') {
      const set = state[kind];
      el.checked ? set.add(el.value) : set.delete(el.value);
    } else if (kind === 'studio') state.studio = el.value;
    else if (kind === 'sort') state.sort = el.value;
    else if (kind === 'score') {
      state.score = Number(el.value);
      $$('[data-filter-out="score"]').forEach((o) => { o.textContent = state.score.toFixed(1); });
    }
    syncControls();
    update();
  });

  on(document, 'input', '[data-filter="score"]', debounce((event, el) => {
    $$('[data-filter-out="score"]').forEach((o) => { o.textContent = Number(el.value).toFixed(1); });
  }, 30));

  on(document, 'click', '[data-filter-reset]', () => {
    state.genre.clear(); state.status.clear();
    state.studio = ''; state.score = 0; state.sort = 'popular';
    syncControls();
    update();
  });

  on(document, 'click', '[data-chip-remove]', (event, btn) => {
    const { type, value } = btn.dataset;
    if (type === 'genre' || type === 'status') state[type].delete(value);
    else if (type === 'studio') state.studio = '';
    else if (type === 'score') state.score = 0;
    syncControls();
    update();
  });

  const loadMore = () => {
    const results = applyFilters(anime);
    if (state.shown >= results.length) return;
    state.shown += PAGE_SIZE;
    render({ append: true });
  };

  moreBtn?.addEventListener('click', loadMore);

  // 29 — infinite scroll. The button stays in the DOM as the no-JS-observer
  // fallback and for anyone navigating by keyboard.
  if (sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) loadMore();
    }, { rootMargin: '400px' }).observe(sentinel);
  }

  render();
}
