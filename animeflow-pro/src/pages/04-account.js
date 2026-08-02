import {
  btn, icon, breadcrumb, sectionHeader, field, switchControl, avatarImg, esc, badge
} from '../lib/components.js';

const dashNav = [
  { label: 'Overview', icon: 'speedometer2', href: 'dashboard.html', active: true },
  { label: 'Continue watching', icon: 'collection-play', href: '#continue' },
  { label: 'My watchlist', icon: 'heart', href: 'watchlist.html' },
  { label: 'Recently viewed', icon: 'clock', href: '#recent' },
  { label: 'Downloads', icon: 'cloud-arrow-down', href: '#' },
  { label: 'Notifications', icon: 'bell', href: '#' },
  { label: 'Settings', icon: 'gear', href: '#settings' },
  { label: 'Sign out', icon: 'box-arrow-right', href: 'login.html' }
];

/** dashboard.html */
function dashboard(ctx) {
  const seed = JSON.stringify(ctx.continueWatching.map((c) => ({ slug: c.slug, episode: c.episode, progress: c.progress, at: 0 })));
  return {
    meta: {
      path: 'dashboard.html',
      title: 'Dashboard',
      description: 'A member area with continue-watching, favourites, recently viewed and account settings.',
      noindex: true
    },
    body: `
<section class="container af-page-head">
  ${breadcrumb([{ label: 'Home', href: 'index.html' }, { label: 'Dashboard' }])}
  <h1>Welcome back, Rin</h1>
  <p>Everything below reads from <code>localStorage</code>, so it reflects what you actually clicked while browsing this demo.</p>
</section>

<section class="container" data-dashboard data-seed='${seed}'>
  <div class="af-dash">
    <aside class="af-dash-side">
      <div class="af-dash-user">
        ${avatarImg('Rin Kobayashi', 44)}
        <div><b>Rin Kobayashi</b><span>Premium member</span></div>
      </div>
      <nav aria-label="Account">
        <ul class="af-dash-nav">
          ${dashNav.map((i) => `<li><a href="${i.href}" class="${i.active ? 'is-active' : ''}">${icon(i.icon)}${esc(i.label)}</a></li>`).join('\n          ')}
        </ul>
      </nav>
    </aside>

    <div class="af-stack" style="gap:2.5rem">
      <div class="af-dash-cards">
        <div class="af-stat"><b class="af-stat-value" data-stat="watching" data-count="5">0</b><span class="af-stat-label">In progress</span></div>
        <div class="af-stat"><b class="af-stat-value" data-stat="saved" data-count="0">0</b><span class="af-stat-label">On watchlist</span></div>
        <div class="af-stat"><b class="af-stat-value" data-stat="hours" data-count="42" data-suffix="h">0h</b><span class="af-stat-label">Watched</span></div>
        <div class="af-stat"><b class="af-stat-value" data-stat="streak" data-count="7" data-suffix="d">0d</b><span class="af-stat-label">Current streak</span></div>
      </div>

      <section id="continue">
        ${sectionHeader({ title: 'Continue watching', text: 'Picks up wherever you stopped — resume points are written by the player page.' })}
        <div class="af-continue-grid" data-continue-grid></div>
      </section>

      <section>
        ${sectionHeader({ title: 'Your favourites', link: 'watchlist.html', linkLabel: 'Open watchlist' })}
        <div class="af-grid" data-favourites-grid></div>
      </section>

      <section id="recent" data-recent-section hidden>
        ${sectionHeader({ title: 'Recently viewed' })}
        <div class="af-grid" data-recent-grid></div>
      </section>

      <section id="settings">
        ${sectionHeader({ title: 'Playback settings' })}
        <div class="af-panel p-4 af-stack">
          ${switchControl({ id: 'set-autoplay', label: 'Autoplay next episode', checked: true })}
          ${switchControl({ id: 'set-skip', label: 'Skip opening automatically', checked: true, help: 'Uses chapter markers when the file provides them.' })}
          ${switchControl({ id: 'set-dub', label: 'Prefer dubbed audio when available' })}
          ${switchControl({ id: 'set-data', label: 'Save data on mobile networks', help: 'Caps playback at 720p when not on Wi-Fi.' })}
        </div>
      </section>
    </div>
  </div>
</section>`
  };
}

const socialButtons = `<div class="af-auth-social">
  ${btn({ label: 'Google', variant: 'outline-light', icon: 'globe' })}
  ${btn({ label: 'GitHub', variant: 'outline-light', icon: 'github' })}
</div>
<div class="af-auth-divider">or with email</div>`;

/** login.html */
function login() {
  return {
    meta: {
      path: 'login.html',
      title: 'Sign in',
      description: 'A glassmorphism sign-in screen with inline validation, social buttons and a password reveal toggle.',
      bodyClass: 'af-auth-page'
    },
    body: `
<div class="container">
  <div class="af-auth">
    <div class="af-auth-card" data-reveal="zoom">
      <h1>Welcome back</h1>
      <p>Sign in to pick up where you left off.</p>
      ${socialButtons}
      <form data-async="Signed in" data-async-note="This demo does not talk to a server." novalidate>
        ${field({ id: 'login-email', label: 'Email address', type: 'email', placeholder: 'you@example.com', required: true, icon: 'envelope', autocomplete: 'email' })}
        <div class="af-field">
          <label class="form-label" for="login-password">Password <span class="af-req" aria-hidden="true">*</span></label>
          <div class="af-control has-icon">
            <span class="af-control-icon">${icon('key')}</span>
            <input class="form-control" type="password" id="login-password" placeholder="••••••••" autocomplete="current-password" required minlength="8">
            <button type="button" class="af-icon-btn" data-password-toggle="login-password" aria-pressed="false" aria-label="Show password"
              style="position:absolute;inset-inline-end:.25rem;inset-block-start:50%;translate:0 -50%">${icon('eye')}</button>
          </div>
          <p class="invalid-feedback" data-error></p>
        </div>
        <div class="d-flex align-items-center justify-content-between mb-3">
          ${switchControl({ id: 'login-remember', label: 'Keep me signed in', checked: true })}
          <a href="forgot-password.html" style="font-size:.875rem">Forgot password?</a>
        </div>
        ${btn({ label: 'Sign in', variant: 'primary', type: 'submit', cls: 'w-100' })}
      </form>
      <p class="af-auth-foot">New here? <a href="register.html">Create an account</a></p>
    </div>

    <aside class="af-auth-aside">
      <span class="af-hero-tag" style="width:fit-content">${icon('stars')} Premium</span>
      <h2>Pick up on any screen, exactly where you stopped.</h2>
      <p class="af-muted">Resume points, watchlists and subtitle preferences follow your account across phone, tablet, laptop and TV.</p>
      <ul class="af-stack-sm list-unstyled m-0">
        <li>${icon('check-lg')} Ad-free on every plan above Starter</li>
        <li>${icon('check-lg')} Downloads that survive flight mode</li>
        <li>${icon('check-lg')} Cancel in two clicks, no phone call</li>
      </ul>
    </aside>
  </div>
</div>`
  };
}

/** register.html */
function register() {
  return {
    meta: {
      path: 'register.html',
      title: 'Create account',
      description: 'A registration screen with a live password strength meter and accessible inline validation.',
      bodyClass: 'af-auth-page'
    },
    body: `
<div class="container">
  <div class="af-auth">
    <div class="af-auth-card" data-reveal="zoom">
      <h1>Create your account</h1>
      <p>Seven days of Premium, no card required.</p>
      ${socialButtons}
      <form data-async="Account created" data-async-note="Check your inbox to confirm the address." novalidate>
        ${field({ id: 'reg-name', label: 'Display name', placeholder: 'How should we call you?', required: true, icon: 'person-circle', autocomplete: 'nickname' })}
        ${field({ id: 'reg-email', label: 'Email address', type: 'email', placeholder: 'you@example.com', required: true, icon: 'envelope', autocomplete: 'email' })}
        <div class="af-field">
          <label class="form-label" for="reg-password">Password <span class="af-req" aria-hidden="true">*</span></label>
          <div class="af-control has-icon">
            <span class="af-control-icon">${icon('key')}</span>
            <input class="form-control" type="password" id="reg-password" placeholder="••••••••" autocomplete="new-password" required minlength="8" data-password="reg-meter">
            <button type="button" class="af-icon-btn" data-password-toggle="reg-password" aria-pressed="false" aria-label="Show password"
              style="position:absolute;inset-inline-end:.25rem;inset-block-start:50%;translate:0 -50%">${icon('eye')}</button>
          </div>
          <div class="af-password-meter" id="reg-meter" data-score="0" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
          <p class="form-text" data-password-label>Use 12+ characters with a number and a symbol.</p>
          <p class="invalid-feedback" data-error></p>
        </div>
        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" id="reg-terms" required>
          <label class="form-check-label" for="reg-terms" style="font-size:.875rem">I agree to the <a href="#">terms</a> and <a href="#">privacy policy</a>.</label>
          <p class="invalid-feedback" data-error></p>
        </div>
        ${btn({ label: 'Create account', variant: 'primary', type: 'submit', cls: 'w-100' })}
      </form>
      <p class="af-auth-foot">Already registered? <a href="login.html">Sign in</a></p>
    </div>

    <aside class="af-auth-aside">
      <h2>Join 2.4 million people who watch here every week.</h2>
      <p class="af-muted">Simulcasts within the hour, 40+ subtitle tracks, and a player that remembers what you skipped.</p>
      <div class="d-flex gap-3 align-items-center">
        ${['Rin Kobayashi', 'Mateo Alvarez', 'Aisha Rahman'].map((n) => avatarImg(n, 40)).join('')}
        <span class="af-muted" style="font-size:.875rem">and a few million more</span>
      </div>
    </aside>
  </div>
</div>`
  };
}

/** forgot-password.html */
function forgot() {
  return {
    meta: {
      path: 'forgot-password.html',
      title: 'Reset password',
      description: 'Password recovery screen with a success state.',
      bodyClass: 'af-auth-page',
      noindex: true
    },
    body: `
<div class="container">
  <div class="af-auth" style="grid-template-columns:1fr">
    <div class="af-auth-card" data-reveal="zoom">
      <span class="af-newsletter-icon">${icon('key')}</span>
      <h1>Reset your password</h1>
      <p>Give us the address on the account and we will send a link that expires in 30 minutes.</p>
      <form data-async="Reset link sent" data-async-note="If that address exists, the email is on its way." novalidate>
        ${field({ id: 'reset-email', label: 'Email address', type: 'email', placeholder: 'you@example.com', required: true, icon: 'envelope', autocomplete: 'email' })}
        ${btn({ label: 'Send reset link', variant: 'primary', type: 'submit', cls: 'w-100' })}
      </form>
      <div class="af-alert af-alert-success mt-3" data-form-success hidden role="status">
        ${icon('check-circle-fill')}
        <div><b>Check your inbox.</b> The link works once and expires in 30 minutes.</div>
      </div>
      <p class="af-auth-foot">Remembered it? <a href="login.html">Back to sign in</a></p>
    </div>
  </div>
</div>`
  };
}

export async function pages(ctx) {
  return [dashboard(ctx), login(), register(), forgot()];
}
