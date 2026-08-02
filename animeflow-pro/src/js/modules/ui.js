/**
 * The small global behaviours that appear on every page.
 *
 *  6 — toast notifications
 *  7 — cookie consent banner
 *  8 — back-to-top button
 *  9 — scroll progress bar
 * 10 — sticky header state
 * 11 — active state for the mobile bottom navigation
 * 12 — image lightbox
 * 13 — copy-to-clipboard buttons
 * 14 — newsletter pop-up (once per visitor)
 * 15 — custom anime-style cursor
 */

import { $, $$, on, throttle, storage, trapFocus, prefersReducedMotion } from '../utils.js';

/* 6 — toasts ---------------------------------------------------------- */

const ICONS = {
  success: 'check-circle-fill',
  danger: 'x-circle-fill',
  warning: 'exclamation-triangle-fill',
  info: 'info-circle-fill'
};

export function toast(title, message = '', variant = 'info', timeout = 4000) {
  const host = $('[data-toast-host]');
  if (!host) return null;
  const el = document.createElement('div');
  el.className = `af-toast af-toast-${variant}`;
  el.setAttribute('role', variant === 'danger' ? 'alert' : 'status');
  el.innerHTML = `<svg class="af-icon" aria-hidden="true"><use href="#i-${ICONS[variant] || ICONS.info}"></use></svg>
    <div><b></b>${message ? '<span></span>' : ''}</div>
    <button type="button" class="af-toast-x" aria-label="Dismiss notification"><svg class="af-icon" aria-hidden="true"><use href="#i-x-lg"></use></svg></button>`;
  el.querySelector('b').textContent = title;
  if (message) el.querySelector('span').textContent = message;

  const close = () => {
    el.classList.add('is-leaving');
    el.addEventListener('animationend', () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 400);
  };
  el.querySelector('.af-toast-x').addEventListener('click', close);
  host.append(el);
  if (timeout) setTimeout(close, timeout);
  return el;
}

/* 7 — cookie banner --------------------------------------------------- */

function initCookies() {
  const banner = $('[data-cookie-banner]');
  if (!banner) return;
  if (storage.get('af-cookies') === null) {
    setTimeout(() => { banner.hidden = false; }, 1200);
  }
  on(banner, 'click', '[data-cookie]', (event, btn) => {
    storage.set('af-cookies', btn.dataset.cookie);
    banner.hidden = true;
    toast(
      btn.dataset.cookie === 'accept' ? 'Cookies accepted' : 'Only essential cookies',
      'You can change this any time from the footer.',
      'success'
    );
  });
}

/* 8 + 9 + 10 — scroll-driven chrome ----------------------------------- */

function initScrollChrome() {
  const header = $('[data-header]');
  const toTop = $('[data-to-top]');
  const progress = $('[data-scroll-progress]');

  const update = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-stuck', y > 8);
    if (toTop) toTop.hidden = y < 600;
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${max > 0 ? Math.min(100, (y / max) * 100) : 0}%`;
    }
  };

  window.addEventListener('scroll', throttle(update, 60), { passive: true });
  window.addEventListener('resize', throttle(update, 200), { passive: true });
  update();

  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    $('.af-skip')?.focus();
  });
}

/* 11 — bottom nav active state ---------------------------------------- */

function initBottomNav() {
  const page = document.body.dataset.page;
  $$('[data-bottom]').forEach((link) => {
    link.classList.toggle('is-active', link.dataset.bottom === page);
    if (link.dataset.bottom === page) link.setAttribute('aria-current', 'page');
  });
}

/* 12 — lightbox -------------------------------------------------------- */

function initLightbox() {
  const host = $('[data-lightbox-host]');
  if (!host) return;
  const img = $('[data-lightbox-img]', host);
  const caption = $('[data-lightbox-caption]', host);
  let release = null;
  let opener = null;

  const close = () => {
    host.hidden = true;
    document.body.style.removeProperty('overflow');
    release?.();
    opener?.focus();
  };

  on(document, 'click', '[data-lightbox]', (event, btn) => {
    event.preventDefault();
    opener = btn;
    img.src = btn.dataset.lightbox;
    img.alt = btn.dataset.caption || '';
    caption.textContent = btn.dataset.caption || '';
    host.hidden = false;
    document.body.style.overflow = 'hidden';
    release = trapFocus(host);
    $('[data-lightbox-close]', host).focus();
  });

  on(host, 'click', '[data-lightbox-close]', close);
  host.addEventListener('click', (event) => { if (event.target === host) close(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !host.hidden) close();
  });
}

/* 13 — copy to clipboard ---------------------------------------------- */

function initCopy() {
  on(document, 'click', '[data-copy]', async (event, btn) => {
    const code = btn.parentElement.querySelector('code');
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code.textContent);
      const label = btn.querySelector('span');
      const original = label ? label.textContent : '';
      btn.classList.add('is-done');
      if (label) label.textContent = 'Copied';
      setTimeout(() => { btn.classList.remove('is-done'); if (label) label.textContent = original; }, 1800);
    } catch {
      toast('Could not copy', 'Your browser blocked clipboard access.', 'warning');
    }
  });
}

/* 14 — newsletter pop-up ---------------------------------------------- */

function initNewsletterPopup() {
  const modalEl = $('#af-newsletter-modal');
  if (!modalEl || !window.bootstrap) return;
  if (storage.get('af-newsletter') !== null) return;

  let fired = false;
  const show = () => {
    if (fired || document.querySelector('.modal.show') || !$('[data-search-dialog]')?.hidden) return;
    fired = true;
    storage.set('af-newsletter', 'seen');
    window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
  };
  // Whichever comes first: 45 s dwell, or half the page scrolled.
  const timer = setTimeout(show, 45000);
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max > 0 && window.scrollY / max > 0.5) { clearTimeout(timer); show(); }
  };
  window.addEventListener('scroll', throttle(onScroll, 500), { passive: true });
}

/* 15 — custom cursor --------------------------------------------------- */

function initCursor() {
  const cursor = $('[data-cursor]');
  if (!cursor || prefersReducedMotion()) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot = $('.af-cursor-dot', cursor);
  const ring = $('.af-cursor-ring', cursor);
  let x = 0, y = 0, rx = 0, ry = 0, running = false;

  document.body.classList.add('af-cursor-on');

  window.addEventListener('pointermove', (event) => {
    x = event.clientX; y = event.clientY;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (!running) { running = true; requestAnimationFrame(follow); }
  }, { passive: true });

  function follow() {
    rx += (x - rx) * 0.18;
    ry += (y - ry) * 0.18;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    if (Math.abs(x - rx) > 0.4 || Math.abs(y - ry) > 0.4) requestAnimationFrame(follow);
    else running = false;
  }

  on(document, 'pointerenter', 'a, button, [role="button"], input, select, textarea',
    () => cursor.classList.add('is-active'), true);
  on(document, 'pointerleave', 'a, button, [role="button"], input, select, textarea',
    () => cursor.classList.remove('is-active'), true);
  document.addEventListener('pointerdown', () => cursor.classList.add('is-active'));
  document.addEventListener('pointerup', () => cursor.classList.remove('is-active'));
}

export function initUI() {
  initCookies();
  initScrollChrome();
  initBottomNav();
  initLightbox();
  initCopy();
  initNewsletterPopup();
  initCursor();
}
