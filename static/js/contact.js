/* =========================================================
   TahaGhasemi — Contact Logic
   static/js/contact.js

   وظایف:
   - کپی یوزرنیم با navigator.clipboard و fallback
   - بازخورد بصری («کپی شد» / «کپی نشد»)
   - بازگردانی متن دکمه بعد از ۲ ثانیه
   - به‌روزرسانی برچسب‌ها هنگام سوئیچ زبان
   ========================================================= */

(function () {
  'use strict';

  const FEEDBACK_MS = 1800;

  function t(key, fallback) {
    return window.I18n && window.I18n.t ? window.I18n.t(key, fallback) : fallback;
  }

  /* ---------- Clipboard ---------- */

  async function copyText(text) {
    // روش مدرن
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        /* بی‌صدا رد شو، سراغ fallback برو */
      }
    }

    // fallback: textarea مخفی
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (_) {
      return false;
    }
  }

  /* ---------- Visual feedback ---------- */

  function setFeedback(btn, success) {
    const label = btn.querySelector('span');
    if (!label) return;

    if (!btn.dataset.originalLabel) {
      btn.dataset.originalLabel = label.textContent;
    }

    btn.classList.toggle('is-copied', success);
    btn.classList.toggle('is-error', !success);

    label.textContent = success
      ? t('contact.copied', 'Copied')
      : t('contact.copyError', 'Copy failed');

    btn.setAttribute('aria-live', 'polite');

    if (btn._feedbackTimer) {
      clearTimeout(btn._feedbackTimer);
    }
    btn._feedbackTimer = setTimeout(() => {
      btn.classList.remove('is-copied', 'is-error');
      label.textContent = t('contact.copy', 'Copy');
      btn._feedbackTimer = null;
    }, FEEDBACK_MS);
  }

  /* ---------- Wiring ---------- */

  function initCopyButtons() {
    const buttons = document.querySelectorAll('.copy-btn[data-copy]');
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy') || '';
        if (!text) return;

        const ok = await copyText(text);
        setFeedback(btn, ok);
      });
    });
  }

  function refreshOnLanguageChange() {
    document.addEventListener('languagechange', () => {
      document.querySelectorAll('.copy-btn').forEach((btn) => {
        if (btn._feedbackTimer) return; // در حال بازخورد — دست نزن
        const label = btn.querySelector('span');
        if (label) label.textContent = t('contact.copy', 'Copy');
      });
    });
  }

  /* ---------- Init ---------- */

  function init() {
    initCopyButtons();
    refreshOnLanguageChange();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();