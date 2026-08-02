/** Global site configuration: branding, navigation, plans, FAQ, footer. */

export const site = {
  name: 'AnimeFlow Pro',
  tagline: 'Premium streaming UI kit',
  description:
    'AnimeFlow Pro is a Bootstrap 5.3 streaming template: 20 pages, 40+ components, dark & light themes, RTL support and zero jQuery.',
  url: 'https://animeflow.example.com',
  locale: 'en_US',
  twitter: '@animeflowpro',
  themeColor: '#7c5cff',
  author: 'AnimeFlow Studio'
};

export const nav = [
  { label: 'Home', href: 'index.html' },
  {
    label: 'Discover',
    children: [
      { label: 'Browse catalogue', href: 'browse.html', icon: 'grid', desc: 'Filters, sorting, infinite scroll' },
      { label: 'Search results', href: 'search.html', icon: 'search', desc: 'Live autocomplete results page' },
      { label: 'Airing schedule', href: 'schedule.html', icon: 'calendar-week', desc: 'Weekly simulcast grid' },
      { label: 'Anime details', href: 'anime-details.html', icon: 'film', desc: 'Hero, cast, episodes, reviews' },
      { label: 'Watch player', href: 'watch.html', icon: 'play-fill', desc: 'Player page with episode list' }
    ]
  },
  {
    label: 'Account',
    children: [
      { label: 'Dashboard', href: 'dashboard.html', icon: 'speedometer2', desc: 'Continue watching & stats' },
      { label: 'My watchlist', href: 'watchlist.html', icon: 'heart', desc: 'Saved to localStorage' },
      { label: 'Sign in', href: 'login.html', icon: 'box-arrow-in-right', desc: 'Glass auth screen' },
      { label: 'Create account', href: 'register.html', icon: 'person-plus', desc: 'With password strength' },
      { label: 'Reset password', href: 'forgot-password.html', icon: 'key', desc: 'Recovery flow' }
    ]
  },
  {
    label: 'Pages',
    children: [
      { label: 'Pricing', href: 'pricing.html', icon: 'tag', desc: 'Monthly / yearly toggle' },
      { label: 'Blog', href: 'blog.html', icon: 'journal-text', desc: 'Markdown-powered articles' },
      { label: 'About', href: 'about.html', icon: 'info-circle', desc: 'Story, team, numbers' },
      { label: 'FAQ', href: 'faq.html', icon: 'question-circle', desc: 'Accordion + JSON-LD' },
      { label: 'Contact', href: 'contact.html', icon: 'envelope', desc: 'Validated contact form' },
      { label: '404', href: '404.html', icon: 'exclamation-triangle', desc: 'Not-found artwork' }
    ]
  },
  { label: 'Components', href: 'components.html' },
  { label: 'Docs', href: 'documentation.html' }
];

export const footerNav = [
  {
    title: 'Discover',
    links: [
      { label: 'Trending now', href: 'browse.html#trending' },
      { label: 'Top rated', href: 'browse.html#top' },
      { label: 'Upcoming season', href: 'browse.html#upcoming' },
      { label: 'Airing schedule', href: 'schedule.html' },
      { label: 'Genres', href: 'browse.html' }
    ]
  },
  {
    title: 'Account',
    links: [
      { label: 'Dashboard', href: 'dashboard.html' },
      { label: 'My watchlist', href: 'watchlist.html' },
      { label: 'Pricing plans', href: 'pricing.html' },
      { label: 'Sign in', href: 'login.html' },
      { label: 'Create account', href: 'register.html' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: 'about.html' },
      { label: 'Blog', href: 'blog.html' },
      { label: 'Contact', href: 'contact.html' },
      { label: 'FAQ', href: 'faq.html' },
      { label: 'Documentation', href: 'documentation.html' }
    ]
  }
];

export const legalNav = [
  { label: 'Terms', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Cookies', href: '#' },
  { label: 'Licence', href: '#' }
];

export const socials = [
  { label: 'X', href: '#', icon: 'twitter-x' },
  { label: 'Discord', href: '#', icon: 'discord' },
  { label: 'YouTube', href: '#', icon: 'youtube' },
  { label: 'Instagram', href: '#', icon: 'instagram' },
  { label: 'GitHub', href: '#', icon: 'github' }
];

export const plans = [
  {
    id: 'free',
    name: 'Starter',
    monthly: 0,
    yearly: 0,
    blurb: 'Enough to see whether the catalogue is for you.',
    cta: 'Start free',
    features: [
      { label: 'Ad-supported streaming', ok: true },
      { label: '720p playback', ok: true },
      { label: '1 device at a time', ok: true },
      { label: 'Simulcast within 7 days', ok: true },
      { label: 'Offline downloads', ok: false },
      { label: 'Ad-free experience', ok: false }
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    monthly: 7.99,
    yearly: 79,
    blurb: 'The plan almost everybody picks.',
    cta: 'Go Premium',
    featured: true,
    badge: 'Most popular',
    features: [
      { label: 'Completely ad-free', ok: true },
      { label: '1080p playback', ok: true },
      { label: '4 devices at a time', ok: true },
      { label: 'Same-hour simulcast', ok: true },
      { label: 'Offline downloads', ok: true },
      { label: '4K + spatial audio', ok: false }
    ]
  },
  {
    id: 'vip',
    name: 'VIP',
    monthly: 13.99,
    yearly: 139,
    blurb: 'For the household that argues over the remote.',
    cta: 'Get VIP',
    features: [
      { label: 'Everything in Premium', ok: true },
      { label: '4K HDR + spatial audio', ok: true },
      { label: '6 devices at a time', ok: true },
      { label: 'Early access screenings', ok: true },
      { label: 'Merch store discount', ok: true },
      { label: 'Annual convention pass', ok: true }
    ]
  }
];

export const faqs = [
  {
    q: 'What exactly do I get when I buy AnimeFlow Pro?',
    a: 'The full package: 20 production-ready HTML pages, the SCSS source, every ES module unminified, the build tooling, the generated artwork, and this documentation. No obfuscation, no phone-home scripts, no build step required to use it.'
  },
  {
    q: 'Does the template need jQuery?',
    a: 'No. There is not a single line of jQuery in the package. Interactivity is plain ES modules, plus exactly two of Bootstrap 5.3&rsquo;s own vanilla components — Modal and Offcanvas. Dropdowns, tabs, collapse and alerts are implemented in the template, which is what keeps Popper.js out of the bundle entirely.'
  },
  {
    q: 'How does dark mode work?',
    a: 'It uses the native Bootstrap 5.3 colour-mode API. The switcher writes <code>data-bs-theme</code> on the html element and remembers your choice in localStorage; if you have never chosen, it follows your operating system.'
  },
  {
    q: 'Is the data real or hardcoded?',
    a: 'Every rail, filter and search box reads <code>assets/data/anime.json</code> over fetch(). Point that URL at your own API — keep the field names — and the interface keeps working unchanged.'
  },
  {
    q: 'Do I need Node.js?',
    a: 'Only if you want to change the SCSS or the JS modules. The <code>dist/</code> folder is a finished static site: open index.html, or upload it to any host, and you are done.'
  },
  {
    q: 'Is RTL supported?',
    a: 'Yes. A second stylesheet is generated for right-to-left layouts and the header has a live LTR/RTL switch so you can check both directions without reloading.'
  },
  {
    q: 'How accessible is it?',
    a: 'Landmarks, a skip link, visible focus rings, ARIA on every custom widget, keyboard-operable carousels and dialogs, and reduced-motion support for people who ask for it.'
  },
  {
    q: 'Can I use it for a commercial project?',
    a: 'Yes — see LICENSE.md in the package root for the exact terms, including what counts as an end product and what does not.'
  }
];

export const stats = [
  { value: 20, suffix: '', label: 'Ready-made pages' },
  { value: 40, suffix: '+', label: 'UI components' },
  { value: 38, suffix: '', label: 'JavaScript features' },
  { value: 0, suffix: ' kB', label: 'of jQuery' }
];

export const team = [
  { name: 'Rin Kobayashi', role: 'Product design', hue: 280 },
  { name: 'Mateo Alvarez', role: 'Front-end engineering', hue: 200 },
  { name: 'Aisha Rahman', role: 'Design systems', hue: 330 },
  { name: 'Jonas Lindqvist', role: 'Accessibility', hue: 150 }
];

export const testimonials = [
  {
    quote: 'We shipped our streaming MVP in four days. The dark theme alone would have taken us a week to get right.',
    name: 'Priya Nair',
    role: 'CTO, Kitsune Media',
    hue: 265
  },
  {
    quote: 'The markup is boring in the best possible way — semantic, accessible, and nothing to untangle before we could extend it.',
    name: 'Tomás Ferreira',
    role: 'Lead front-end, Studio Nine',
    hue: 190
  },
  {
    quote: 'Removing jQuery from our old template was the whole reason we bought this. Lighthouse went from 61 to 99.',
    name: 'Hannah Weiss',
    role: 'Freelance developer',
    hue: 330
  }
];

/** Feature grid used on the home and about pages. */
/** Review authors shown on the details and watch pages (drives avatar art). */
export const reviewers = [
  { name: 'Yuki Tanaka', hue: 300, when: '2 days ago', rating: 9.4,
    quote: 'The pacing is the whole point. Nothing is rushed, and by episode ten you realise how much groundwork was quietly laid.' },
  { name: 'Marco Rossi', hue: 210, when: '1 week ago', rating: 8.6,
    quote: 'Gorgeous backgrounds, restrained score, and a lead who is allowed to be unlikeable for a while. Rare.' },
  { name: 'Amara Okafor', hue: 25, when: '3 weeks ago', rating: 9.0,
    quote: 'Watched it twice. The second pass is better — the foreshadowing in the first three episodes is relentless once you know.' }
];

export const features = [
  { icon: 'bootstrap', title: 'Bootstrap 5.3', text: 'Built on the current Bootstrap, customised through SCSS variables rather than overridden with !important.' },
  { icon: 'moon-stars', title: 'Dark & light', text: 'Native colour modes with a persisted switcher, tuned so both themes hit WCAG AA contrast.' },
  { icon: 'lightning-charge', title: 'No jQuery', text: 'Thirty-eight features written as ES modules, tree-shaken into one small bundle.' },
  { icon: 'search', title: 'Live search', text: 'Debounced fetch-based autocomplete with keyboard navigation and highlighted matches.' },
  { icon: 'heart', title: 'Watchlist', text: 'Add to watchlist from any card; state survives reloads through localStorage.' },
  { icon: 'phone', title: 'Mobile-first', text: 'A bottom navigation bar, swipeable rails and touch targets sized for thumbs.' },
  { icon: 'translate', title: 'RTL ready', text: 'A generated right-to-left stylesheet plus a live direction switch in the header.' },
  { icon: 'universal-access', title: 'Accessible', text: 'Skip links, focus management, ARIA on custom widgets and reduced-motion support.' },
  { icon: 'speedometer2', title: 'Fast by default', text: 'Lazy images with intrinsic sizes, deferred scripts, minified assets, no web fonts to block render.' }
];
