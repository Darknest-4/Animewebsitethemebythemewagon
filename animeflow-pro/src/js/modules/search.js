/**
 * 16 — command-palette search dialog (⌘K / Ctrl-K / "/")
 * 17 — debounced live autocomplete over the JSON catalogue
 * 18 — full keyboard navigation of the result list (combobox pattern)
 * 19 — the standalone search results page
 */

import { $, $$, on, debounce, highlight, trapFocus, escapeHtml } from '../utils.js';
import { getCatalogue } from './store.js';

const score = (item, term) => {
  const t = term.toLowerCase();
  const title = item.title.toLowerCase();
  if (title === t) return 100;
  if (title.startsWith(t)) return 80;
  if (title.includes(t)) return 60;
  if (item.studio.toLowerCase().includes(t)) return 40;
  if (item.genres.some((g) => g.toLowerCase().includes(t))) return 30;
  if ((item.synopsis || '').toLowerCase().includes(t)) return 10;
  return 0;
};

export function searchCatalogue(list, term, limit = 8) {
  if (!term.trim()) return [];
  return list
    .map((item) => ({ item, s: score(item, term) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s || b.item.rating - a.item.rating)
    .slice(0, limit)
    .map((r) => r.item);
}

const resultRow = (a, term, selected) => `<li role="option" id="af-opt-${a.slug}" aria-selected="${selected}">
  <a href="anime-details.html?id=${a.slug}">
    <img src="assets/img/posters/${a.slug}.svg" alt="" width="400" height="600" loading="lazy" decoding="async">
    <span>
      <b>${highlight(a.title, term)}</b>
      <small>${escapeHtml(a.studio)} · ${a.year} · ${escapeHtml(a.genres.slice(0, 2).join(', '))}</small>
    </span>
  </a>
</li>`;

function initDialog() {
  const dialog = $('[data-search-dialog]');
  if (!dialog) return;

  const input = $('[data-search-input]', dialog);
  const list = $('[data-search-results]', dialog);
  const hint = $('[data-search-hint]', dialog);
  let index = -1;
  let results = [];
  let release = null;
  let opener = null;

  const paint = (items, term) => {
    results = items;
    index = items.length ? 0 : -1;
    list.innerHTML = items.map((a, i) => resultRow(a, term, i === 0)).join('');
    input.setAttribute('aria-expanded', String(items.length > 0));
    input.setAttribute('aria-activedescendant', items.length ? `af-opt-${items[0].slug}` : '');
  };

  const showDefaults = async () => {
    const { anime } = await getCatalogue();
    hint.textContent = 'Popular right now';
    paint(anime.filter((a) => a.tags.includes('trending')).slice(0, 6), '');
  };

  const run = debounce(async (term) => {
    const { anime } = await getCatalogue();
    if (!term.trim()) { showDefaults(); return; }
    const items = searchCatalogue(anime, term);
    hint.textContent = items.length
      ? `${items.length} result${items.length === 1 ? '' : 's'} for “${term}”`
      : `Nothing matched “${term}”`;
    paint(items, term);
    if (!items.length) {
      list.innerHTML = `<li class="af-search-empty"><p class="af-muted" style="padding:1rem .6rem">Try a studio (“MAPPA”), a genre (“Sci-Fi”) or a shorter title.</p></li>`;
    }
  }, 180);

  const open = (trigger) => {
    opener = trigger || document.activeElement;
    dialog.hidden = false;
    document.body.style.overflow = 'hidden';
    release = trapFocus(dialog);
    input.value = '';
    showDefaults();
    requestAnimationFrame(() => input.focus());
  };

  const close = () => {
    dialog.hidden = true;
    document.body.style.removeProperty('overflow');
    release?.();
    opener?.focus?.();
  };

  const move = (delta) => {
    if (!results.length) return;
    index = (index + delta + results.length) % results.length;
    $$('li[role="option"]', list).forEach((li, i) => li.setAttribute('aria-selected', String(i === index)));
    input.setAttribute('aria-activedescendant', `af-opt-${results[index].slug}`);
    $$('li[role="option"]', list)[index]?.scrollIntoView({ block: 'nearest' });
  };

  on(document, 'click', '[data-search-open]', (event, btn) => { event.preventDefault(); open(btn); });
  on(dialog, 'click', '[data-search-close]', close);

  input.addEventListener('input', () => run(input.value));
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); move(1); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); move(-1); }
    else if (event.key === 'Enter' && index > -1 && results[index]) {
      event.preventDefault();
      location.href = `anime-details.html?id=${results[index].slug}`;
    } else if (event.key === 'Escape') { close(); }
  });

  // 16 — global shortcuts. "/" is ignored while typing somewhere else.
  document.addEventListener('keydown', (event) => {
    const typing = /^(input|textarea|select)$/i.test(event.target.tagName) || event.target.isContentEditable;
    if ((event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey)) {
      event.preventDefault(); dialog.hidden ? open() : close();
    } else if (event.key === '/' && !typing && dialog.hidden) {
      event.preventDefault(); open();
    }
  });
}

/* 19 — /search.html --------------------------------------------------- */

async function initResultsPage() {
  const host = $('[data-search-page]');
  if (!host) return;
  const form = $('[data-search-form]');
  const input = $('[data-search-page-input]');
  const heading = $('[data-search-heading]');
  const { anime } = await getCatalogue();

  const render = (term) => {
    const items = searchCatalogue(anime, term, 60);
    heading.textContent = term
      ? `${items.length} result${items.length === 1 ? '' : 's'} for “${term}”`
      : 'Start typing to search the catalogue';
    if (!items.length) {
      host.innerHTML = `<div class="af-empty">
        <span class="af-empty-icon"><svg class="af-icon" aria-hidden="true"><use href="#i-search"></use></svg></span>
        <h3>No matches</h3><p class="af-muted">Check the spelling, or browse the full catalogue instead.</p>
        <a class="btn btn-primary" href="browse.html">Browse everything</a></div>`;
      return;
    }
    host.innerHTML = items.map((a) => window.AnimeFlow.cardHTML(a)).join('');
    document.dispatchEvent(new CustomEvent('af:cardsrendered', { detail: { root: host } }));
  };

  const initial = new URLSearchParams(location.search).get('q') || '';
  if (input) input.value = initial;
  render(initial);

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const term = input.value.trim();
    history.replaceState(null, '', term ? `?q=${encodeURIComponent(term)}` : location.pathname);
    render(term);
  });
  input?.addEventListener('input', debounce(() => render(input.value.trim()), 220));
}

export function initSearch() {
  initDialog();
  initResultsPage();
}
