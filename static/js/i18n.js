/* =========================================================
   TahaGhasemi — i18n Engine
   static/js/i18n.js
   ========================================================= */

(function () {
  'use strict';

  const STORAGE_KEY = 'tg-lang';
  const DEFAULT_LANG = 'fa';
  const SUPPORTED = ['fa', 'en'];

  /* ---------- Helpers ---------- */

  function readStoredLang() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v && SUPPORTED.includes(v)) return v;
    } catch (_) { /* localStorage ممکن است در دسترس نباشد */ }
    return null;
  }

  function storeLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
  }

  function detectBrowserLang() {
    const nav = (navigator.language || 'fa').toLowerCase();
    return nav.startsWith('fa') ? 'fa' : 'en';
  }

  function getInitialLang() {
    return readStoredLang() || detectBrowserLang() || DEFAULT_LANG;
  }

  /* ---------- Dictionary lookup ---------- */

  /**
   * همه دیکشنری‌های بارگذاری‌شده را ادغام می‌کند.
   * هر صفحه فقط فایل ترجمه خودش را بارگذاری می‌کند،
   * اما اگر چند namespace وجود داشته باشد، همه با هم ادغام می‌شوند.
   */
  function buildDictionary(lang) {
    const all = window.TRANSLATIONS || {};
    const merged = {};
    for (const ns of Object.keys(all)) {
      const dict = all[ns] && all[ns][lang];
      if (dict && typeof dict === 'object') {
        Object.assign(merged, dict);
      }
    }
    return merged;
  }

  /* ---------- Apply translations ---------- */

  function applyTranslations(lang) {
    const dict = buildDictionary(lang);

    // 1. تغییر lang و dir روی <html>
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');

    // 2. متن‌ها
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const value = dict[key];
      if (typeof value === 'string' && value.length > 0) {
        el.textContent = value;
      }
    });

    // 3. placeholder / aria-label اختیاری
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const spec = el.getAttribute('data-i18n-attr'); // "placeholder:key" یا "aria-label:key"
      const [attr, key] = spec.split(':');
      const value = dict[key];
      if (attr && value) {
        el.setAttribute(attr, value);
      }
    });

    // 4. به‌روزرسانی دکمه سوئیچ زبان
    document.querySelectorAll('#lang-toggle').forEach((btn) => {
      btn.setAttribute(
        'aria-label',
        lang === 'fa' ? 'Switch to English' : 'تغییر به فارسی'
      );
    });

    // 5. اطلاع‌رسانی به بقیه اسکریپت‌ها
    document.dispatchEvent(
      new CustomEvent('languagechange', { detail: { lang } })
    );
  }

  /* ---------- Public API ---------- */

  const I18n = {
    current: DEFAULT_LANG,

    set(lang) {
      if (!SUPPORTED.includes(lang)) return;
      this.current = lang;
      storeLang(lang);
      applyTranslations(lang);
    },

    toggle() {
      this.set(this.current === 'fa' ? 'en' : 'fa');
    },

    t(key, fallback) {
      const dict = buildDictionary(this.current);
      return dict[key] || fallback || key;
    }
  };

  /* ---------- Init ---------- */

  function init() {
    I18n.current = getInitialLang();

    // اعمال فوری، حتی قبل از DOMContentLoaded برای جلوگیری از پرش
    applyTranslations(I18n.current);

    // اتصال دکمه‌ها (در صورت وجود در صفحه)
    document.addEventListener('DOMContentLoaded', () => {
      const toggleBtn = document.getElementById('lang-toggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => I18n.toggle());
      }
    });
  }

  // اگر DOM آماده نیست، صبر می‌کنیم؛ وگرنه اجرا می‌کنیم
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.I18n = I18n;
})();