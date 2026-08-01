import {
  btn, icon, rail, animeCard, sectionHeader, statTile, featureCard, testimonialCard,
  ctaBanner, rankList, genrePill, esc, ratingStars, logoCloud
} from '../lib/components.js';

export const meta = {
  path: 'index.html',
  title: 'Home',
  description:
    'AnimeFlow Pro — a Bootstrap 5.3 streaming template with 20 pages, 40+ components, dark and light themes, live search, watchlists and no jQuery.',
  priority: '1.0',
  changefreq: 'daily',
  preconnect: ['https://www.youtube-nocookie.com']
};

export function render(ctx) {
  const { anime, genres, stats, features, testimonials, studios } = ctx;
  const featured = anime.find((a) => a.slug === 'frieren-beyond-journeys-end') || anime[0];
  const trending = anime.filter((a) => a.tags.includes('trending'));
  const top = [...anime].filter((a) => a.rating).sort((a, b) => b.rating - a.rating).slice(0, 12);
  const upcoming = anime.filter((a) => a.status === 'Upcoming');
  const popular = anime.filter((a) => a.tags.includes('popular'));
  const fresh = anime.filter((a) => a.tags.includes('new') || a.year >= 2024).slice(0, 12);

  return `
<section class="af-hero">
  <div class="af-hero-bg">
    <img src="assets/img/backdrops/${featured.slug}.svg" alt="" width="1280" height="720" fetchpriority="high" decoding="sync">
  </div>
  <span class="af-blob af-blob-1"></span>
  <span class="af-blob af-blob-2"></span>
  <span class="af-blob af-blob-3"></span>

  <div class="container">
    <div class="af-hero-grid">
      <div class="af-hero-copy">
        <span class="af-hero-tag">${icon('stars')} New season · <b data-typewriter="Frieren S2|Solo Leveling S3|One Punch Man S3|Vinland Saga S3">Frieren S2</b></span>
        <h1>Every series you love,<br><span class="af-gradient-text">one beautiful player</span></h1>
        <p>A streaming interface that does not fight you: instant search, a watchlist that survives reloads, dark and light themes tuned by hand, and not a single kilobyte of jQuery.</p>
        <div class="af-hero-actions">
          ${btn({ label: 'Start watching free', href: 'register.html', variant: 'primary', icon: 'play-fill' })}
          ${btn({ label: 'Browse catalogue', href: 'browse.html', variant: 'outline-light', icon: 'grid' })}
        </div>
        <div class="af-hero-meta">
          <span>${icon('badge-hd')} 4K HDR</span>
          <span>${icon('cloud-arrow-down')} Offline downloads</span>
          <span>${icon('badge-cc')} 40+ subtitle tracks</span>
          <span>${icon('shield-check')} Cancel any time</span>
        </div>
      </div>

      <div class="af-hero-stage" data-reveal="zoom">
        <div class="af-hero-card">
          <img src="assets/img/posters/${featured.slug}.svg" alt="${esc(featured.title)} key art" width="400" height="600" fetchpriority="high" decoding="sync">
          <div class="af-hero-card-info">
            <b>${esc(featured.title)}</b>
            <span>${esc(featured.studio)} · ${featured.year} · ${featured.episodes} episodes</span>
          </div>
        </div>
        <div class="af-hero-float af-hero-float-1">${icon('star-fill')} ${featured.rating.toFixed(1)} average</div>
        <div class="af-hero-float af-hero-float-2">${icon('people')} 2.4M watching</div>
      </div>
    </div>
  </div>
</section>

<section class="container" aria-label="Browse by genre">
  <div class="af-genre-strip">
    <a class="af-pill is-active" href="browse.html">All</a>
    ${genres.map((g) => genrePill(g)).join('')}
  </div>
</section>

<div class="container">
  ${rail({
    id: 'trending',
    eyebrow: 'Updated hourly',
    title: 'Trending this week',
    items: trending,
    link: 'browse.html?sort=popular'
  })}

  <section class="af-section" data-reveal>
    <div class="row g-4 align-items-start">
      <div class="col-lg-8">
        ${sectionHeader({ eyebrow: 'Critically adored', title: 'Top rated of all time', link: 'browse.html?sort=rating', id: 'top' })}
        <div class="af-grid">
          ${top.slice(0, 10).map((a) => animeCard(a)).join('\n          ')}
        </div>
      </div>
      <aside class="col-lg-4">
        <div class="af-panel p-3 p-lg-4">
          <h2 class="h6 d-flex align-items-center gap-2 mb-3">${icon('trophy')} Community top 10</h2>
          ${rankList(top.slice(0, 10))}
        </div>
      </aside>
    </div>
  </section>

  ${rail({
    id: 'upcoming',
    eyebrow: 'Announced',
    title: 'Coming next season',
    items: upcoming.concat(fresh).slice(0, 12),
    link: 'schedule.html'
  })}

  ${rail({
    eyebrow: 'Everyone is watching',
    title: 'Popular right now',
    items: popular,
    link: 'browse.html'
  })}
</div>

<section class="container af-section" data-reveal>
  <div class="af-stats">
    ${stats.map(statTile).join('\n    ')}
  </div>
</section>

<section class="container af-section af-defer-paint">
  ${sectionHeader({
    eyebrow: 'Why this template',
    title: 'Built the way you would have built it',
    text: 'No page builder output, no thousand-line stylesheet of overrides. Semantic markup, SCSS variables and small modules you can actually read.'
  })}
  <div class="row g-4">
    ${features.map((f) => `<div class="col-sm-6 col-lg-4">${featureCard(f)}</div>`).join('\n    ')}
  </div>
</section>

<section class="container af-section af-defer-paint">
  ${sectionHeader({ eyebrow: 'Straight from the studios', title: 'Simulcast partners' })}
  ${logoCloud(studios.slice(0, 8))}
</section>

<section class="container af-section af-defer-paint">
  ${sectionHeader({ eyebrow: 'Reviews', title: 'What developers say' })}
  <div class="row g-4">
    ${testimonials.map((t) => `<div class="col-md-4" data-reveal>${testimonialCard(t)}</div>`).join('\n    ')}
  </div>
</section>

<section class="container af-section">
  ${ctaBanner({
    title: 'Ship your streaming front-end this week',
    text: 'Twenty pages, forty components and thirty-eight behaviours, all documented. Download it, point it at your API, and go.',
    primary: btn({ label: 'See pricing', href: 'pricing.html', variant: 'primary', icon: 'tag' }),
    secondary: btn({ label: 'Read the docs', href: 'documentation.html', variant: 'outline-light', icon: 'journal-text' })
  })}
</section>`;
}
