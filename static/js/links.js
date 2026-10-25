/* =========================================================
   TahaGhasemi — Links Directory Logic
   static/js/links.js

   وظایف:
   - خواندن window.LINKS_ITEMS
   - اعتبارسنجی url (http/https)
   - رندر کارت‌های لینک با آیکون، عنوان و توضیح
   - گروه‌بندی بر اساس category
   - پشتیبانی از زبان فعال (fa/en) در عنوان و توضیح
   - به‌روزرسانی هنگام سوئیچ زبان
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Icon SVG map ---------- */

  const ICONS = {
    instagram:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />' +
      '<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />' +
      '<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />' +
      '</svg>',
    telegram:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">' +
      '<path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />' +
      '</svg>',
    bale:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />' +
      '</svg>',
    github:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-.99-.02-1.94-3.2.69-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.9-.39.99 0 1.98.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.41.35.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.15 0 .3.21.67.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />' +
      '</svg>',
    website:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="10" />' +
      '<line x1="2" y1="12" x2="22" y2="12" />' +
      '<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />' +
      '</svg>',
    project:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />' +
      '<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />' +
      '</svg>',
    resource:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />' +
      '<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />' +
      '</svg>',
    default:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />' +
      '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />' +
      '</svg>'
  };

  /* ---------- State ---------- */

  const state = {
    items: [],
    groups: {} // { social: [...], project: [...], ... }
  };

  /* ---------- Helpers ---------- */

  function t(key, fallback) {
    return window.I18n && window.I18n.t ? window.I18n.t(key, fallback) : fallback;
  }

  function currentLang() {
    return (window.I18n && window.I18n.current) || 'fa';
  }

  function isValidUrl(url) {
    if (typeof url !== 'string') return false;
    try {
      const u = new URL(url, window.location.href);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  function isValidItem(item) {
    return (
      item &&
      typeof item === 'object' &&
      item.title &&
      typeof item.title === 'object' &&
      (item.title.fa || item.title.en) &&
      item.description &&
      typeof item.description === 'object' &&
      isValidUrl(item.url)
    );
  }

  function localized(obj) {
    if (!obj || typeof obj !== 'object') return '';
    const lang = currentLang();
    return obj[lang] || obj.fa || obj.en || '';
  }

  function getIconSvg(key) {
    return ICONS[key] || ICONS.default;
  }

  /* ---------- Rendering ---------- */

  function createLinkCard(item) {
    const a = document.createElement('a');
    a.className = 'glass link-card';
    a.href = item.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', `${localized(item.title)} — ${t('links.external', 'Opens in a new tab')}`);

    const icon = document.createElement('span');
    icon.className = `link-icon link-icon--${item.icon || 'default'}`;
    icon.innerHTML = getIconSvg(item.icon);

    const body = document.createElement('div');
    body.className = 'link-body';

    const title = document.createElement('h3');
    title.className = 'link-title';
    title.textContent = localized(item.title);

    const desc = document.createElement('p');
    desc.className = 'link-desc';
    desc.textContent = localized(item.description);

    body.appendChild(title);
    body.appendChild(desc);

    const arrow = document.createElement('span');
    arrow.className = 'link-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';

    a.appendChild(icon);
    a.appendChild(body);
    a.appendChild(arrow);

    return a;
  }

  function renderGroups(groups) {
    const grid = document.getElementById('links-grid');
    const empty = document.getElementById('links-empty');
    if (!grid || !empty) return;

    grid.innerHTML = '';
    grid.setAttribute('aria-busy', 'false');

    const categories = Object.keys(groups).filter(
      (cat) => Array.isArray(groups[cat]) && groups[cat].length > 0
    );

    if (categories.length === 0) {
      grid.hidden = true;
      empty.hidden = false;
      return;
    }

    empty.hidden = true;
    grid.hidden = false;

    categories.forEach((cat) => {
      const section = document.createElement('div');
      section.className = 'links-group';

      const heading = document.createElement('h3');
      heading.className = 'links-group-title';
      const catKey = `links.category.${cat}`;
      heading.textContent = t(catKey, cat);
      section.appendChild(heading);

      const list = document.createElement('div');
      list.className = 'links-group-list';

      groups[cat].forEach((item) => {
        list.appendChild(createLinkCard(item));
      });

      section.appendChild(list);
      grid.appendChild(section);
    });
  }

  /* ---------- Data ---------- */

  function prepareItems() {
    const raw = Array.isArray(window.LINKS_ITEMS) ? window.LINKS_ITEMS : [];
    return raw.filter(isValidItem);
  }

  function groupItems(items) {
    const groups = {};
    items.forEach((item) => {
      const cat = item.category || 'default';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }

  /* ---------- Init ---------- */

  function init() {
    state.items = prepareItems();
    state.groups = groupItems(state.items);
    renderGroups(state.groups);

    // رندر مجدد روی تغییر زبان
    document.addEventListener('languagechange', () => {
      renderGroups(state.groups);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();