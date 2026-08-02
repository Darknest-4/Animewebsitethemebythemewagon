/**
 * 32 — horizontal rails: arrow buttons, pointer dragging, touch swipe,
 *      keyboard paging and arrow visibility that reacts to scroll position.
 *
 * No carousel library: the track is a scroll container with scroll-snap, so
 * native momentum, RTL and screen-reader order all work for free.
 */

import { $, $$, throttle, prefersReducedMotion } from '../utils.js';

function setupRail(rail) {
  const track = $('[data-rail-track]', rail);
  const prev = $('[data-rail-prev]', rail);
  const next = $('[data-rail-next]', rail);
  if (!track) return;

  const step = () => Math.max(track.clientWidth * 0.8, 240);
  const behavior = () => (prefersReducedMotion() ? 'auto' : 'smooth');

  const updateArrows = () => {
    // scrollLeft is negative in RTL on standards-compliant browsers.
    const max = track.scrollWidth - track.clientWidth - 2;
    const pos = Math.abs(track.scrollLeft);
    if (prev) prev.hidden = pos <= 2;
    if (next) next.hidden = pos >= max;
  };

  prev?.addEventListener('click', () => {
    track.scrollBy({ left: document.dir === 'rtl' ? step() : -step(), behavior: behavior() });
  });
  next?.addEventListener('click', () => {
    track.scrollBy({ left: document.dir === 'rtl' ? -step() : step(), behavior: behavior() });
  });

  track.addEventListener('scroll', throttle(updateArrows, 100), { passive: true });
  window.addEventListener('resize', throttle(updateArrows, 200), { passive: true });

  // Keyboard: the track is focusable, so Home/End/PageUp/PageDown work too.
  track.addEventListener('keydown', (event) => {
    const map = {
      ArrowRight: step(), ArrowLeft: -step(),
      PageDown: track.clientWidth, PageUp: -track.clientWidth
    };
    if (event.key === 'Home') { event.preventDefault(); track.scrollTo({ left: 0, behavior: behavior() }); return; }
    if (event.key === 'End') { event.preventDefault(); track.scrollTo({ left: track.scrollWidth, behavior: behavior() }); return; }
    if (map[event.key] === undefined) return;
    event.preventDefault();
    track.scrollBy({ left: map[event.key], behavior: behavior() });
  });

  // Pointer dragging on mouse only — touch already scrolls natively.
  let down = false, startX = 0, startScroll = 0, moved = 0;
  track.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    down = true; moved = 0;
    startX = event.clientX;
    startScroll = track.scrollLeft;
  });
  track.addEventListener('pointermove', (event) => {
    if (!down) return;
    const delta = event.clientX - startX;
    moved = Math.abs(delta);
    if (moved > 6) {
      track.classList.add('is-dragging');
      track.setPointerCapture?.(event.pointerId);
      track.scrollLeft = startScroll - delta;
    }
  });
  const release = () => {
    if (!down) return;
    down = false;
    track.classList.remove('is-dragging');
    updateArrows();
  };
  track.addEventListener('pointerup', release);
  track.addEventListener('pointercancel', release);
  track.addEventListener('pointerleave', release);
  // Swallow the click that ends a drag so it does not open a card.
  track.addEventListener('click', (event) => {
    if (moved > 6) { event.preventDefault(); event.stopPropagation(); moved = 0; }
  }, true);

  updateArrows();
}

export function initRails(root = document) {
  $$('[data-rail]', root).forEach(setupRail);
}
