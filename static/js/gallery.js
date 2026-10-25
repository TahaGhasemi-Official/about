/* =========================================================
   TahaGhasemi — Gallery Logic
   static/js/gallery.js

   وظایف:
   - خواندن window.GALLERY_ITEMS
   - بررسی وجود فایل تصویر با Image()
   - ساخت گرید برای تصاویر معتبر
   - لایت‌باکس با prev/next و counter
   - کنترل با کیبورد: Escape، ArrowLeft، ArrowRight
   - Focus trap و بازگشت فوکوس
   - respect prefers-reduced-motion
   ========================================================= */

(function () {
  'use strict';

  const state = {
    items: [],         // آیتم‌های معتبر (با فایل موجود)
    cells: [],         // مراجع DOM به دکمه‌های گالری
    currentIndex: -1,  // -۱ = بسته
    lastFocused: null,
    keydownHandler: null,
  };

  /* ---------- Helpers ---------- */

  function t(key, fallback) {
    return window.I18n && window.I18n.t ? window.I18n.t(key, fallback) : fallback;
  }

  function isValidItem(item) {
    return (
      item &&
      typeof item === 'object' &&
      typeof item.src === 'string' && item.src.trim().length > 0 &&
      typeof item.alt === 'string' && item.alt.trim().length > 0
    );
  }

  /* ---------- Preload / existence check ---------- */

  function checkImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      let settled = false;

      function finish(ok) {
        if (settled) return;
        settled = true;
        img.onload = null;
        img.onerror = null;
        resolve(ok);
      }

      img.onload = () => finish(true);
      img.onerror = () => finish(false);

      setTimeout(() => finish(false), 8000);

      img.src = src;
    });
  }

  async function prepareItems() {
    const raw = Array.isArray(window.GALLERY_ITEMS) ? window.GALLERY_ITEMS : [];
    const valid = raw.filter(isValidItem);

    const results = await Promise.all(
      valid.map(async (item) => {
        const ok = await checkImage(item.src);
        return ok ? item : null;
      })
    );

    return results.filter(Boolean);
  }

  /* ---------- Rendering ---------- */

  function createCell(item, index) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gallery-item';
    btn.setAttribute('aria-label', `${t('gallery.viewer.open', 'Open image')}: ${item.alt}`);

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt;
    img.loading = 'lazy';
    img.decoding = 'async';

    btn.appendChild(img);

    if (item.caption) {
      const cap = document.createElement('span');
      cap.className = 'gallery-item-caption';
      cap.textContent = item.caption;
      btn.appendChild(cap);
    }

    btn.addEventListener('click', () => openLightbox(index));

    return btn;
  }

  function render(items) {
    const grid = document.getElementById('gallery-grid');
    const empty = document.getElementById('gallery-empty');
    if (!grid || !empty) return;

    grid.innerHTML = '';
    grid.setAttribute('aria-busy', 'false');
    state.cells = [];

    if (items.length === 0) {
      grid.hidden = true;
      empty.hidden = false;
      return;
    }

    empty.hidden = true;
    grid.hidden = false;

    items.forEach((item, i) => {
      const cell = createCell(item, i);
      grid.appendChild(cell);
      state.cells.push(cell);
    });
  }

  /* ---------- Lightbox ---------- */

  function getLightbox() {
    return {
      root: document.getElementById('lightbox'),
      img: document.getElementById('lightbox-img'),
      caption: document.getElementById('lightbox-caption'),
      counter: document.getElementById('lightbox-counter'),
      closeBtn: document.querySelector('.lightbox-close'),
      prevBtn: document.querySelector('[data-lightbox-prev]'),
      nextBtn: document.querySelector('[data-lightbox-next]'),
    };
  }

  function updateLightbox() {
    const { img, caption, counter } = getLightbox();
    const item = state.items[state.currentIndex];
    if (!item) return;

    img.src = item.src;
    img.alt = item.alt;

    if (item.caption) {
      caption.textContent = item.caption;
      caption.hidden = false;
    } else {
      caption.textContent = '';
      caption.hidden = true;
    }

    counter.textContent = `${state.currentIndex + 1} / ${state.items.length}`;
  }

  function focusablesInModal(root) {
    const selector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    return Array.from(root.querySelectorAll(selector)).filter(
      (el) => !el.disabled && el.offsetParent !== null
    );
  }

  function openLightbox(index) {
    if (index < 0 || index >= state.items.length) return;

    const { root } = getLightbox();
    if (!root) return;

    state.lastFocused = document.activeElement;
    state.currentIndex = index;

    updateLightbox();

    root.hidden = false;
    root.setAttribute('aria-hidden', 'false');
    // پویا برای انیمیشن
    requestAnimationFrame(() => root.classList.add('is-open'));

    document.body.style.overflow = 'hidden';

    // فوکوس روی دکمه close
    const { closeBtn } = getLightbox();
    if (closeBtn) closeBtn.focus();

    // نصب keydown
    state.keydownHandler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        showNext();
      } else if (e.key === 'Tab') {
        // Focus trap
        const focusables = focusablesInModal(root);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', state.keydownHandler);
  }

  function closeLightbox() {
    const { root } = getLightbox();
    if (!root) return;

    root.classList.remove('is-open');
    root.setAttribute('aria-hidden', 'true');

    // بعد از انیمیشن، مخفی کامل
    setTimeout(() => {
      root.hidden = true;
      const { img } = getLightbox();
      if (img) img.src = '';
    }, 220);

    document.body.style.overflow = '';

    if (state.keydownHandler) {
      document.removeEventListener('keydown', state.keydownHandler);
      state.keydownHandler = null;
    }

    if (state.lastFocused && typeof state.lastFocused.focus === 'function') {
      state.lastFocused.focus();
    }
    state.lastFocused = null;
    state.currentIndex = -1;
  }

  function showPrev() {
    if (state.items.length === 0) return;
    state.currentIndex =
      (state.currentIndex - 1 + state.items.length) % state.items.length;
    updateLightbox();
  }

  function showNext() {
    if (state.items.length === 0) return;
    state.currentIndex = (state.currentIndex + 1) % state.items.length;
    updateLightbox();
  }

  /* ---------- Wiring ---------- */

  function bindLightbox() {
    const { root, prevBtn, nextBtn } = getLightbox();
    if (!root) return;

    // بستن با کلیک روی backdrop یا دکمه close
    root.querySelectorAll('[data-lightbox-close]').forEach((el) => {
      el.addEventListener('click', closeLightbox);
    });

    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);

    // swipe ساده (اختیاری — موبایل)
    let touchStartX = 0;
    let touchEndX = 0;
    root.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );
    root.addEventListener(
      'touchend',
      (e) => {
        if (!e.changedTouches.length) return;
        touchEndX = e.changedTouches[0].clientX;
        const dx = touchEndX - touchStartX;
        if (Math.abs(dx) > 50) {
          if (dx > 0) {
            showPrev();
          } else {
            showNext();
          }
        }
      },
      { passive: true }
    );
  }

  /* ---------- Init ---------- */

  async function init() {
    try {
      const items = await prepareItems();
      state.items = items;
      render(items);
    } catch (err) {
      render([]);
    }

    bindLightbox();

    // به‌روزرسانی aria-label در سوئیچ زبان
    document.addEventListener('languagechange', () => {
      state.cells.forEach((cell, i) => {
        const item = state.items[i];
        if (item) {
          cell.setAttribute(
            'aria-label',
            `${t('gallery.viewer.open', 'Open image')}: ${item.alt}`
          );
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();