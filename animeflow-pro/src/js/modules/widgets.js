/**
 * 53 — dropdown menus
 * 54 — tabs
 * 55 — accordion / collapse
 * 56 — dismissible alerts
 *
 * These four exist so the bundle can drop Bootstrap's Dropdown, Tab, Collapse
 * and Alert — and with Dropdown, Popper.js, which alone was 20 kB. The menus
 * here are anchored with plain CSS, so no positioning engine is needed.
 * Modal and Offcanvas are still Bootstrap's: their backdrop, scrollbar and
 * focus-trap handling is worth the kilobytes.
 */

import { $, $$, on } from '../utils.js';

/* 53 — dropdown -------------------------------------------------------- */

function closeAllDropdowns(except) {
  $$('[data-af-dropdown][aria-expanded="true"]').forEach((toggle) => {
    if (toggle === except) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.parentElement.querySelector('.dropdown-menu')?.classList.remove('show');
  });
}

function initDropdowns() {
  on(document, 'click', '[data-af-dropdown]', (event, toggle) => {
    event.preventDefault();
    const menu = toggle.parentElement.querySelector('.dropdown-menu');
    if (!menu) return;
    const open = toggle.getAttribute('aria-expanded') === 'true';
    closeAllDropdowns(toggle);
    toggle.setAttribute('aria-expanded', String(!open));
    menu.classList.toggle('show', !open);

    if (!open) {
      // Keep the panel inside the viewport without a positioning library.
      menu.style.removeProperty('inset-inline-start');
      const box = menu.getBoundingClientRect();
      const overflowEnd = document.dir === 'rtl' ? -box.left : box.right - window.innerWidth;
      if (overflowEnd > 0) menu.style.insetInlineStart = `${-overflowEnd - 16}px`;
    }
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.dropdown')) closeAllDropdowns();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const open = $('[data-af-dropdown][aria-expanded="true"]');
    if (open) { closeAllDropdowns(); open.focus(); }
  });

  // Arrow keys walk the open menu, matching the native menu-button pattern.
  on(document, 'keydown', '.dropdown', (event, wrap) => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    const toggle = $('[data-af-dropdown]', wrap);
    const menu = $('.dropdown-menu', wrap);
    if (!toggle || !menu) return;
    if (toggle.getAttribute('aria-expanded') !== 'true') { toggle.click(); return; }
    event.preventDefault();
    const items = $$('a, button', menu);
    const at = items.indexOf(document.activeElement);
    const next = event.key === 'ArrowDown'
      ? (at + 1) % items.length
      : (at <= 0 ? items.length - 1 : at - 1);
    items[next]?.focus();
  });
}

/* 54 — tabs ------------------------------------------------------------ */

function activateTab(tab) {
  const list = tab.closest('[role="tablist"]');
  const panelId = tab.getAttribute('aria-controls');
  const panel = document.getElementById(panelId);
  if (!list || !panel) return;

  $$('[role="tab"]', list).forEach((t) => {
    const on = t === tab;
    t.classList.toggle('active', on);
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
  });
  const container = panel.parentElement;
  $$(':scope > .tab-pane', container).forEach((p) => {
    p.classList.toggle('show', p === panel);
    p.classList.toggle('active', p === panel);
  });
}

function initTabs() {
  on(document, 'click', '[role="tab"]', (event, tab) => {
    event.preventDefault();
    activateTab(tab);
  });

  on(document, 'keydown', '[role="tab"]', (event, tab) => {
    const keys = { ArrowRight: 1, ArrowLeft: -1 };
    const list = tab.closest('[role="tablist"]');
    const tabs = $$('[role="tab"]', list);
    if (event.key === 'Home') { event.preventDefault(); tabs[0].focus(); activateTab(tabs[0]); return; }
    if (event.key === 'End') { event.preventDefault(); tabs.at(-1).focus(); activateTab(tabs.at(-1)); return; }
    if (!(event.key in keys)) return;
    event.preventDefault();
    const dir = document.dir === 'rtl' ? -keys[event.key] : keys[event.key];
    const next = tabs[(tabs.indexOf(tab) + dir + tabs.length) % tabs.length];
    next.focus();
    activateTab(next);
  });

  // Make sure exactly one tab per list is in the tab order on load.
  $$('[role="tablist"]').forEach((list) => {
    const tabs = $$('[role="tab"]', list);
    tabs.forEach((t) => { t.tabIndex = t.classList.contains('active') ? 0 : -1; });
  });
}

/* 55 — collapse / accordion -------------------------------------------- */

function collapse(panel, open) {
  const done = () => {
    panel.classList.remove('collapsing');
    panel.classList.toggle('collapse', true);
    panel.classList.toggle('show', open);
    panel.style.removeProperty('height');
  };
  panel.classList.remove('collapse', 'show');
  panel.classList.add('collapsing');
  panel.style.height = `${open ? 0 : panel.scrollHeight}px`;
  // Force a reflow so the browser registers the starting height.
  void panel.offsetHeight;
  panel.style.height = `${open ? panel.scrollHeight : 0}px`;
  panel.addEventListener('transitionend', done, { once: true });
  setTimeout(done, 400);
}

function initCollapse() {
  on(document, 'click', '[data-af-collapse]', (event, toggle) => {
    event.preventDefault();
    const panel = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!panel) return;
    const open = toggle.getAttribute('aria-expanded') !== 'true';

    // Accordion behaviour: close siblings sharing the same parent.
    const parent = panel.dataset.afParent && $(panel.dataset.afParent);
    if (open && parent) {
      $$('.accordion-collapse.show', parent).forEach((other) => {
        if (other === panel) return;
        collapse(other, false);
        const otherToggle = $(`[aria-controls="${other.id}"]`, parent);
        otherToggle?.setAttribute('aria-expanded', 'false');
        otherToggle?.classList.add('collapsed');
      });
    }

    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.toggle('collapsed', !open);
    collapse(panel, open);
  });
}

/* 56 — dismissible alerts ---------------------------------------------- */

function initAlerts() {
  on(document, 'click', '[data-af-dismiss]', (event, btn) => {
    const target = btn.closest(btn.dataset.afDismiss || '.alert');
    if (!target) return;
    target.classList.remove('show');
    target.addEventListener('transitionend', () => target.remove(), { once: true });
    setTimeout(() => target.remove(), 300);
  });
}

export function initWidgets() {
  initDropdowns();
  initTabs();
  initCollapse();
  initAlerts();
}
