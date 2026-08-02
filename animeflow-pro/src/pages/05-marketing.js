import {
  btn, icon, breadcrumb, sectionHeader, pricingCard, compareTable, accordion,
  statTile, teamCard, testimonialCard, timeline, field, ctaBanner, esc, callout
} from '../lib/components.js';

/** pricing.html */
function pricing(ctx) {
  const { plans, faqs } = ctx;
  return {
    meta: {
      path: 'pricing.html',
      title: 'Pricing',
      description: 'Three plans — Starter, Premium and VIP — with a monthly/yearly toggle and a full feature comparison.',
      priority: '0.9',
      jsonLd: [{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'AnimeFlow Premium',
        description: 'Ad-free streaming with 1080p playback, four concurrent devices and offline downloads.',
        offers: plans.filter((p) => p.monthly > 0).map((p) => ({
          '@type': 'Offer', name: p.name, price: p.monthly.toFixed(2),
          priceCurrency: 'USD', availability: 'https://schema.org/InStock'
        }))
      }]
    },
    body: `
<section class="container af-page-head text-center">
  ${breadcrumb([{ label: 'Home', href: 'index.html' }, { label: 'Pricing' }])}
  <h1 class="mt-3">Simple plans, no surprises</h1>
  <p class="mx-auto">Every plan includes the full catalogue. The difference is resolution, devices and whether you see ads.</p>
  <div class="d-flex justify-content-center mt-4">
    <div class="af-billing-toggle">
      <span id="af-bill-m">Monthly</span>
      <div class="form-check form-switch m-0">
        <input class="form-check-input" type="checkbox" role="switch" id="af-billing" data-billing-toggle aria-labelledby="af-bill-m af-bill-y">
        <label class="form-check-label visually-hidden" for="af-billing">Bill yearly</label>
      </div>
      <span id="af-bill-y">Yearly</span>
      <span class="badge af-badge af-badge-success" data-billing-save hidden>Save 17%</span>
    </div>
  </div>
</section>

<section class="container">
  <div class="row g-4 align-items-stretch">
    ${plans.map((p) => `<div class="col-lg-4" data-reveal>${pricingCard(p)}</div>`).join('\n    ')}
  </div>
</section>

<section class="container af-section">
  ${sectionHeader({ title: 'Compare every feature' })}
  ${compareTable(plans)}
</section>

<section class="container af-section">
  ${sectionHeader({ title: 'Questions about billing', text: 'The short answers. The full list lives on the FAQ page.' })}
  <div class="row justify-content-center"><div class="col-lg-9">
    ${accordion(faqs.slice(0, 5), 'af-pricing-faq')}
  </div></div>
</section>

<section class="container af-section">
  ${ctaBanner({
    title: 'Still deciding?',
    text: 'Start on the free plan. Upgrade when the ads start bothering you — most people last about a week.',
    primary: btn({ label: 'Start free', href: 'register.html', variant: 'primary' }),
    secondary: btn({ label: 'Talk to us', href: 'contact.html', variant: 'outline-light' })
  })}
</section>`
  };
}

/** faq.html */
function faq(ctx) {
  const { faqs } = ctx;
  return {
    meta: {
      path: 'faq.html',
      title: 'FAQ',
      description: 'Answers about licensing, dark mode, the data layer, accessibility and RTL support.',
      priority: '0.6',
      jsonLd: [{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') }
        }))
      }]
    },
    body: `
<section class="container af-page-head">
  ${breadcrumb([{ label: 'Home', href: 'index.html' }, { label: 'FAQ' }])}
  <h1>Frequently asked questions</h1>
  <p>Everything people ask before buying. If yours is not here, the contact form gets a reply within a working day.</p>
</section>

<section class="container">
  <div class="row g-4">
    <div class="col-lg-8">${accordion(faqs, 'af-faq')}</div>
    <aside class="col-lg-4">
      <div class="af-panel p-4 af-stack">
        <h2 class="h6 mb-0">${icon('chat-dots')} Still stuck?</h2>
        <p class="af-muted mb-0" style="font-size:.9rem">Support answers within one working day, in English or Japanese.</p>
        ${btn({ label: 'Contact support', href: 'contact.html', variant: 'primary', cls: 'w-100' })}
        ${btn({ label: 'Read the docs', href: 'documentation.html', variant: 'outline-light', cls: 'w-100' })}
      </div>
    </aside>
  </div>
</section>`
  };
}

/** about.html */
function about(ctx) {
  const { stats, team, testimonials } = ctx;
  return {
    meta: {
      path: 'about.html',
      title: 'About',
      description: 'Who builds AnimeFlow Pro, how the template came about, and what it is built on.',
      priority: '0.5'
    },
    body: `
<section class="container af-page-head">
  ${breadcrumb([{ label: 'Home', href: 'index.html' }, { label: 'About' }])}
  <h1>We got tired of fighting old templates</h1>
  <p>AnimeFlow Pro started as an internal rebuild. A client handed us a six-year-old Bootstrap 4 theme held together with jQuery plugins, and rewriting it turned out to be faster than patching it.</p>
</section>

<section class="container">
  <div class="af-stats">${stats.map(statTile).join('\n    ')}</div>
</section>

<section class="container af-section">
  <div class="row g-5 align-items-center">
    <div class="col-lg-6" data-reveal="left">
      <h2>Built for the people who maintain it</h2>
      <p class="af-muted">Every decision here optimises for the second developer — the one who opens the project in eight months and has to add a page. Semantic markup instead of nested wrappers. SCSS variables instead of overrides. Small modules with names that say what they do.</p>
      <p class="af-muted">The result compiles to one stylesheet and one script, both under a hundred kilobytes, with no runtime dependency on anything you have to keep updated.</p>
      ${btn({ label: 'Read the documentation', href: 'documentation.html', variant: 'outline-light', icon: 'journal-text' })}
    </div>
    <div class="col-lg-6" data-reveal="right">
      ${timeline([
        { title: 'The rebuild', when: 'Spring 2024', text: 'A client asked for “just a refresh” of a Bootstrap 4 anime theme. We measured 340 kB of jQuery plugins for four features.' },
        { title: 'Bootstrap 5.3 rewrite', when: 'Autumn 2024', text: 'Native colour modes landed and made the dark/light work trivial. The whole thing was rewritten around them.' },
        { title: 'Accessibility pass', when: 'Winter 2025', text: 'Keyboard-tested every widget, added the skip link, fixed the contrast of six colour pairs.' },
        { title: 'Released as a product', when: 'Today', text: '20 pages, 40+ components, 38 documented behaviours, RTL included.' }
      ])}
    </div>
  </div>
</section>

<section class="container af-section">
  ${sectionHeader({ eyebrow: 'The team', title: 'Four people, one stylesheet' })}
  <div class="row g-4">
    ${team.map((m) => `<div class="col-sm-6 col-lg-3">${teamCard(m)}</div>`).join('\n    ')}
  </div>
</section>

<section class="container af-section">
  ${sectionHeader({ title: 'What people tell us' })}
  <div class="row g-4">
    ${testimonials.map((t) => `<div class="col-md-4" data-reveal>${testimonialCard(t)}</div>`).join('\n    ')}
  </div>
</section>`
  };
}

/** contact.html */
function contact() {
  return {
    meta: {
      path: 'contact.html',
      title: 'Contact',
      description: 'A working contact form with inline validation, plus support channels and office details.',
      priority: '0.5'
    },
    body: `
<section class="container af-page-head">
  ${breadcrumb([{ label: 'Home', href: 'index.html' }, { label: 'Contact' }])}
  <h1>Talk to us</h1>
  <p>Pre-sales questions, licence clarifications, bug reports — all of it lands in the same inbox and gets an answer within one working day.</p>
</section>

<section class="container">
  <div class="row g-4">
    <div class="col-lg-7">
      <div class="af-panel p-4">
        <form data-async="Message sent" data-async-note="We reply within one working day." novalidate>
          <div class="row">
            <div class="col-md-6">${field({ id: 'c-name', label: 'Your name', placeholder: 'Jane Doe', required: true, icon: 'person-circle', autocomplete: 'name' })}</div>
            <div class="col-md-6">${field({ id: 'c-email', label: 'Email', type: 'email', placeholder: 'you@example.com', required: true, icon: 'envelope', autocomplete: 'email' })}</div>
          </div>
          <div class="af-field">
            <label class="form-label" for="c-topic">What is this about?</label>
            <select class="form-select" id="c-topic">
              <option>Pre-sales question</option>
              <option>Licensing</option>
              <option>Bug report</option>
              <option>Feature request</option>
              <option>Something else</option>
            </select>
          </div>
          ${field({ id: 'c-message', label: 'Message', rows: 5, placeholder: 'Tell us what you need…', required: true })}
          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" id="c-copy">
            <label class="form-check-label" for="c-copy" style="font-size:.875rem">Send me a copy of this message</label>
          </div>
          ${btn({ label: 'Send message', variant: 'primary', type: 'submit', icon: 'send' })}
        </form>
      </div>
      ${callout('info', 'This form is a demo.', '<p class="mb-0">It validates properly and shows the full success flow, but nothing leaves the browser. Point the submit handler in <code>src/js/modules/forms.js</code> at your endpoint.</p>')}
    </div>

    <aside class="col-lg-5">
      <div class="af-panel p-4 af-stack">
        <div>
          <h2 class="h6">${icon('envelope')} Email</h2>
          <p class="af-muted mb-0">support@animeflow.example.com</p>
        </div>
        <div>
          <h2 class="h6">${icon('discord')} Community</h2>
          <p class="af-muted mb-0">Around 4,000 developers in the Discord, most questions answered by other buyers in minutes.</p>
        </div>
        <div>
          <h2 class="h6">${icon('geo-alt')} Studio</h2>
          <p class="af-muted mb-0">Nakameguro 3-14-2<br>Meguro City, Tokyo</p>
        </div>
        <div>
          <h2 class="h6">${icon('clock')} Hours</h2>
          <p class="af-muted mb-0">Monday to Friday, 10:00–18:00 JST</p>
        </div>
      </div>
    </aside>
  </div>
</section>`
  };
}

/** 404.html */
function notFound(ctx) {
  const picks = ctx.anime.filter((a) => a.tags.includes('trending')).slice(0, 5);
  return {
    meta: {
      path: '404.html',
      title: 'Page not found',
      description: 'The page you were looking for does not exist.',
      noindex: true
    },
    body: `
<section class="container">
  <div class="af-404">
    <span class="af-blob af-blob-1"></span>
    <p class="af-eyebrow">Error 404</p>
    <p class="af-404-code">404</p>
    <h1 class="h3">This page slipped into another dimension</h1>
    <p class="af-muted mx-auto" style="max-width:44ch">The link is broken, the title was removed, or the address has a typo. Any of those is fixable from here.</p>
    <div class="d-flex flex-wrap gap-2 justify-content-center mt-2">
      ${btn({ label: 'Back to home', href: 'index.html', variant: 'primary', icon: 'house' })}
      ${btn({ label: 'Browse catalogue', href: 'browse.html', variant: 'outline-light', icon: 'grid' })}
      ${btn({ label: 'Search', variant: 'ghost', icon: 'search', 'data-search-open': true })}
    </div>
  </div>
</section>

<section class="container af-section">
  ${sectionHeader({ title: 'While you are here', text: 'The five titles everybody is watching this week.' })}
  <div class="af-grid">
    ${picks.map((a) => `<article class="af-card" data-slug="${a.slug}" data-title="${esc(a.title)}">
      <div class="af-poster"><a class="af-poster-link" href="anime-details.html?id=${a.slug}">
        <img class="af-poster-img" src="assets/img/posters/${a.slug}.svg" alt="${esc(a.title)}" width="400" height="600" loading="lazy" decoding="async"></a></div>
      <div class="af-card-body"><h3 class="af-card-title"><a href="anime-details.html?id=${a.slug}">${esc(a.title)}</a></h3></div>
    </article>`).join('\n    ')}
  </div>
</section>`
  };
}

export async function pages(ctx) {
  return [pricing(ctx), faq(ctx), about(ctx), contact(), notFound(ctx)];
}
