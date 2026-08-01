/**
 * 43 — trailer modal (YouTube, loaded on demand)
 * 44 — click-to-load video facades
 *
 * No iframe exists until someone asks for one: nothing third-party is
 * requested on page load, which is both faster and friendlier to privacy.
 * The nocookie host is used, and the frame is destroyed on close so audio
 * cannot keep playing behind the dialog.
 */

import { $, on } from '../utils.js';

// Demo trailer. Point data-trailer at your own id per title in production.
const DEFAULT_TRAILER = 'dQw4w9WgXcQ';

const frame = (id, title) =>
  `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1"
    title="${title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
    allowfullscreen loading="lazy"></iframe>`;

export function initVideo() {
  const modalEl = $('#af-trailer');

  /* 43 — preview buttons on cards + explicit trailer buttons */
  on(document, 'click', '[data-preview], [data-trailer]', (event, btn) => {
    event.preventDefault();
    if (!modalEl || !window.bootstrap) return;
    const host = $('[data-trailer-host]', modalEl);
    const title = btn.closest('[data-title]')?.dataset.title
      || btn.dataset.trailerTitle || 'Trailer';
    $('#af-trailer-title', modalEl).textContent = `${title} — trailer`;
    host.innerHTML = frame(btn.dataset.trailer || DEFAULT_TRAILER, `${title} trailer`);
    window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
  });

  modalEl?.addEventListener('hidden.bs.modal', () => {
    const host = $('[data-trailer-host]', modalEl);
    if (host) host.innerHTML = '';
  });

  /* 44 — inline facades */
  on(document, 'click', '[data-video-play]', (event, btn) => {
    const wrap = btn.closest('[data-video]');
    if (!wrap) return;
    wrap.innerHTML = frame(wrap.dataset.video || DEFAULT_TRAILER, wrap.dataset.title || 'Video');
  });
}
