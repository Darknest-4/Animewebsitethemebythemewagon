/** Tiny helpers shared by every module. No dependencies, no globals. */

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Delegated event binding: on(document, 'click', '[data-x]', handler). */
export function on(root, type, selector, handler, options) {
  root.addEventListener(type, (event) => {
    // event.target is not always an Element — pointerenter on the document,
    // for instance, targets the document itself, which has no closest().
    if (typeof event.target?.closest !== 'function') return;
    const target = event.target.closest(selector);
    if (target && root.contains(target)) handler(event, target);
  }, options);
}

export const debounce = (fn, wait = 200) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
};

export const throttle = (fn, wait = 100) => {
  let last = 0, queued = null;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) { last = now; fn(...args); }
    else { clearTimeout(queued); queued = setTimeout(() => { last = Date.now(); fn(...args); }, wait - (now - last)); }
  };
};

/** localStorage that never throws — private mode, disabled storage, quota. */
export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
  },
  remove(key) { try { localStorage.removeItem(key); } catch { /* ignore */ } }
};

export const params = () => new URLSearchParams(location.search);

export const escapeHtml = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Wraps every occurrence of `term` in <mark> — used by the search dropdown. */
export function highlight(text, term) {
  const safe = escapeHtml(text);
  if (!term) return safe;
  const pattern = term.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return safe.replace(new RegExp(`(${pattern})`, 'ig'), '<mark>$1</mark>');
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Keeps Tab inside a dialog while it is open; returns a cleanup function. */
export function trapFocus(container) {
  const selector = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
  const onKey = (event) => {
    if (event.key !== 'Tab') return;
    const items = $$(selector, container).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  container.addEventListener('keydown', onKey);
  return () => container.removeEventListener('keydown', onKey);
}

export const formatNumber = (n) => new Intl.NumberFormat().format(n);

/** Resolves once the element scrolls into view (used for lazy sections). */
export function whenVisible(el, callback, rootMargin = '200px') {
  if (!('IntersectionObserver' in window)) { callback(); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { io.disconnect(); callback(); }
    });
  }, { rootMargin });
  io.observe(el);
}
