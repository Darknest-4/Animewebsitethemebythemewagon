import * as C from '../lib/components.js';

const { btn, icon, badge, esc } = C;

const show = (title, fn, demo) => `<section class="af-showcase" id="c-${fn.toLowerCase()}">
  <header class="af-showcase-head"><h3>${esc(title)}</h3><span>${esc(fn)}</span></header>
  <div class="af-showcase-demo">${demo}</div>
</section>`;

export const meta = {
  path: 'components.html',
  title: 'Component library',
  description: 'Every UI block in AnimeFlow Pro on one page, with the function that renders it — buttons, cards, rails, pricing, forms, toasts and more.',
  priority: '0.7'
};

export function render(ctx) {
  const { anime, plans, testimonials, team, faqs, genres, studios } = ctx;
  const sample = anime[0];

  const groups = [
    {
      title: 'Foundations',
      items: [
        show('Buttons', 'btn()', `
          ${btn({ label: 'Primary', variant: 'primary' })}
          ${btn({ label: 'Gradient', variant: 'gradient' })}
          ${btn({ label: 'Outline', variant: 'outline-light' })}
          ${btn({ label: 'Ghost', variant: 'ghost' })}
          ${btn({ label: 'With icon', variant: 'primary', icon: 'play-fill' })}
          ${btn({ label: 'Small', variant: 'primary', size: 'sm' })}
          <button type="button" class="af-icon-btn border" aria-label="Icon only">${icon('heart')}</button>`),
        show('Badges', 'badge()', ['primary', 'soft', 'info', 'success', 'warning', 'danger']
          .map((v) => badge(v[0].toUpperCase() + v.slice(1), v)).join(' ')),
        show('Pills & chips', 'genrePill() / chip()',
          `<div class="af-pill-row">${genres.slice(0, 5).map((g) => C.genrePill(g)).join('')}</div>
           <div class="af-pill-row">${C.chip('Action')}${C.chip('MAPPA')}${C.chip('8.5+ rating')}</div>`),
        show('Rating', 'ratingStars()',
          `<div class="af-stack-sm">${C.ratingStars(9.3)}${C.ratingStars(7.4, { size: 'af-rating-sm' })}${C.ratingStars(5.1, { size: 'af-rating-lg' })}</div>`),
        show('Progress', 'progressBar()',
          `<div style="width:min(24rem,100%)" class="af-stack-sm">${C.progressBar(72, { label: 'Series progress' })}${C.progressBar(28, { cls: 'af-progress-xs' })}</div>`),
        show('Avatars', 'avatarImg()',
          team.map((m) => C.avatarImg(m.name, 48)).join(' ')),
        show('Loader', 'loader()', C.loader()),
        show('Code block', 'codeBlock()', `<div style="width:100%">${C.codeBlock('<div class="af-card" data-slug="frieren">…</div>')}</div>`)
      ]
    },
    {
      title: 'Catalogue',
      items: [
        show('Poster card', 'animeCard()', `<div style="width:13.5rem">${C.animeCard(sample)}</div>`),
        show('Ranked card', 'animeCard({ showRank })', `<div style="width:13.5rem">${C.animeCard(anime[1], { showRank: 1 })}</div>`),
        show('Skeleton card', 'skeletonCard()', `<div style="width:13.5rem">${C.skeletonCard()}</div>`),
        show('Wide card', 'animeCardWide()', `<div style="width:min(30rem,100%)">${C.animeCardWide(anime[2])}</div>`),
        show('Rank list', 'rankList()', `<div style="width:min(26rem,100%)">${C.rankList(anime.slice(0, 5))}</div>`),
        show('Continue watching', 'continueCard()', `<div style="width:min(20rem,100%)">${C.continueCard(anime[3], { episode: 7, progress: 62 })}</div>`),
        show('Episode row', 'episodeItem()',
          `<ul class="af-episodes" style="width:min(30rem,100%)">
            ${C.episodeItem({ num: 1, title: 'The journey begins', duration: 24, slug: sample.slug, watched: true })}
            ${C.episodeItem({ num: 2, title: 'An unexpected ally', duration: 24, slug: sample.slug, progress: 48 })}
          </ul>`),
        show('Rail', 'rail()', `<div style="width:100%">${C.rail({ title: 'Trending', items: anime.slice(0, 8) })}</div>`)
      ]
    },
    {
      title: 'Structure',
      items: [
        show('Section header', 'sectionHeader()', `<div style="width:100%">${C.sectionHeader({ eyebrow: 'Eyebrow', title: 'Section title', text: 'A supporting line of copy.', link: '#', linkLabel: 'View all' })}</div>`),
        show('Breadcrumb', 'breadcrumb()', C.breadcrumb([{ label: 'Home', href: 'index.html' }, { label: 'Browse', href: 'browse.html' }, { label: 'Details' }])),
        show('Pagination', 'pagination()', `<div style="width:100%">${C.pagination(3, 8)}</div>`),
        show('Tabs', 'tabs()', `<div style="width:100%">${C.tabs([
          { label: 'Overview', content: '<p class="af-muted mb-0">Tab panels are Bootstrap tabs with our styling.</p>' },
          { label: 'Episodes', content: '<p class="af-muted mb-0">Second panel.</p>' },
          { label: 'Reviews', content: '<p class="af-muted mb-0">Third panel.</p>' }
        ], 'af-demo-tabs')}</div>`),
        show('Accordion', 'accordion()', `<div style="width:100%">${C.accordion(faqs.slice(0, 3), 'af-demo-acc')}</div>`),
        show('Timeline', 'timeline()', `<div style="width:min(30rem,100%)">${C.timeline([
          { title: 'Announced', when: 'January', text: 'Key visual and staff revealed.' },
          { title: 'Premiere', when: 'April', text: 'First three episodes screened.' }
        ])}</div>`),
        show('Info rows', 'infoRow()', `<dl style="width:min(28rem,100%)" class="m-0">${C.infoRow('Studio', 'Madhouse')}${C.infoRow('Status', 'Finished')}${C.infoRow('Audio', 'Japanese, English')}</dl>`),
        show('Table', 'compareTable()', `<div style="width:100%">${C.compareTable(plans)}</div>`)
      ]
    },
    {
      title: 'Feedback',
      items: [
        show('Alerts', 'alert()', `<div style="width:100%" class="af-stack-sm">
          ${C.alert({ variant: 'success', title: 'Saved.', text: 'Your watchlist is up to date.' })}
          ${C.alert({ variant: 'warning', title: 'Heads up.', text: 'This plan streams at 720p.' })}
          ${C.alert({ variant: 'danger', title: 'Failed.', text: 'We could not reach the catalogue.' })}
        </div>`),
        show('Callouts', 'callout()', `<div style="width:100%">
          ${C.callout('tip', 'Tip', '<p class="mb-0">Callouts are used throughout the documentation.</p>')}
          ${C.callout('warn', 'Careful', '<p class="mb-0">Changing the slug breaks saved watchlists.</p>')}
        </div>`),
        show('Toast', 'AnimeFlow.toast()', `${C.toastSample()}
          <div class="d-flex gap-2 flex-wrap">
            ${btn({ label: 'Success', variant: 'outline-light', size: 'sm', onclick: "AnimeFlow.toast('Added to watchlist','Frieren','success')" })}
            ${btn({ label: 'Error', variant: 'outline-light', size: 'sm', onclick: "AnimeFlow.toast('Something broke','Try again in a moment','danger')" })}
          </div>`),
        show('Empty state', 'emptyState()', `<div style="width:100%">${C.emptyState({
          title: 'Nothing here yet',
          text: 'Empty states carry the next action instead of just an apology.',
          action: btn({ label: 'Browse catalogue', href: 'browse.html', variant: 'primary' })
        })}</div>`),
        show('Countdown', 'countdown()', `<div style="width:min(24rem,100%)">${C.countdown()}</div>`),
        show('Statistics', 'statTile()', `<div class="af-stats" style="width:100%">${ctx.stats.map(C.statTile).join('')}</div>`)
      ]
    },
    {
      title: 'Forms',
      items: [
        show('Text fields', 'field()', `<div style="width:min(26rem,100%)">
          ${C.field({ id: 'demo-name', label: 'Display name', placeholder: 'Jane Doe', icon: 'person-circle' })}
          ${C.field({ id: 'demo-email', label: 'Email', type: 'email', placeholder: 'you@example.com', required: true, icon: 'envelope', help: 'We never share it.' })}
          ${C.field({ id: 'demo-msg', label: 'Message', rows: 3, placeholder: 'Say something…' })}
        </div>`),
        show('Switches', 'switchControl()', `<div style="width:min(26rem,100%)" class="af-stack-sm">
          ${C.switchControl({ id: 'demo-s1', label: 'Autoplay next episode', checked: true })}
          ${C.switchControl({ id: 'demo-s2', label: 'Save data on mobile', help: 'Caps playback at 720p.' })}
        </div>`),
        show('Password strength', 'data-password', `<div style="width:min(26rem,100%)">
          <label class="form-label" for="demo-pw">Password</label>
          <input class="form-control" type="password" id="demo-pw" data-password="demo-meter" placeholder="Type to see the meter">
          <div class="af-password-meter" id="demo-meter" data-score="0" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
          <p class="form-text" data-password-label>Use 12+ characters with a number and a symbol.</p>
        </div>`),
        show('Filter panel', 'filterPanel()', `<div style="width:min(20rem,100%)">${C.filterPanel({ genres: genres.slice(0, 6), studios: studios.slice(0, 6), idPrefix: 'demo' })}</div>`)
      ]
    },
    {
      title: 'Marketing',
      items: [
        show('Feature card', 'featureCard()', `<div style="width:min(22rem,100%)">${C.featureCard(ctx.features[0])}</div>`),
        show('Pricing card', 'pricingCard()', `<div style="width:min(22rem,100%)">${C.pricingCard(plans[1])}</div>`),
        show('Testimonial', 'testimonialCard()', `<div style="width:min(24rem,100%)">${C.testimonialCard(testimonials[0])}</div>`),
        show('Team card', 'teamCard()', `<div style="width:min(16rem,100%)">${C.teamCard(team[0])}</div>`),
        show('Blog card', 'blogCard()', `<div style="width:min(22rem,100%)">${ctx.posts[0] ? C.blogCard(ctx.posts[0]) : '<p class="af-muted">Add a markdown file to src/content/blog/</p>'}</div>`),
        show('Logo cloud', 'logoCloud()', `<div style="width:100%">${C.logoCloud(studios.slice(0, 6))}</div>`),
        show('CTA banner', 'ctaBanner()', `<div style="width:100%">${C.ctaBanner({
          title: 'Ready when you are',
          text: 'Drop the folder on a host and you have a site.',
          primary: btn({ label: 'Get started', href: 'register.html', variant: 'primary' })
        })}</div>`)
      ]
    },
    {
      title: 'Media',
      items: [
        show('Video facade', 'videoFacade()', `<div style="width:min(32rem,100%)">${C.videoFacade({
          id: 'dQw4w9WgXcQ', title: 'Sample trailer', poster: `assets/img/backdrops/${sample.slug}.svg`
        })}</div>`),
        show('Gallery + lightbox', 'gallery()', `<div style="width:100%">${C.gallery(anime.slice(0, 4).map((a) => ({ slug: a.slug, caption: `${a.title} — key art` })))}</div>`),
        show('Comment', 'commentItem()', `<div style="width:min(34rem,100%)">${C.commentItem({
          name: 'Yuki Tanaka', when: '2 days ago', rating: 9.4,
          text: 'The pacing is the whole point. Nothing is rushed.'
        })}</div>`)
      ]
    }
  ];

  return `
<section class="container af-page-head">
  ${C.breadcrumb([{ label: 'Home', href: 'index.html' }, { label: 'Components' }])}
  <h1>Component library</h1>
  <p>Every block below is a function in <code>src/lib/components.js</code>, rendered at build time into plain HTML. Copy the markup straight out of the built page — there is no runtime templating to untangle.</p>
</section>

<section class="container">
  <div class="af-docs">
    <nav class="af-docs-side" aria-label="Components">
      ${groups.map((g) => `<p class="af-docs-heading">${esc(g.title)}</p>
      <ul>${g.items.map((html) => {
        const id = html.match(/id="(c-[^"]+)"/)[1];
        const name = html.match(/<h3>([^<]+)<\/h3>/)[1];
        return `<li><a href="#${id}">${name}</a></li>`;
      }).join('')}</ul>`).join('\n      ')}
    </nav>

    <div>
      ${groups.map((g) => `<h2 class="h4 mt-5 mb-3">${esc(g.title)}</h2>${g.items.join('\n      ')}`).join('\n      ')}
    </div>
  </div>
</section>`;
}
