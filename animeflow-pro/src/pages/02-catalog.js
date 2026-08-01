import {
  btn, icon, breadcrumb, filterPanel, skeletonCard, animeCard, sectionHeader,
  emptyState, pagination, esc, ratingStars
} from '../lib/components.js';

/** browse.html — filters, sorting, infinite scroll. */
function browse(ctx) {
  const { genres, studios } = ctx;
  return {
    meta: {
      path: 'browse.html',
      title: 'Browse the catalogue',
      description: 'Filter 50+ titles by genre, studio, status and score, sort them four ways, and keep scrolling — results load as you go.',
      priority: '0.9',
      breadcrumbLd: [{ label: 'Home', href: 'index.html' }, { label: 'Browse' }]
    },
    body: `
<section class="container af-page-head">
  ${breadcrumb([{ label: 'Home', href: 'index.html' }, { label: 'Browse' }])}
  <h1>Browse everything</h1>
  <p>Every title in the catalogue, filtered live in the browser. Nothing here hits a server — swap the JSON for your API and the same controls keep working.</p>
</section>

<section class="container">
  <div class="af-browse">
    <aside class="af-browse-side" aria-label="Filters">
      <h2 class="h6 mb-3">${icon('funnel')} Filters</h2>
      ${filterPanel({ genres, studios, idPrefix: 'side' })}
    </aside>

    <div>
      <div class="af-browse-bar">
        <p><b data-catalog-count>Loading…</b> in the catalogue</p>
        <div class="ms-auto d-flex gap-2">
          ${btn({ label: 'Filters', variant: 'outline-light', size: 'sm', icon: 'sliders', cls: 'd-lg-none', 'data-bs-toggle': 'offcanvas', 'data-bs-target': '#af-filters' })}
          ${btn({ label: 'Search', variant: 'outline-light', size: 'sm', icon: 'search', 'data-search-open': true })}
        </div>
      </div>

      <div class="af-active-filters" data-active-filters></div>

      <div class="af-grid" data-catalog-grid>
        ${Array.from({ length: 12 }, skeletonCard).join('\n        ')}
      </div>

      <div class="text-center mt-4">
        ${btn({ label: 'Load more titles', variant: 'outline-light', 'data-load-more': true, hidden: true })}
      </div>
      <div data-infinite aria-hidden="true" style="height:1px"></div>
    </div>
  </div>
</section>

<div class="offcanvas offcanvas-start af-offcanvas" tabindex="-1" id="af-filters" aria-labelledby="af-filters-title">
  <div class="offcanvas-header">
    <h2 class="offcanvas-title h6" id="af-filters-title">Filters</h2>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">${filterPanel({ genres, studios, idPrefix: 'oc' })}</div>
</div>`
  };
}

/** search.html — results page for the header search box. */
function search() {
  return {
    meta: {
      path: 'search.html',
      title: 'Search',
      description: 'Search the AnimeFlow catalogue by title, studio or genre — results update as you type.',
      priority: '0.5'
    },
    body: `
<section class="container af-page-head">
  ${breadcrumb([{ label: 'Home', href: 'index.html' }, { label: 'Search' }])}
  <h1>Search</h1>
  <form class="mt-3" data-search-form role="search" style="max-width:34rem">
    <div class="af-control has-icon">
      <span class="af-control-icon">${icon('search')}</span>
      <label class="visually-hidden" for="af-q">Search titles, studios and genres</label>
      <input class="form-control form-control-lg" type="search" id="af-q" data-search-page-input placeholder="Try “Frieren”, “MAPPA” or “Sci-Fi”" autocomplete="off">
    </div>
  </form>
</section>

<section class="container">
  <h2 class="h6 mb-3" data-search-heading aria-live="polite">Start typing to search the catalogue</h2>
  <div class="af-grid" data-search-page></div>
</section>`
  };
}

/** watchlist.html — everything saved in localStorage. */
function watchlist() {
  return {
    meta: {
      path: 'watchlist.html',
      title: 'My watchlist',
      description: 'Your saved titles, stored in this browser — no account, no server round-trip.',
      noindex: true
    },
    body: `
<section class="container af-page-head">
  ${breadcrumb([{ label: 'Home', href: 'index.html' }, { label: 'Watchlist' }])}
  <div class="d-flex flex-wrap align-items-end justify-content-between gap-3">
    <div>
      <h1>My watchlist</h1>
      <p><span data-watchlist-total>0 titles</span> · saved in this browser only</p>
    </div>
    ${btn({ label: 'Clear watchlist', variant: 'outline-light', icon: 'trash', 'data-watchlist-clear': true })}
  </div>
</section>

<section class="container">
  <div class="af-grid" data-watchlist-grid></div>
</section>

<section class="container af-section">
  <div class="af-callout af-callout-tip">
    ${icon('lightning-charge')}
    <div><b>How this works</b><p class="mb-0">The heart button writes an array of slugs to <code>localStorage</code> under <code>af-watchlist</code>. Wire <code>toggleWatchlist()</code> in <code>src/js/modules/watchlist.js</code> to your own endpoint to sync it to an account.</p></div>
  </div>
</section>`
  };
}

/** schedule.html — the weekly simulcast grid. */
function schedule(ctx) {
  const { schedule: week, bySlug } = ctx;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return {
    meta: {
      path: 'schedule.html',
      title: 'Airing schedule',
      description: 'The weekly simulcast grid: what airs on which day, with times in your own timezone.',
      priority: '0.6'
    },
    body: `
<section class="container af-page-head">
  ${breadcrumb([{ label: 'Home', href: 'index.html' }, { label: 'Schedule' }])}
  <h1>This week on AnimeFlow</h1>
  <p>Seven days of simulcasts. Times shown are the Japanese broadcast slot — the template ships the grid, your backend supplies the timestamps.</p>
</section>

<section class="container">
  <div class="row g-4">
    ${week.map((day) => `<div class="col-md-6 col-xl-4" data-reveal>
      <div class="af-panel p-3 h-100${day.day === today ? ' border-primary' : ''}">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <h2 class="h6 mb-0">${day.day}</h2>
          ${day.day === today ? '<span class="badge af-badge af-badge-primary">Today</span>' : ''}
        </div>
        <ul class="af-episodes">
          ${day.items.map((slug, i) => {
            const a = bySlug[slug];
            if (!a) return '';
            const hour = 17 + i;
            return `<li class="af-episode">
              <a class="af-episode-link" href="anime-details.html?id=${a.slug}">
                <img src="assets/img/posters/${a.slug}.svg" alt="" width="400" height="600" loading="lazy" decoding="async" style="width:2.4rem;height:3.6rem;object-fit:cover;border-radius:.4rem;flex:none">
                <span class="af-episode-body">
                  <span class="af-episode-title">${esc(a.title)}</span>
                  <span class="af-muted">${String(hour).padStart(2, '0')}:30 JST · ${esc(a.studio)}</span>
                </span>
              </a>
              <button type="button" class="af-icon-btn" data-watchlist="${a.slug}" aria-pressed="false" aria-label="Add ${esc(a.title)} to watchlist">${icon('bell')}</button>
            </li>`;
          }).join('\n          ')}
        </ul>
      </div>
    </div>`).join('\n    ')}
  </div>
</section>`
  };
}

export async function pages(ctx) {
  return [browse(ctx), search(ctx), watchlist(ctx), schedule(ctx)];
}
