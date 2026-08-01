/**
 * AnimeFlow Pro — component library.
 *
 * Every visual block in the template is a function here that returns an HTML
 * string. Pages compose them; `components.html` renders one of each with its
 * markup shown next to it. Nothing in this file runs in the browser — it is
 * build-time only, so the output stays plain, editable HTML.
 */

export const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const attrs = (o = {}) =>
  Object.entries(o).filter(([, v]) => v !== false && v != null)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`)).join('');

/* ------------------------------------------------------------- primitives */

/** 1. Icon — pulls a symbol out of the inlined sprite. */
export const icon = (name, cls = '') =>
  `<svg class="af-icon ${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;

/** 2. Button — renders as <a> when given an href, <button> otherwise. */
export function btn({
  label, href, variant = 'primary', size = '', icon: ic, iconEnd, cls = '',
  type = 'button', srOnly = false, ...rest
} = {}) {
  const tag = href ? 'a' : 'button';
  const classes = ['btn', `btn-${variant}`, size && `btn-${size}`, cls].filter(Boolean).join(' ');
  const inner = [
    ic && icon(ic),
    label && (srOnly ? `<span class="visually-hidden">${esc(label)}</span>` : `<span>${esc(label)}</span>`),
    iconEnd && icon(iconEnd)
  ].filter(Boolean).join('');
  return `<${tag} class="${classes}"${href ? ` href="${esc(href)}"` : ` type="${type}"`}${attrs(rest)}>${inner}</${tag}>`;
}

/** 3. Badge. */
export const badge = (label, variant = 'primary', cls = '') =>
  `<span class="badge af-badge af-badge-${variant} ${cls}">${esc(label)}</span>`;

/** 4. Star rating — accessible: the number is the label, stars are decoration. */
export function ratingStars(value, { showValue = true, size = '' } = {}) {
  const rounded = Math.round(value) / 2;
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = value / 2 - i;
    if (filled >= 0.75) return icon('star-fill');
    if (filled >= 0.25) return icon('star-half');
    return icon('star');
  }).join('');
  return `<span class="af-rating ${size}" role="img" aria-label="Rated ${value} out of 10">
    <span class="af-rating-stars" aria-hidden="true">${stars}</span>
    ${showValue ? `<b>${value.toFixed(1)}</b>` : ''}
  </span>`.replace(/\s+/g, ' ');
}

/** 5. Avatar. */
export const avatarImg = (name, size = 40, cls = '') =>
  `<img class="af-avatar ${cls}" src="assets/img/avatars/${slug(name)}.svg" alt="${esc(name)}" width="${size}" height="${size}" loading="lazy" decoding="async">`;

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** 6. Progress bar. */
export const progressBar = (value, { label = '', cls = '' } = {}) =>
  `<div class="progress af-progress ${cls}" role="progressbar" aria-label="${esc(label || 'Progress')}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100">
    <div class="progress-bar" style="width:${value}%"></div>
  </div>`;

/** 7. Genre pill. */
export const genrePill = (g, href = `browse.html?genre=${encodeURIComponent(g)}`) =>
  `<a class="af-pill" href="${esc(href)}">${esc(g)}</a>`;

/** 8. Chip / removable tag. */
export const chip = (label, { removable = true, value = label } = {}) =>
  `<span class="af-chip" data-chip="${esc(value)}">${esc(label)}${removable ? `<button type="button" class="af-chip-x" data-chip-remove aria-label="Remove ${esc(label)}">${icon('x-lg')}</button>` : ''}</span>`;

/* ------------------------------------------------------------------ cards */

const posterImg = (a, { lazy = true, sizes = '(min-width:1200px) 220px, (min-width:768px) 25vw, 42vw' } = {}) =>
  `<img class="af-poster-img" src="assets/img/posters/${a.slug}.svg" alt="${esc(a.title)}" width="400" height="600" sizes="${sizes}"${lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high" decoding="sync"'}>`;

export const metaLine = (a) =>
  [a.year, a.type, a.episodes ? `${a.episodes} ep` : null].filter(Boolean).join(' · ');

/** 9. Anime poster card — the workhorse of the whole template. */
export function animeCard(a, { lazy = true, showRank = 0, cls = '' } = {}) {
  return `<article class="af-card ${cls}" data-slug="${a.slug}" data-genres="${esc(a.genres.join(','))}" data-year="${a.year}" data-rating="${a.rating}" data-status="${a.status}" data-type="${a.type}" data-title="${esc(a.title)}">
  <div class="af-poster">
    <a class="af-poster-link" href="anime-details.html?id=${a.slug}" aria-label="${esc(a.title)} details">
      ${posterImg(a, { lazy })}
    </a>
    ${showRank ? `<span class="af-rank" aria-hidden="true">${showRank}</span>` : ''}
    ${a.status === 'Upcoming' ? badge('Upcoming', 'info', 'af-card-flag') : a.rating >= 8.6 ? badge('Top rated', 'warning', 'af-card-flag') : ''}
    <div class="af-poster-overlay">
      <a class="af-play" href="watch.html?id=${a.slug}" aria-label="Watch ${esc(a.title)}">${icon('play-fill')}</a>
      <div class="af-poster-actions">
        <button type="button" class="af-icon-btn" data-watchlist="${a.slug}" aria-pressed="false" aria-label="Add ${esc(a.title)} to watchlist">${icon('heart')}${icon('heart-fill', 'af-icon-on')}</button>
        <button type="button" class="af-icon-btn" data-preview="${a.slug}" aria-label="Preview ${esc(a.title)} trailer">${icon('play-circle-fill')}</button>
      </div>
    </div>
  </div>
  <div class="af-card-body">
    <h3 class="af-card-title"><a href="anime-details.html?id=${a.slug}">${esc(a.title)}</a></h3>
    <div class="af-card-meta">
      ${a.rating ? ratingStars(a.rating, { showValue: true, size: 'af-rating-sm' }) : `<span class="af-muted">Not yet rated</span>`}
      <span class="af-dot" aria-hidden="true"></span>
      <span class="af-muted">${esc(metaLine(a))}</span>
    </div>
  </div>
</article>`;
}

/** 10. Skeleton card — same box model as animeCard, so nothing shifts. */
export const skeletonCard = () => `<div class="af-card af-skeleton-card" aria-hidden="true">
  <div class="af-poster af-skeleton"></div>
  <div class="af-card-body">
    <div class="af-skeleton af-skeleton-line" style="width:80%"></div>
    <div class="af-skeleton af-skeleton-line" style="width:55%"></div>
  </div>
</div>`;

/** 11. Wide/landscape card for editorial rows. */
export function animeCardWide(a) {
  return `<article class="af-card-wide" data-slug="${a.slug}">
  <a class="af-card-wide-media" href="anime-details.html?id=${a.slug}" tabindex="-1" aria-hidden="true">
    <img src="assets/img/posters/${a.slug}.svg" alt="" width="400" height="600" loading="lazy" decoding="async">
  </a>
  <div class="af-card-wide-body">
    <div class="af-card-wide-tags">${a.genres.slice(0, 2).map((g) => badge(g, 'soft')).join('')}</div>
    <h3><a href="anime-details.html?id=${a.slug}">${esc(a.title)}</a></h3>
    <p class="af-muted af-clamp-2">${esc(a.synopsis)}</p>
    <div class="af-card-meta">${a.rating ? ratingStars(a.rating, { size: 'af-rating-sm' }) : ''}<span class="af-dot"></span><span class="af-muted">${esc(a.studio)}</span></div>
  </div>
</article>`;
}

/** 12. Numbered rank list (Top 10 sidebar). */
export const rankList = (items) => `<ol class="af-ranklist">
${items.map((a, i) => `  <li>
    <span class="af-ranklist-n">${String(i + 1).padStart(2, '0')}</span>
    <img src="assets/img/posters/${a.slug}.svg" alt="" width="400" height="600" loading="lazy" decoding="async">
    <span class="af-ranklist-body">
      <a href="anime-details.html?id=${a.slug}">${esc(a.title)}</a>
      <span class="af-muted">${esc(a.studio)} · ${a.year}</span>
    </span>
    <b class="af-ranklist-score">${a.rating.toFixed(1)}</b>
  </li>`).join('\n')}
</ol>`;

/** 13. Episode list row with resume progress. */
export function episodeItem({ num, title, duration, progress = 0, slug: s, watched = false }) {
  return `<li class="af-episode${watched ? ' is-watched' : ''}">
  <a class="af-episode-link" href="watch.html?id=${s}&ep=${num}">
    <span class="af-episode-thumb">${icon('play-fill')}<b>${num}</b></span>
    <span class="af-episode-body">
      <span class="af-episode-title">${esc(title)}</span>
      <span class="af-muted">${duration} min${watched ? ' · Watched' : ''}</span>
      ${progress ? progressBar(progress, { label: `Episode ${num} progress`, cls: 'af-progress-xs' }) : ''}
    </span>
  </a>
  <button type="button" class="af-icon-btn" data-watchlist="${s}-ep${num}" aria-pressed="false" aria-label="Bookmark episode ${num}">${icon('bookmark')}${icon('bookmark-fill', 'af-icon-on')}</button>
</li>`;
}

/** 14. Continue-watching card with resume bar. */
export const continueCard = (a, { episode, progress }) => `<article class="af-continue" data-slug="${a.slug}">
  <a href="watch.html?id=${a.slug}&ep=${episode}" class="af-continue-media">
    <img src="assets/img/backdrops/${a.slug}.svg" alt="" width="1280" height="720" loading="lazy" decoding="async" onerror="this.src='assets/img/posters/${a.slug}.svg'">
    <span class="af-continue-play">${icon('play-fill')}</span>
  </a>
  <div class="af-continue-body">
    <h3><a href="watch.html?id=${a.slug}&ep=${episode}">${esc(a.title)}</a></h3>
    <p class="af-muted">Episode ${episode} · ${100 - progress}% left</p>
    ${progressBar(progress, { label: `${a.title} progress`, cls: 'af-progress-xs' })}
  </div>
</article>`;

/* -------------------------------------------------------------- structure */

/** 15. Section header with optional link. */
export const sectionHeader = ({ eyebrow, title, text, link, linkLabel = 'View all', id } = {}) => `
<header class="af-section-head"${id ? ` id="${id}"` : ''}>
  <div>
    ${eyebrow ? `<p class="af-eyebrow">${esc(eyebrow)}</p>` : ''}
    <h2 class="af-section-title">${esc(title)}</h2>
    ${text ? `<p class="af-section-text">${esc(text)}</p>` : ''}
  </div>
  ${link ? `<a class="af-link-arrow" href="${esc(link)}">${esc(linkLabel)} ${icon('arrow-right')}</a>` : ''}
</header>`;

/** 16. Horizontal rail — drag/swipe scrolling with keyboard-reachable arrows. */
export function rail({ id, title, eyebrow, items, link, cards, showRank = false }) {
  const body = cards || items.map((a, i) => animeCard(a, { showRank: showRank ? i + 1 : 0 })).join('\n');
  return `<section class="af-rail-section" data-reveal>
  ${sectionHeader({ eyebrow, title, link, id })}
  <div class="af-rail" data-rail>
    <button type="button" class="af-rail-nav af-rail-prev" data-rail-prev aria-label="Scroll ${esc(title)} left" hidden>${icon('chevron-left')}</button>
    <div class="af-rail-track" data-rail-track tabindex="0" role="region" aria-label="${esc(title)}">
      ${body}
    </div>
    <button type="button" class="af-rail-nav af-rail-next" data-rail-next aria-label="Scroll ${esc(title)} right">${icon('chevron-right')}</button>
  </div>
</section>`;
}

/** 17. Breadcrumb. */
export const breadcrumb = (items) => `<nav class="af-breadcrumb" aria-label="Breadcrumb">
  <ol>${items.map((i, n) => `<li${n === items.length - 1 ? ' aria-current="page"' : ''}>${i.href ? `<a href="${esc(i.href)}">${esc(i.label)}</a>` : esc(i.label)}</li>`).join('')}</ol>
</nav>`;

/** 18. Pagination. */
export function pagination(current = 1, total = 6) {
  const page = (n) => `<li><a class="af-page${n === current ? ' is-active' : ''}" href="#"${n === current ? ' aria-current="page"' : ''}>${n}</a></li>`;
  const nums = Array.from({ length: total }, (_, i) => i + 1)
    .filter((n) => n === 1 || n === total || Math.abs(n - current) <= 1)
    .map((n, i, arr) => (i > 0 && n - arr[i - 1] > 1 ? `<li><span class="af-page-gap">…</span></li>${page(n)}` : page(n)))
    .join('');
  return `<nav class="af-pagination" aria-label="Pagination">
  <ul>
    <li><a class="af-page${current === 1 ? ' is-disabled' : ''}" href="#" aria-label="Previous page">${icon('chevron-left')}</a></li>
    ${nums}
    <li><a class="af-page" href="#" aria-label="Next page">${icon('chevron-right')}</a></li>
  </ul>
</nav>`;
}

/** 19. Empty state. */
export const emptyState = ({ icon: ic = 'collection-play', title, text, action = '' }) => `
<div class="af-empty">
  <span class="af-empty-icon">${icon(ic)}</span>
  <h3>${esc(title)}</h3>
  <p class="af-muted">${esc(text)}</p>
  ${action}
</div>`;

/** 20. Alert. */
export const alert = ({ variant = 'info', title, text, dismissible = true }) => `
<div class="alert af-alert af-alert-${variant}${dismissible ? ' alert-dismissible' : ''}" role="alert">
  ${icon(variant === 'success' ? 'check-circle-fill' : variant === 'danger' ? 'x-circle-fill' : variant === 'warning' ? 'exclamation-triangle-fill' : 'info-circle-fill')}
  <div><b>${esc(title)}</b> ${esc(text)}</div>
  ${dismissible ? '<button type="button" class="btn-close" data-af-dismiss=".alert" aria-label="Close"></button>' : ''}
</div>`;

/** 21. Stat tile with counted-up number. */
export const statTile = ({ value, suffix = '', label }) => `<div class="af-stat">
  <b class="af-stat-value" data-count="${value}" data-suffix="${esc(suffix)}">0${esc(suffix)}</b>
  <span class="af-stat-label">${esc(label)}</span>
</div>`;

/** 22. Feature card. */
export const featureCard = (f) => `<article class="af-feature" data-reveal>
  <span class="af-feature-icon">${icon(f.icon)}</span>
  <h3>${esc(f.title)}</h3>
  <p class="af-muted">${esc(f.text)}</p>
</article>`;

/** 23. Pricing card. */
export const pricingCard = (p) => `<article class="af-price${p.featured ? ' is-featured' : ''}">
  ${p.badge ? `<span class="af-price-badge">${esc(p.badge)}</span>` : ''}
  <h3 class="af-price-name">${esc(p.name)}</h3>
  <p class="af-muted">${esc(p.blurb)}</p>
  <p class="af-price-value">
    <span class="af-price-currency">$</span><b data-price-monthly="${p.monthly}" data-price-yearly="${p.yearly}">${p.monthly.toFixed(2).replace(/\.00$/, '')}</b>
    <span class="af-price-period" data-price-period>/month</span>
  </p>
  ${btn({ label: p.cta, href: 'register.html', variant: p.featured ? 'primary' : 'outline-light', cls: 'w-100' })}
  <ul class="af-price-list">
    ${p.features.map((f) => `<li class="${f.ok ? 'is-on' : 'is-off'}">${icon(f.ok ? 'check-lg' : 'x-lg')}<span>${esc(f.label)}</span></li>`).join('')}
  </ul>
</article>`;

/** 24. Testimonial. */
export const testimonialCard = (t) => `<figure class="af-quote">
  <span class="af-quote-mark">${icon('quote')}</span>
  <blockquote>${esc(t.quote)}</blockquote>
  <figcaption>${avatarImg(t.name, 44)}<span><b>${esc(t.name)}</b><span class="af-muted">${esc(t.role)}</span></span></figcaption>
</figure>`;

/** 25. Team member. */
export const teamCard = (m) => `<article class="af-team" data-reveal>
  ${avatarImg(m.name, 112, 'af-team-photo')}
  <h3>${esc(m.name)}</h3>
  <p class="af-muted">${esc(m.role)}</p>
</article>`;

/** 26. Blog card. */
export const blogCard = (post, { featured = false } = {}) => `<article class="af-post${featured ? ' is-featured' : ''}" data-reveal>
  <a class="af-post-media" href="blog-post.html?slug=${esc(post.slug)}" tabindex="-1" aria-hidden="true">
    <img src="assets/img/backdrops/${esc(post.cover)}.svg" alt="" width="1280" height="720" loading="lazy" decoding="async">
  </a>
  <div class="af-post-body">
    <div class="af-post-meta">${badge(post.category, 'soft')}<span class="af-muted">${esc(post.date)} · ${post.readingTime} min read</span></div>
    <h3><a href="blog-post.html?slug=${esc(post.slug)}">${esc(post.title)}</a></h3>
    <p class="af-muted af-clamp-3">${esc(post.excerpt)}</p>
    <div class="af-post-author">${avatarImg(post.author, 32)}<span>${esc(post.author)}</span></div>
  </div>
</article>`;

/** 27. Accordion (Bootstrap behaviour, restyled). */
export const accordion = (items, id = 'af-accordion') => `<div class="accordion af-accordion" id="${id}">
${items.map((it, i) => `  <div class="accordion-item">
    <h3 class="accordion-header">
      <button class="accordion-button${i === 0 ? '' : ' collapsed'}" type="button" data-af-collapse aria-expanded="${i === 0}" aria-controls="${id}-${i}">${esc(it.q)}</button>
    </h3>
    <div id="${id}-${i}" class="accordion-collapse collapse${i === 0 ? ' show' : ''}" data-af-parent="#${id}">
      <div class="accordion-body">${it.a}</div>
    </div>
  </div>`).join('\n')}
</div>`;

/** 28. Tabs. */
export const tabs = (items, id = 'af-tabs') => `<div class="af-tabs">
  <ul class="nav nav-tabs" role="tablist">
    ${items.map((t, i) => `<li class="nav-item" role="presentation">
      <button class="nav-link${i === 0 ? ' active' : ''}" id="${id}-t${i}" type="button" role="tab" aria-controls="${id}-p${i}" aria-selected="${i === 0}">${esc(t.label)}</button>
    </li>`).join('')}
  </ul>
  <div class="tab-content">
    ${items.map((t, i) => `<div class="tab-pane fade${i === 0 ? ' show active' : ''}" id="${id}-p${i}" role="tabpanel" aria-labelledby="${id}-t${i}" tabindex="0">${t.content}</div>`).join('')}
  </div>
</div>`;

/** 29. Form field. */
export function field({ id, label, type = 'text', placeholder = '', help, required = false, icon: ic, autocomplete, rows }) {
  const control = rows
    ? `<textarea class="form-control" id="${id}" name="${id}" rows="${rows}" placeholder="${esc(placeholder)}"${required ? ' required' : ''}></textarea>`
    : `<input class="form-control" type="${type}" id="${id}" name="${id}" placeholder="${esc(placeholder)}"${autocomplete ? ` autocomplete="${autocomplete}"` : ''}${required ? ' required' : ''}>`;
  return `<div class="af-field">
  <label class="form-label" for="${id}">${esc(label)}${required ? ' <span class="af-req" aria-hidden="true">*</span>' : ''}</label>
  <div class="af-control${ic ? ' has-icon' : ''}">${ic ? `<span class="af-control-icon">${icon(ic)}</span>` : ''}${control}</div>
  ${help ? `<p class="form-text">${esc(help)}</p>` : ''}
  <p class="invalid-feedback" data-error></p>
</div>`;
}

/** 30. Switch. */
export const switchControl = ({ id, label, checked = false, help }) => `<div class="form-check form-switch af-switch">
  <input class="form-check-input" type="checkbox" role="switch" id="${id}"${checked ? ' checked' : ''}>
  <label class="form-check-label" for="${id}">${esc(label)}${help ? `<span class="af-muted d-block">${esc(help)}</span>` : ''}</label>
</div>`;

/** 31. Comparison table. */
export const compareTable = (plans) => `<div class="table-responsive af-table-wrap">
  <table class="table af-table">
    <caption class="visually-hidden">Feature comparison across plans</caption>
    <thead><tr><th scope="col">Feature</th>${plans.map((p) => `<th scope="col">${esc(p.name)}</th>`).join('')}</tr></thead>
    <tbody>
      ${plans[0].features.map((_, row) => `<tr><th scope="row">${esc(plans[1].features[row].label)}</th>${plans.map((p) => `<td>${p.features[row].ok ? `<span class="af-yes">${icon('check-lg')}<span class="visually-hidden">Included</span></span>` : `<span class="af-no">${icon('dash-lg')}<span class="visually-hidden">Not included</span></span>`}</td>`).join('')}</tr>`).join('\n')}
    </tbody>
  </table>
</div>`;

/** 32. Video facade — loads the iframe only after a click. */
export const videoFacade = ({ id, title, poster: p, ratio = '16x9' }) => `<div class="af-video ratio ratio-${ratio}" data-video="${esc(id)}" data-title="${esc(title)}">
  <img src="${esc(p)}" alt="" width="1280" height="720" loading="lazy" decoding="async">
  <button type="button" class="af-video-play" data-video-play aria-label="Play ${esc(title)}">${icon('play-fill')}</button>
</div>`;

/** 33. Timeline. */
export const timeline = (items) => `<ol class="af-timeline">
${items.map((i) => `  <li><span class="af-timeline-dot"></span><b>${esc(i.title)}</b><span class="af-muted">${esc(i.when)}</span><p>${esc(i.text)}</p></li>`).join('\n')}
</ol>`;

/** 34. CTA banner. */
export const ctaBanner = ({ title, text, primary, secondary }) => `<section class="af-cta" data-reveal>
  <div class="af-cta-inner">
    <h2>${esc(title)}</h2>
    <p>${esc(text)}</p>
    <div class="af-cta-actions">${primary}${secondary || ''}</div>
  </div>
</section>`;

/** 35. Countdown to the next episode. */
export const countdown = (label = 'Next episode in') => `<div class="af-countdown" data-countdown>
  <span class="af-muted">${esc(label)}</span>
  <div class="af-countdown-grid">
    ${['days', 'hours', 'minutes', 'seconds'].map((u) => `<div><b data-cd="${u}">00</b><span>${u}</span></div>`).join('')}
  </div>
</div>`;

/** 36. Review / comment. */
export const commentItem = ({ name, when, text, rating, hue = 260 }) => `<article class="af-comment">
  ${avatarImg(name, 44)}
  <div>
    <header><b>${esc(name)}</b><span class="af-muted">${esc(when)}</span>${rating ? ratingStars(rating, { size: 'af-rating-sm' }) : ''}</header>
    <p>${esc(text)}</p>
    <div class="af-comment-actions">
      <button type="button" class="af-ghost-btn">${icon('heart')} Helpful</button>
      <button type="button" class="af-ghost-btn">${icon('chat-dots')} Reply</button>
    </div>
  </div>
</article>`;

/** 37. Lightbox-enabled gallery. */
export const gallery = (items) => `<div class="af-gallery" data-lightbox-group>
${items.map((it) => `  <button type="button" class="af-gallery-item" data-lightbox="assets/img/backdrops/${esc(it.slug)}.svg" data-caption="${esc(it.caption)}" aria-label="Open image: ${esc(it.caption)}">
    <img src="assets/img/backdrops/${esc(it.slug)}.svg" alt="${esc(it.caption)}" width="1280" height="720" loading="lazy" decoding="async">
  </button>`).join('\n')}
</div>`;

/** 38. Filter panel (shared by the browse sidebar and the mobile offcanvas). */
export const filterPanel = ({ genres, studios, idPrefix = 'f' }) => `
<form class="af-filters" data-filters>
  <div class="af-filter-group">
    <h3 class="af-filter-title">Sort by</h3>
    <select class="form-select" data-filter="sort" aria-label="Sort catalogue">
      <option value="popular">Most popular</option>
      <option value="rating">Highest rated</option>
      <option value="newest">Newest first</option>
      <option value="title">A → Z</option>
    </select>
  </div>
  <div class="af-filter-group">
    <h3 class="af-filter-title">Genre</h3>
    <div class="af-check-grid">
      ${genres.map((g, i) => `<div class="form-check"><input class="form-check-input" type="checkbox" value="${esc(g)}" id="${idPrefix}-g${i}" data-filter="genre"><label class="form-check-label" for="${idPrefix}-g${i}">${esc(g)}</label></div>`).join('')}
    </div>
  </div>
  <div class="af-filter-group">
    <h3 class="af-filter-title">Status</h3>
    <div class="af-check-grid">
      ${['Airing', 'Finished', 'Upcoming'].map((s, i) => `<div class="form-check"><input class="form-check-input" type="checkbox" value="${s}" id="${idPrefix}-s${i}" data-filter="status"><label class="form-check-label" for="${idPrefix}-s${i}">${s}</label></div>`).join('')}
    </div>
  </div>
  <div class="af-filter-group">
    <h3 class="af-filter-title">Studio</h3>
    <select class="form-select" data-filter="studio" aria-label="Filter by studio">
      <option value="">All studios</option>
      ${studios.map((s) => `<option value="${esc(s)}">${esc(s)}</option>`).join('')}
    </select>
  </div>
  <div class="af-filter-group">
    <h3 class="af-filter-title">Minimum rating <output data-filter-out="score">0.0</output></h3>
    <input type="range" class="form-range" min="0" max="9.5" step="0.5" value="0" data-filter="score" aria-label="Minimum rating">
  </div>
  <div class="af-filter-actions">
    ${btn({ label: 'Reset filters', variant: 'outline-light', cls: 'w-100', 'data-filter-reset': true })}
  </div>
</form>`;

/** 39. Code sample block with a copy button (used across the docs pages). */
export const codeBlock = (code, lang = 'html') => `<div class="af-code">
  <button type="button" class="af-code-copy" data-copy aria-label="Copy code">${icon('clipboard-check')}<span>Copy</span></button>
  <pre><code class="language-${lang}">${esc(code)}</code></pre>
</div>`;

/** 40. Loader / spinner. */
export const loader = (label = 'Loading') => `<div class="af-loader" role="status">
  <span class="af-loader-ring" aria-hidden="true"></span><span class="visually-hidden">${esc(label)}</span>
</div>`;

/** 41. Toast (markup reference — the JS clones this shape at runtime). */
export const toastSample = () => `<div class="af-toast af-toast-success" role="status">
  ${icon('check-circle-fill')}<div><b>Added to watchlist</b><span>Frieren: Beyond Journey's End</span></div>
  <button type="button" class="af-toast-x" aria-label="Dismiss">${icon('x-lg')}</button>
</div>`;

/** 42. Logo cloud. */
export const logoCloud = (names) => `<ul class="af-logos">
${names.map((n) => `  <li><span>${esc(n)}</span></li>`).join('\n')}
</ul>`;

/** 43. Media object / info row. */
export const infoRow = (label, value) =>
  `<div class="af-info-row"><dt>${esc(label)}</dt><dd>${value}</dd></div>`;

/** 44. Notice / callout used in the documentation. */
export const callout = (kind, title, html) => `<div class="af-callout af-callout-${kind}">
  ${icon(kind === 'warn' ? 'exclamation-triangle-fill' : kind === 'tip' ? 'lightning-charge' : 'info-circle-fill')}
  <div><b>${esc(title)}</b>${html}</div>
</div>`;
