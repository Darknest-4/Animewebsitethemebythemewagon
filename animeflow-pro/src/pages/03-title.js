import {
  btn, icon, breadcrumb, sectionHeader, ratingStars, badge, tabs, commentItem,
  gallery, countdown, infoRow, esc, videoFacade, progressBar
} from '../lib/components.js';

import { reviewers } from '../data/site.js';

const REVIEWS = reviewers.map((r) => ({ name: r.name, when: r.when, rating: r.rating, text: r.quote }));

/** anime-details.html — hydrated from ?id=slug by js/modules/pages.js */
function details(ctx) {
  const first = ctx.anime[0];
  return {
    meta: {
      path: 'anime-details.html',
      title: 'Title details',
      description: 'Synopsis, cast, episode list, gallery and reviews — a complete detail page driven entirely by the catalogue JSON.',
      ogType: 'video.tv_show',
      priority: '0.8',
      preconnect: ['https://www.youtube-nocookie.com'],
      breadcrumbLd: [{ label: 'Home', href: 'index.html' }, { label: 'Browse', href: 'browse.html' }, { label: 'Details' }],
      jsonLd: [{
        '@context': 'https://schema.org',
        '@type': 'TVSeries',
        name: first.title,
        description: first.synopsis,
        numberOfEpisodes: first.episodes,
        datePublished: String(first.year),
        genre: first.genres,
        productionCompany: { '@type': 'Organization', name: first.studio },
        aggregateRating: { '@type': 'AggregateRating', ratingValue: first.rating, bestRating: 10, ratingCount: 18420 }
      }]
    },
    body: `
<article data-detail data-title="${esc(first.title)}">
  <section class="af-detail-hero">
    <div class="af-hero-bg">
      <img data-d-backdrop src="assets/img/backdrops/${first.slug}.svg" alt="" width="1280" height="720" fetchpriority="high">
    </div>
    <div class="container">
      ${breadcrumb([{ label: 'Home', href: 'index.html' }, { label: 'Browse', href: 'browse.html' }, { label: 'Details' }])}
      <div class="af-detail-grid mt-3">
        <div class="af-detail-poster" data-reveal="zoom">
          <img data-d-poster src="assets/img/posters/${first.slug}.svg" alt="${esc(first.title)} poster" width="400" height="600" fetchpriority="high">
        </div>
        <div class="af-detail-body">
          <div class="af-pill-row mb-2" data-d-genres></div>
          <h1 data-d-title>${esc(first.title)}</h1>
          <div class="af-detail-facts">
            <span class="af-rating af-rating-lg">${icon('star-fill')}<b data-d-rating>${first.rating.toFixed(1)}</b><span class="af-muted">/ 10</span></span>
            <span class="af-dot"></span><span data-d-year>${first.year}</span>
            <span class="af-dot"></span><span data-d-type>${first.type}</span>
            <span class="af-dot"></span><span><b data-d-episodes>${first.episodes}</b> episodes</span>
            <span class="af-dot"></span><span data-d-duration>${first.duration} min</span>
            <span class="af-dot"></span>${badge('Simulcast', 'info')}
          </div>
          <p class="af-section-text" data-d-synopsis>${esc(first.synopsis)}</p>

          <div class="af-detail-actions">
            ${btn({ label: 'Watch episode 1', href: `watch.html?id=${first.slug}`, variant: 'primary', icon: 'play-fill', 'data-d-watch': true })}
            ${btn({ label: 'Watch trailer', variant: 'outline-light', icon: 'play-circle-fill', 'data-trailer': 'dQw4w9WgXcQ' })}
            <button type="button" class="af-icon-btn border" data-d-heart data-watchlist="${first.slug}" aria-pressed="false" aria-label="Add to watchlist">${icon('heart')}${icon('heart-fill', 'af-icon-on')}</button>
            <button type="button" class="af-icon-btn border" data-share aria-label="Share this title">${icon('share')}</button>
          </div>

          <dl class="af-panel p-3 mb-0" style="max-width:34rem">
            ${infoRow('Studio', '<span data-d-studio></span>')}
            ${infoRow('Status', '<span data-d-status></span>')}
            ${infoRow('Audio', 'Japanese, English, Portuguese, German')}
            ${infoRow('Subtitles', '40+ languages')}
          </dl>
        </div>
      </div>
    </div>
  </section>

  <section class="container af-section">
    <div class="af-detail-cols">
      <div>
        ${tabs([
          {
            label: 'Episodes',
            content: `<ul class="af-episodes" data-d-episodes-list></ul>`
          },
          {
            label: 'Gallery',
            content: gallery(ctx.anime.slice(0, 8).map((a) => ({ slug: a.slug, caption: `${a.title} — key art` })))
          },
          {
            label: `Reviews (${REVIEWS.length})`,
            content: `<div>${REVIEWS.map(commentItem).join('')}</div>
              <form class="mt-4" data-async="Review posted" data-async-note="Thanks — it will appear after moderation." novalidate>
                <div class="af-field">
                  <label class="form-label" for="af-review">Add your review</label>
                  <textarea class="form-control" id="af-review" rows="3" placeholder="What did you think?" required minlength="12"></textarea>
                  <p class="invalid-feedback" data-error></p>
                </div>
                ${btn({ label: 'Post review', variant: 'primary', type: 'submit' })}
              </form>`
          }
        ], 'af-detail-tabs')}
      </div>

      <aside class="af-stack">
        ${countdown('Next episode airs in')}
        <div class="af-panel p-3">
          <h2 class="h6 mb-3">Your progress</h2>
          ${progressBar(35, { label: 'Series progress' })}
          <p class="af-muted mt-2 mb-0" style="font-size:.85rem">Resume points are stored per title in <code>localStorage</code>.</p>
        </div>
        <div class="af-panel p-3">
          <h2 class="h6 mb-3">Where to start</h2>
          <ul class="af-stack-sm list-unstyled m-0" style="font-size:.9rem">
            <li>${icon('play-circle-fill')} Season 1 — episodes 1-12</li>
            <li>${icon('collection-play')} Recap film (optional)</li>
            <li>${icon('film')} Season 2 — episodes 13-28</li>
          </ul>
        </div>
      </aside>
    </div>
  </section>

  <section class="af-rail-section container">
    ${sectionHeader({ eyebrow: 'Because you are here', title: 'More like this', link: 'browse.html' })}
    <div class="af-rail" data-rail>
      <button type="button" class="af-rail-nav af-rail-prev" data-rail-prev aria-label="Scroll left" hidden>${icon('chevron-left')}</button>
      <div class="af-rail-track" data-rail-track tabindex="0" role="region" aria-label="Related titles" data-d-related></div>
      <button type="button" class="af-rail-nav af-rail-next" data-rail-next aria-label="Scroll right">${icon('chevron-right')}</button>
    </div>
  </section>
</article>`
  };
}

/** watch.html — player page. */
function watch(ctx) {
  const first = ctx.anime[0];
  return {
    meta: {
      path: 'watch.html',
      title: 'Now playing',
      description: 'A player page with an episode rail, resume state, quality controls and a comment thread.',
      ogType: 'video.episode',
      noindex: true,
      preconnect: ['https://www.youtube-nocookie.com']
    },
    body: `
<div class="container af-section" data-watch data-title="${esc(first.title)}">
  <div class="af-watch">
    <div>
      <div data-watch-player>
        ${videoFacade({ id: 'dQw4w9WgXcQ', title: 'Episode 1', poster: `assets/img/backdrops/${first.slug}.svg` })}
        <div class="af-player-bar">
          <button type="button" class="af-icon-btn" data-w-prev aria-label="Previous episode">${icon('skip-backward-fill')}</button>
          <button type="button" class="af-icon-btn" data-w-next aria-label="Next episode">${icon('skip-forward-fill')}</button>
          <span class="ms-2 me-auto af-muted" style="font-size:.85rem" data-w-episode>Episode 1</span>
          <button type="button" class="af-icon-btn" aria-label="Audio settings">${icon('volume-up')}</button>
          <button type="button" class="af-icon-btn" aria-label="Subtitles">${icon('badge-cc')}</button>
          <button type="button" class="af-icon-btn" aria-label="Quality">${icon('badge-hd')}</button>
          <button type="button" class="af-icon-btn" aria-label="Cast to device">${icon('cast')}</button>
          <button type="button" class="af-icon-btn" aria-label="Fullscreen">${icon('fullscreen')}</button>
        </div>
      </div>

      <div class="d-flex flex-wrap align-items-start justify-content-between gap-3 mt-4">
        <div>
          <h1 class="h3 mb-1" data-w-title>${esc(first.title)}</h1>
          <p class="af-muted mb-0" data-w-meta>${esc(first.studio)} · ${first.year}</p>
        </div>
        <div class="d-flex gap-2">
          <button type="button" class="af-icon-btn border" data-watchlist="${first.slug}" aria-pressed="false" aria-label="Add to watchlist">${icon('heart')}${icon('heart-fill', 'af-icon-on')}</button>
          <button type="button" class="af-icon-btn border" data-share aria-label="Share">${icon('share')}</button>
          ${btn({ label: 'Download', variant: 'outline-light', icon: 'download' })}
        </div>
      </div>

      <section class="af-section">
        <h2 class="h5 mb-3">Comments</h2>
        ${REVIEWS.map(commentItem).join('')}
      </section>
    </div>

    <aside class="af-stack">
      <div class="af-episode-panel">
        <h2 class="h6 mb-3">Episodes</h2>
        <ul class="af-episodes" data-watch-episodes></ul>
      </div>
      ${countdown('Next episode in')}
    </aside>
  </div>
</div>`
  };
}

export async function pages(ctx) {
  return [details(ctx), watch(ctx)];
}
