/**
 * Page-level behaviour that only runs where the matching markup exists.
 *
 * 45 — details page hydration from ?id=slug
 * 46 — episode list generation + resume state
 * 47 — watch page (player, episode switching, progress saving)
 * 48 — next-episode countdown
 * 49 — dashboard (stats, continue watching, watchlist preview)
 * 50 — pricing monthly/yearly toggle
 * 51 — blog post rendering from ?slug=
 * 52 — share button (Web Share API with clipboard fallback)
 */

import { $, $$, on, params, escapeHtml, storage } from '../utils.js';
import { getCatalogue, getPosts, trackView, saveProgress, getProgress } from './store.js';
import { cardHTML } from './card.js';
import { syncButtons, getWatchlist } from './watchlist.js';
import { toast } from './ui.js';
import { initRails } from './rails.js';

const icon = (n) => `<svg class="af-icon" aria-hidden="true"><use href="#i-${n}"></use></svg>`;

const EPISODE_TITLES = [
  'The journey begins', 'An unexpected ally', 'What the rain remembers', 'Two steps behind',
  'The weight of a promise', 'Nightfall', 'Everything he left behind', 'The long way round',
  'Held together with string', 'A quiet kind of courage', 'The last train home', 'Where it ends'
];

const episodeTitle = (n) => EPISODE_TITLES[(n - 1) % EPISODE_TITLES.length];

/* 45 + 46 — details ----------------------------------------------------- */

async function initDetails() {
  const root = $('[data-detail]');
  if (!root) return;
  const { anime } = await getCatalogue();
  const slug = params().get('id') || root.dataset.detail || anime[0]?.slug;
  const item = anime.find((a) => a.slug === slug) || anime[0];
  if (!item) return;

  trackView(item.slug);
  document.title = `${item.title} · AnimeFlow Pro`;

  const set = (sel, value, asHtml = false) => {
    const el = $(sel, root);
    if (!el) return;
    if (asHtml) el.innerHTML = value; else el.textContent = value;
  };

  set('[data-d-title]', item.title);
  set('[data-d-synopsis]', item.synopsis);
  set('[data-d-studio]', item.studio);
  set('[data-d-year]', item.year);
  set('[data-d-type]', item.type);
  set('[data-d-status]', item.status);
  set('[data-d-episodes]', item.episodes || '—');
  set('[data-d-duration]', `${item.duration} min`);
  set('[data-d-rating]', item.rating ? item.rating.toFixed(1) : '—');
  set('[data-d-genres]', item.genres.map((g) => `<a class="af-pill" href="browse.html?genre=${encodeURIComponent(g)}">${escapeHtml(g)}</a>`).join(''), true);

  $$('[data-d-poster]', root).forEach((img) => {
    img.src = `assets/img/posters/${item.slug}.svg`;
    img.alt = `${item.title} poster`;
  });
  const backdrop = $('[data-d-backdrop]', root);
  if (backdrop) {
    backdrop.src = `assets/img/backdrops/${item.slug}.svg`;
    backdrop.addEventListener('error', () => { backdrop.src = `assets/img/posters/${item.slug}.svg`; }, { once: true });
  }
  $$('[data-d-watch]', root).forEach((a) => { a.href = `watch.html?id=${item.slug}`; });
  const heart = $('[data-d-heart]', root);
  if (heart) {
    heart.dataset.watchlist = item.slug;
    heart.closest('[data-title]')?.setAttribute('data-title', item.title);
  }
  root.dataset.title = item.title;
  syncButtons(root);

  // 46 — episode list
  const list = $('[data-d-episodes-list]', root);
  if (list) {
    const total = Math.min(item.episodes || 0, 12);
    const progress = getProgress()[item.slug];
    list.innerHTML = total
      ? Array.from({ length: total }, (_, i) => {
          const n = i + 1;
          const watched = progress ? n < progress.episode : false;
          const pct = progress && progress.episode === n ? progress.percent : 0;
          return `<li class="af-episode${watched ? ' is-watched' : ''}">
            <a class="af-episode-link" href="watch.html?id=${item.slug}&ep=${n}">
              <span class="af-episode-thumb">${icon('play-fill')}<b>${n}</b></span>
              <span class="af-episode-body">
                <span class="af-episode-title">${escapeHtml(episodeTitle(n))}</span>
                <span class="af-muted">${item.duration} min${watched ? ' · Watched' : ''}</span>
                ${pct ? `<div class="progress af-progress af-progress-xs" role="progressbar" aria-label="Episode ${n} progress" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:${pct}%"></div></div>` : ''}
              </span>
            </a>
          </li>`;
        }).join('')
      : `<li class="af-muted" style="padding:1rem">Episodes are announced closer to the premiere.</li>`;
  }

  // Related titles by shared genre
  const related = $('[data-d-related]', root);
  if (related) {
    const others = anime
      .filter((a) => a.slug !== item.slug && a.genres.some((g) => item.genres.includes(g)))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
    related.innerHTML = others.map((a) => cardHTML(a)).join('');
    syncButtons(related);
    initRails(related.closest('.af-rail-section') || document);
    document.dispatchEvent(new CustomEvent('af:cardsrendered', { detail: { root: related } }));
  }
}

/* 47 + 48 — watch ------------------------------------------------------- */

async function initWatch() {
  const root = $('[data-watch]');
  if (!root) return;
  const { anime } = await getCatalogue();
  const slug = params().get('id') || anime[0]?.slug;
  const item = anime.find((a) => a.slug === slug) || anime[0];
  if (!item) return;

  const total = Math.max(1, Math.min(item.episodes || 12, 12));
  let current = Math.min(Math.max(1, Number(params().get('ep')) || 1), total);

  trackView(item.slug);
  const video = $('[data-video]', root);
  const list = $('[data-watch-episodes]', root);

  const paint = () => {
    document.title = `${item.title} — Episode ${current} · AnimeFlow Pro`;
    $('[data-w-title]', root).textContent = item.title;
    $('[data-w-episode]', root).textContent = `Episode ${current} · ${episodeTitle(current)}`;
    $('[data-w-meta]', root).textContent = `${item.studio} · ${item.year} · ${item.duration} min`;
    const heart = $('[data-watchlist]', root);
    if (heart) { heart.dataset.watchlist = item.slug; }
    root.dataset.title = item.title;
    syncButtons(root);

    if (video) {
      video.dataset.title = `${item.title} episode ${current}`;
      const img = $('img', video);
      if (img) {
        img.src = `assets/img/backdrops/${item.slug}.svg`;
        img.addEventListener('error', () => { img.src = `assets/img/posters/${item.slug}.svg`; }, { once: true });
      }
    }

    if (list) {
      list.innerHTML = Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        return `<li class="af-episode${n === current ? ' is-current' : ''}${n < current ? ' is-watched' : ''}">
          <button type="button" class="af-episode-link" data-goto-episode="${n}" ${n === current ? 'aria-current="true"' : ''}>
            <span class="af-episode-thumb">${icon(n === current ? 'play-fill' : 'play-circle-fill')}<b>${n}</b></span>
            <span class="af-episode-body">
              <span class="af-episode-title">${escapeHtml(episodeTitle(n))}</span>
              <span class="af-muted">${item.duration} min</span>
            </span>
          </button>
        </li>`;
      }).join('');
    }

    $('[data-w-prev]', root)?.toggleAttribute('disabled', current === 1);
    $('[data-w-next]', root)?.toggleAttribute('disabled', current === total);
    saveProgress(item.slug, current, 5);
    history.replaceState(null, '', `?id=${item.slug}&ep=${current}`);
  };

  on(root, 'click', '[data-goto-episode]', (event, btn) => {
    current = Number(btn.dataset.gotoEpisode);
    paint();
    $('[data-watch-player]', root)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('[data-w-prev]', root)?.addEventListener('click', () => { if (current > 1) { current -= 1; paint(); } });
  $('[data-w-next]', root)?.addEventListener('click', () => { if (current < total) { current += 1; paint(); } });

  paint();

  // 48 — countdown to the next simulcast slot (next Saturday, 17:00 local)
  const cd = $('[data-countdown]');
  if (cd) {
    const target = new Date();
    target.setDate(target.getDate() + ((6 - target.getDay() + 7) % 7 || 7));
    target.setHours(17, 0, 0, 0);
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const days = Math.floor(diff / 864e5);
      const hours = Math.floor((diff / 36e5) % 24);
      const mins = Math.floor((diff / 6e4) % 60);
      const secs = Math.floor((diff / 1e3) % 60);
      const put = (u, v) => { const el = $(`[data-cd="${u}"]`, cd); if (el) el.textContent = String(v).padStart(2, '0'); };
      put('days', days); put('hours', hours); put('minutes', mins); put('seconds', secs);
    };
    tick();
    setInterval(tick, 1000);
  }
}

/* 49 — dashboard -------------------------------------------------------- */

async function initDashboard() {
  const root = $('[data-dashboard]');
  if (!root) return;
  const { anime } = await getCatalogue();
  const progress = getProgress();
  const watchlist = getWatchlist();

  const stats = {
    watching: Object.keys(progress).length,
    saved: watchlist.length,
    hours: Object.values(progress).reduce((sum, p) => sum + Math.round((p.episode * 24) / 60), 0),
    streak: storage.get('af-streak', 7)
  };
  Object.entries(stats).forEach(([key, value]) => {
    const el = $(`[data-stat="${key}"]`, root);
    if (el) { el.dataset.count = String(value); el.textContent = '0'; }
  });

  const host = $('[data-continue-grid]', root);
  if (host) {
    const seeded = root.dataset.seed ? JSON.parse(root.dataset.seed) : [];
    const entries = Object.entries(progress)
      .map(([slug, p]) => ({ slug, episode: p.episode, progress: p.percent, at: p.at }))
      .sort((a, b) => b.at - a.at);
    const items = (entries.length ? entries : seeded)
      .map((e) => ({ ...e, item: anime.find((a) => a.slug === e.slug) }))
      .filter((e) => e.item)
      .slice(0, 4);

    host.innerHTML = items.length ? items.map(({ item, episode, progress: pct }) => `
      <article class="af-continue" data-slug="${item.slug}" data-title="${escapeHtml(item.title)}">
        <a href="watch.html?id=${item.slug}&ep=${episode}" class="af-continue-media">
          <img src="assets/img/backdrops/${item.slug}.svg" alt="" width="1280" height="720" loading="lazy" decoding="async"
               onerror="this.src='assets/img/posters/${item.slug}.svg'">
          <span class="af-continue-play">${icon('play-fill')}</span>
        </a>
        <div class="af-continue-body">
          <h3><a href="watch.html?id=${item.slug}&ep=${episode}">${escapeHtml(item.title)}</a></h3>
          <p class="af-muted">Episode ${episode} · ${Math.max(0, 100 - pct)}% left</p>
          <div class="progress af-progress af-progress-xs" role="progressbar" aria-label="${escapeHtml(item.title)} progress" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:${pct}%"></div></div>
        </div>
      </article>`).join('')
      : `<p class="af-muted">Nothing in progress yet — press play on anything and it will appear here.</p>`;
  }

  const fav = $('[data-favourites-grid]', root);
  if (fav) {
    const items = watchlist.map((s) => anime.find((a) => a.slug === s)).filter(Boolean).slice(0, 6);
    fav.innerHTML = items.length
      ? items.map((a) => cardHTML(a)).join('')
      : `<p class="af-muted" style="grid-column:1/-1">Your favourites will show up here once you heart a few titles.</p>`;
    syncButtons(fav);
  }

  document.dispatchEvent(new CustomEvent('af:cardsrendered', { detail: { root } }));
}

/* 50 — pricing ---------------------------------------------------------- */

function initPricing() {
  const toggle = $('[data-billing-toggle]');
  if (!toggle) return;
  const apply = () => {
    const yearly = toggle.checked;
    $$('[data-price-monthly]').forEach((el) => {
      const value = Number(yearly ? el.dataset.priceYearly : el.dataset.priceMonthly);
      el.textContent = value === 0 ? '0' : value.toFixed(2).replace(/\.00$/, '');
    });
    $$('[data-price-period]').forEach((el) => { el.textContent = yearly ? '/year' : '/month'; });
    $$('[data-billing-save]').forEach((el) => { el.hidden = !yearly; });
  };
  toggle.addEventListener('change', apply);
  apply();
}

/* 51 — blog post -------------------------------------------------------- */

async function initBlogPost() {
  const root = $('[data-post]');
  if (!root) return;
  const posts = await getPosts();
  if (!posts.length) return;
  const slug = params().get('slug');
  const post = posts.find((p) => p.slug === slug) || posts[0];
  const article = $(`[data-post-body="${post.slug}"]`);

  $$('[data-post-body]').forEach((el) => { el.hidden = el !== article; });
  if (article) {
    document.title = `${post.title} · AnimeFlow Pro`;
    $('[data-post-title]', root).textContent = post.title;
    $('[data-post-date]', root).textContent = post.date;
    $('[data-post-read]', root).textContent = `${post.readingTime} min read`;
    $('[data-post-category]', root).textContent = post.category;
    $('[data-post-author]', root).textContent = post.author;
    const cover = $('[data-post-cover]', root);
    if (cover) cover.src = `assets/img/backdrops/${post.cover}.svg`;
  }

  const more = $('[data-post-more]', root);
  if (more) {
    const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
    more.innerHTML = others.map((p) => `<article class="af-post">
      <a class="af-post-media" href="blog-post.html?slug=${p.slug}" tabindex="-1" aria-hidden="true">
        <img src="assets/img/backdrops/${p.cover}.svg" alt="" width="1280" height="720" loading="lazy" decoding="async"></a>
      <div class="af-post-body">
        <div class="af-post-meta"><span class="badge af-badge af-badge-soft">${escapeHtml(p.category)}</span><span class="af-muted">${escapeHtml(p.date)}</span></div>
        <h3><a href="blog-post.html?slug=${p.slug}">${escapeHtml(p.title)}</a></h3>
      </div></article>`).join('');
  }
}

/* 52 — share ------------------------------------------------------------ */

function initShare() {
  on(document, 'click', '[data-share]', async (event, btn) => {
    event.preventDefault();
    const data = { title: document.title, url: location.href };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(location.href);
      toast('Link copied', 'Paste it wherever you like.', 'success');
    } catch (err) {
      if (err?.name !== 'AbortError') toast('Could not share', 'Copy the address bar instead.', 'warning');
    }
  });
}

export function initPages() {
  initDetails();
  initWatch();
  initDashboard();
  initPricing();
  initBlogPost();
  initShare();
}
