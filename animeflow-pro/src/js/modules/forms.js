/**
 * 38 — inline form validation with human error messages
 * 39 — password strength meter
 * 40 — show/hide password
 * 41 — contact form submit (fake endpoint, real UX)
 * 42 — newsletter subscribe with duplicate protection
 */

import { $, $$, on, storage } from '../utils.js';
import { toast } from './ui.js';

const MESSAGES = {
  valueMissing: 'This field is required.',
  typeMismatch: 'Check the format — that does not look right.',
  tooShort: 'A little longer, please.',
  patternMismatch: 'That does not match the expected format.'
};

function messageFor(input) {
  const v = input.validity;
  if (v.valueMissing) return MESSAGES.valueMissing;
  if (v.typeMismatch) return input.type === 'email' ? 'Enter a valid email address.' : MESSAGES.typeMismatch;
  if (v.tooShort) return `Use at least ${input.minLength} characters.`;
  if (v.patternMismatch) return MESSAGES.patternMismatch;
  return input.validationMessage || 'Please check this field.';
}

function validate(input) {
  const field = input.closest('.af-field') || input.parentElement;
  const error = field?.querySelector('[data-error]');
  const ok = input.checkValidity();
  input.classList.toggle('is-invalid', !ok);
  input.setAttribute('aria-invalid', String(!ok));
  if (error) {
    error.textContent = ok ? '' : messageFor(input);
    error.style.display = ok ? '' : 'block';
  }
  return ok;
}

/* 38 — validation ------------------------------------------------------ */

function initValidation() {
  on(document, 'blur', 'form[novalidate] input, form[novalidate] textarea, form[novalidate] select',
    (event, el) => { if (el.value !== '' || el.required) validate(el); }, true);

  on(document, 'input', 'form[novalidate] .is-invalid', (event, el) => validate(el));
}

/* 39 + 40 — passwords -------------------------------------------------- */

function strength(value) {
  let s = 0;
  if (value.length >= 8) s += 1;
  if (value.length >= 12) s += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) s += 1;
  if (/\d/.test(value) && /[^\w\s]/.test(value)) s += 1;
  return Math.min(4, s);
}

const LABELS = ['Too short', 'Weak', 'Getting there', 'Good', 'Strong'];

function initPasswords() {
  on(document, 'input', '[data-password]', (event, input) => {
    const meter = $(`#${input.dataset.password}`);
    if (!meter) return;
    const s = input.value ? strength(input.value) : 0;
    meter.dataset.score = String(s);
    const label = meter.nextElementSibling;
    if (label?.hasAttribute('data-password-label')) {
      label.textContent = input.value ? LABELS[s] : 'Use 12+ characters with a number and a symbol.';
    }
  });

  on(document, 'click', '[data-password-toggle]', (event, btn) => {
    const input = $(`#${btn.dataset.passwordToggle}`);
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.setAttribute('aria-pressed', String(show));
    btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });
}

/* 41 + 42 — submissions ------------------------------------------------ */

async function fakeSend(ms = 900) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function initSubmits() {
  // Contact / auth forms
  $$('form[data-async]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const fields = $$('input, textarea, select', form).filter((el) => el.type !== 'hidden');
      const valid = fields.map(validate).every(Boolean);
      if (!valid) {
        fields.find((el) => el.classList.contains('is-invalid'))?.focus();
        toast('Check the form', 'Some fields still need attention.', 'warning');
        return;
      }
      const submit = $('[type="submit"]', form);
      const original = submit?.innerHTML;
      if (submit) { submit.disabled = true; submit.innerHTML = '<span>Sending…</span>'; }

      await fakeSend();

      if (submit) { submit.disabled = false; submit.innerHTML = original; }
      form.reset();
      fields.forEach((el) => el.classList.remove('is-invalid'));
      const done = form.dataset.async || 'Sent';
      toast(done, form.dataset.asyncNote || '', 'success');
      const success = $('[data-form-success]', form.parentElement || form);
      if (success) success.hidden = false;
    });
  });

  // Newsletter (footer + modal)
  $$('[data-newsletter]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const input = $('input[type="email"]', form);
      if (!validate(input)) { input.focus(); return; }
      const known = storage.get('af-subscribed', []);
      if (known.includes(input.value.toLowerCase())) {
        toast('Already subscribed', 'That address is on the list.', 'info');
        return;
      }
      const submit = $('[type="submit"]', form);
      if (submit) submit.disabled = true;
      await fakeSend(700);
      if (submit) submit.disabled = false;
      storage.set('af-subscribed', [...known, input.value.toLowerCase()]);
      form.reset();
      toast('You are on the list', 'Check your inbox for the confirmation.', 'success');
      const modal = form.closest('.modal');
      if (modal && window.bootstrap) window.bootstrap.Modal.getInstance(modal)?.hide();
    });
  });
}

export function initForms() {
  initValidation();
  initPasswords();
  initSubmits();
}
