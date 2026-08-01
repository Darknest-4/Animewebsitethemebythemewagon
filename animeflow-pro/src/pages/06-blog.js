import {
  btn, icon, breadcrumb, blogCard, sectionHeader, avatarImg, esc, badge, pagination
} from '../lib/components.js';

/** blog.html — index of the markdown articles in src/content/blog/. */
function blogIndex(ctx) {
  const { posts, site } = ctx;
  const [featured, ...rest] = posts;
  const categories = [...new Set(posts.map((p) => p.category))];

  return {
    meta: {
      path: 'blog.html',
      title: 'Blog',
      description: 'Articles on front-end engineering, design systems and accessibility from the team behind AnimeFlow Pro.',
      priority: '0.7'
    },
    body: `
<section class="container af-page-head">
  ${breadcrumb([{ label: 'Home', href: 'index.html' }, { label: 'Blog' }])}
  <h1>Notes from the build</h1>
  <p>Written in Markdown, rendered at build time. Drop a new <code>.md</code> file into <code>src/content/blog/</code> and it shows up here.</p>
</section>

<section class="container">
  <div class="af-pill-row mb-4">
    <button type="button" class="af-pill is-active">All</button>
    ${categories.map((c) => `<button type="button" class="af-pill">${esc(c)}</button>`).join('')}
  </div>

  ${featured ? blogCard(featured, { featured: true }) : ''}

  <div class="row g-4 mt-1">
    ${rest.map((p) => `<div class="col-md-6 col-lg-4">${blogCard(p)}</div>`).join('\n    ')}
  </div>

  ${pagination(1, 4)}
</section>

<section class="container af-section">
  <div class="af-panel p-4 p-lg-5 text-center">
    <h2 class="h4">One email a week, no filler</h2>
    <p class="af-muted mx-auto" style="max-width:44ch">New articles, template updates and the occasional thing we broke in production.</p>
    <form class="af-newsletter mx-auto" data-newsletter novalidate style="max-width:26rem">
      <div class="af-newsletter-row">
        <label class="visually-hidden" for="af-blog-email">Email address</label>
        <input class="form-control" type="email" id="af-blog-email" placeholder="you@example.com" autocomplete="email" required>
        ${btn({ label: 'Subscribe', variant: 'primary', type: 'submit' })}
      </div>
      <p class="invalid-feedback" data-error></p>
    </form>
  </div>
</section>`
  };
}

/**
 * blog-post.html — every article is rendered into the page and the right one
 * is revealed from ?slug=. That keeps the whole blog to a single HTML file
 * while staying fully static and indexable.
 */
function blogPost(ctx) {
  const { posts } = ctx;
  const first = posts[0];
  if (!first) return null;

  return {
    meta: {
      path: 'blog-post.html',
      title: first.title,
      description: first.excerpt,
      ogType: 'article',
      priority: '0.6',
      breadcrumbLd: [{ label: 'Home', href: 'index.html' }, { label: 'Blog', href: 'blog.html' }, { label: 'Article' }],
      jsonLd: [{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: first.title,
        description: first.excerpt,
        datePublished: first.date,
        author: { '@type': 'Person', name: first.author },
        publisher: { '@type': 'Organization', name: ctx.site.name }
      }]
    },
    body: `
<article data-post>
  <section class="container af-page-head">
    ${breadcrumb([{ label: 'Home', href: 'index.html' }, { label: 'Blog', href: 'blog.html' }, { label: 'Article' }])}
    <div class="af-post-meta mt-3 mb-2">
      <span class="badge af-badge af-badge-primary" data-post-category>${esc(first.category)}</span>
      <span class="af-muted"><span data-post-date>${esc(first.date)}</span> · <span data-post-read>${first.readingTime} min read</span></span>
    </div>
    <h1 data-post-title>${esc(first.title)}</h1>
    <div class="af-post-author mt-3">
      ${avatarImg(first.author, 36)}<span data-post-author>${esc(first.author)}</span>
      <span class="af-dot"></span>
      <button type="button" class="af-ghost-btn" data-share>${icon('share')} Share</button>
    </div>
  </section>

  <section class="container">
    <img class="w-100" data-post-cover src="assets/img/backdrops/${esc(first.cover)}.svg" alt="" width="1280" height="720"
         style="border-radius:var(--af-radius-xl);aspect-ratio:16/9;object-fit:cover" fetchpriority="high">
  </section>

  <section class="container af-section">
    <div class="row g-5">
      <div class="col-lg-8">
        ${posts.map((p, i) => `<div class="af-prose" data-post-body="${esc(p.slug)}"${i === 0 ? '' : ' hidden'}>${p.html}</div>`).join('\n        ')}

        <div class="af-panel p-4 mt-5 d-flex flex-wrap align-items-center gap-3">
          ${avatarImg(first.author, 56)}
          <div class="flex-grow-1">
            <b>Written by ${esc(first.author)}</b>
            <p class="af-muted mb-0" style="font-size:.9rem">Part of the four-person team behind AnimeFlow Pro.</p>
          </div>
          ${btn({ label: 'All articles', href: 'blog.html', variant: 'outline-light', size: 'sm' })}
        </div>
      </div>

      <aside class="col-lg-4">
        <div class="af-panel p-4 af-stack" style="position:sticky;top:calc(var(--af-header-h) + 1rem)">
          <h2 class="h6 mb-0">More from the blog</h2>
          <div class="af-stack" data-post-more></div>
        </div>
      </aside>
    </div>
  </section>
</article>`
  };
}

export async function pages(ctx) {
  return [blogIndex(ctx), blogPost(ctx)].filter(Boolean);
}
