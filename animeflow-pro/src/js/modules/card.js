/**
 * 20 — client-side card renderer.
 *
 * The build script renders the same markup at build time (src/lib/components.js);
 * this is its runtime twin, used wherever cards appear after a fetch — browse,
 * search results, the watchlist and the dashboard. Keeping one shape in both
 * places is what makes the static HTML and the dynamic HTML indistinguishable.
 */

import { escapeHtml } from '../utils.js';
import { isSaved } from './watchlist.js';

const icon = (name) => `<svg class="af-icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

function stars(value) {
  const out = [];
  for (let i = 0; i < 5; i += 1) {
    const filled = value / 2 - i;
    out.push(icon(filled >= 0.75 ? 'star-fill' : filled >= 0.25 ? 'star-half' : 'star'));
  }
  return out.join('');
}

export function cardHTML(a, { rank = 0 } = {}) {
  const saved = isSaved(a.slug);
  const meta = [a.year, a.type, a.episodes ? `${a.episodes} ep` : null].filter(Boolean).join(' · ');
  const flag = a.status === 'Upcoming'
    ? '<span class="badge af-badge af-badge-info af-card-flag">Upcoming</span>'
    : a.rating >= 8.6 ? '<span class="badge af-badge af-badge-warning af-card-flag">Top rated</span>' : '';

  return `<article class="af-card" data-slug="${a.slug}" data-title="${escapeHtml(a.title)}">
  <div class="af-poster">
    <a class="af-poster-link" href="anime-details.html?id=${a.slug}" aria-label="${escapeHtml(a.title)} details">
      <img class="af-poster-img" src="assets/img/posters/${a.slug}.svg" alt="${escapeHtml(a.title)}" width="400" height="600" loading="lazy" decoding="async">
    </a>
    ${rank ? `<span class="af-rank" aria-hidden="true">${rank}</span>` : ''}
    ${flag}
    <div class="af-poster-overlay">
      <a class="af-play" href="watch.html?id=${a.slug}" aria-label="Watch ${escapeHtml(a.title)}">${icon('play-fill')}</a>
      <div class="af-poster-actions">
        <button type="button" class="af-icon-btn" data-watchlist="${a.slug}" aria-pressed="${saved}" aria-label="${saved ? 'Remove' : 'Add'} ${escapeHtml(a.title)} ${saved ? 'from' : 'to'} watchlist">${icon('heart')}${icon('heart-fill')}</button>
        <button type="button" class="af-icon-btn" data-preview="${a.slug}" aria-label="Preview ${escapeHtml(a.title)} trailer">${icon('play-circle-fill')}</button>
      </div>
    </div>
  </div>
  <div class="af-card-body">
    <h3 class="af-card-title"><a href="anime-details.html?id=${a.slug}">${escapeHtml(a.title)}</a></h3>
    <div class="af-card-meta">
      ${a.rating
        ? `<span class="af-rating af-rating-sm" role="img" aria-label="Rated ${a.rating} out of 10"><span class="af-rating-stars" aria-hidden="true">${stars(a.rating)}</span><b>${a.rating.toFixed(1)}</b></span>`
        : '<span class="af-muted">Not yet rated</span>'}
      <span class="af-dot" aria-hidden="true"></span>
      <span class="af-muted">${escapeHtml(meta)}</span>
    </div>
  </div>
</article>`;
}

/** 21 — skeleton placeholders, shown while a fetch is in flight. */
export const skeletonHTML = (count = 10) => Array.from({ length: count }, () =>
  `<div class="af-card af-skeleton-card" aria-hidden="true">
    <div class="af-poster af-skeleton"></div>
    <div class="af-card-body">
      <div class="af-skeleton af-skeleton-line" style="width:80%"></div>
      <div class="af-skeleton af-skeleton-line" style="width:55%"></div>
    </div>
  </div>`).join('');
