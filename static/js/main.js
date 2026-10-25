/* =========================================================
   TahaGhasemi — Main UI Logic
   static/js/main.js
   ========================================================= */

(function () {
  'use strict';

  /* =========================================================
     1. Mobile Navigation
     ========================================================= */

  function initMobileNav() {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    function openMenu() {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    }

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    // کلیک روی دکمه
    toggle.addEventListener('click', () => {
      isOpen() ? closeMenu() : openMenu();
    });

    // بستن با کلیک بیرون
    document.addEventListener('click', (e) => {
      if (!isOpen()) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });

    // بستن با Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        closeMenu();
        toggle.focus();
      }
    });

    // بستن هنگام کلیک روی لینک‌ها (برای ناوبری تمیزتر)
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (isOpen()) closeMenu();
      });
    });

    // اگر صفحه از موبایل به دسکتاپ تغییر اندازه داد، منو ریست شود
    const mq = window.matchMedia('(min-width: 861px)');
    mq.addEventListener('change', (e) => {
      if (e.matches && isOpen()) closeMenu();
    });
  }

  /* =========================================================
     2. Header Scroll State
     کلاس .is-scrolled را وقتی کاربر اسکرول کرد اضافه می‌کند.
     ========================================================= */

  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastState = false;

    function update() {
      const scrolled = window.scrollY > 12;
      if (scrolled !== lastState) {
        header.classList.toggle('is-scrolled', scrolled);
        lastState = scrolled;
      }
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* =========================================================
     3. Reveal on Scroll
     عناصر با کلاس .reveal هنگام ورود به دید، .is-visible می‌گیرند.
     اگر کاربر prefers-reduced-motion دارد، فوراً نمایش داده می‌شوند.
     ========================================================= */

  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* =========================================================
     4. Active Page Indicator
     اگر صفحه فعلی با data-page شناخته شود، لینک متناظر را active می‌کند.
     (پشتیبان برای زمانی که HTML خودش active نگذاشته باشد)
     ========================================================= */

  function initActivePage() {
    const body = document.body;
    const current = body.getAttribute('data-page');
    if (!current) return;

    document.querySelectorAll('.main-nav a').forEach((link) => {
      const href = link.getAttribute('href') || '';
      const slug = href.replace(/\.html$/, '').replace(/^\.?\//, '');
      if (slug === current) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* =========================================================
     5. Smooth Anchor Scroll (با احترام به ارتفاع هدر)
     ========================================================= */

  function initAnchorScroll() {
    const header = document.querySelector('.site-header');
    const headerH = header ? header.offsetHeight : 72;

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;

        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;

        window.scrollTo({
          top,
          behavior:
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'auto'
              : 'smooth',
        });
      });
    });
  }

  /* =========================================================
     6. Init
     ========================================================= */

  function init() {
    initMobileNav();
    initHeaderScroll();
    initReveal();
    initActivePage();
    initAnchorScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();