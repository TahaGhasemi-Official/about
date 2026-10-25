/* =========================================================
   TahaGhasemi — Music Player Logic (Advanced Controls)
   static/js/music.js
   ========================================================= */

(function () {
  'use strict';

  const FIELDS = ['name', 'tag', 'creator', 'disc', 'location'];

  /* ---------- State ---------- */
  const state = {
    tracks: [],          
    currentIndex: -1,    
    audio: null,         
    cards: [],           
    isShuffle: false     
  };

  /* ---------- Helpers ---------- */
  function isCompleteSlot(slot) {
    if (!slot || typeof slot !== 'object') return false;
    return FIELDS.every((key) => {
      const v = slot[key];
      return typeof v === 'string' && v.trim().length > 0;
    });
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function t(key, fallback) {
    return window.I18n && window.I18n.t ? window.I18n.t(key, fallback) : fallback;
  }

  /* ---------- File availability check ---------- */
  function checkFileAvailability(location) {
    return new Promise((resolve) => {
      const probe = new Audio();
      let settled = false;
      function finish(ok) {
        if (settled) return;
        settled = true;
        probe.removeEventListener('canplaythrough', onReady);
        probe.removeEventListener('loadedmetadata', onReady);
        probe.removeEventListener('error', onError);
        probe.src = '';
        probe.load();
        resolve(ok);
      }
      function onReady() { finish(true); }
      function onError() { finish(false); }
      probe.addEventListener('canplaythrough', onReady, { once: true });
      probe.addEventListener('loadedmetadata', onReady, { once: true });
      probe.addEventListener('error', onError, { once: true });
      setTimeout(() => finish(false), 8000);
      probe.preload = 'metadata';
      probe.src = location;
    });
  }

  async function prepareTracks() {
    const raw = Array.isArray(window.MUSIC_SLOTS) ? window.MUSIC_SLOTS : [];
    const validSlots = raw.filter(isCompleteSlot);
    const results = await Promise.all(
      validSlots.map(async (slot) => {
        const ok = await checkFileAvailability(slot.location);
        return ok ? slot : null;
      })
    );
    return results.filter(Boolean);
  }

  /* ---------- Rendering (UI) ---------- */

  // ساخت دکمه آیکونی با SVG
  function createControlBtn(className, label, svgContent) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `music-ctrl-btn ${className}`;
    btn.setAttribute('aria-label', label);
    btn.innerHTML = svgContent;
    return btn;
  }

  function createCard(track, index) {
    const card = document.createElement('article');
    card.className = 'glass music-card';
    card.setAttribute('data-track-index', String(index));

    // --- هدر کارت (عنوان و تگ) ---
    const header = document.createElement('header');
    header.className = 'music-card-head';
    const titleWrap = document.createElement('div');
    titleWrap.className = 'music-card-title-wrap';
    const title = document.createElement('h3');
    title.className = 'music-card-title';
    title.textContent = track.name;
    const creator = document.createElement('p');
    creator.className = 'music-card-creator';
    creator.textContent = track.creator;
    titleWrap.appendChild(title);
    titleWrap.appendChild(creator);
    const tag = document.createElement('span');
    tag.className = 'music-card-tag';
    tag.textContent = track.tag;
    header.appendChild(titleWrap);
    header.appendChild(tag);

    // --- توضیحات ---
    const disc = document.createElement('p');
    disc.className = 'music-card-disc';
    disc.textContent = track.disc;

    // --- بخش کنترل‌ها ---
    const controls = document.createElement('div');
    controls.className = 'music-card-controls';

    // 1. دکمه‌های اضافی (قبلی، بعدی، شافل، ریپلی)
    // آیکون‌ها به صورت SVG inline
    const svgPrev = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>`;
    const svgNext = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>`;
    const svgShuffle = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>`;
    const svgReplay = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v6h6"/><path d="M3 8a9 9 0 1 0 2.32-6.36L3 8"/></svg>`;

    const btnPrev = createControlBtn('music-btn-prev', 'Previous Track', svgPrev);
    const btnPlay = createControlBtn('music-play-btn', t('music.track.play', 'Play'), `<svg class="icon-play" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><svg class="icon-pause" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="display:none"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>`);
    const btnNext = createControlBtn('music-btn-next', 'Next Track', svgNext);
    const btnReplay = createControlBtn('music-btn-replay', 'Replay Track', svgReplay);
    const btnShuffle = createControlBtn('music-btn-shuffle', 'Shuffle All', svgShuffle);

    // در ابتدا دکمه‌های Prev, Next, Replay غیرفعال هستند (چون آهنگی انتخاب نشده)
    btnPrev.classList.add('is-disabled');
    btnNext.classList.add('is-disabled');
    btnReplay.classList.add('is-disabled');

    // چیدمان کنترل‌ها (ردیف اول دکمه‌های اصلی، ردیف دوم نوار پیشرفت)
    const mainControls = document.createElement('div');
    mainControls.className = 'music-main-controls';
    mainControls.appendChild(btnPrev);
    mainControls.appendChild(btnPlay);
    mainControls.appendChild(btnNext);
    mainControls.appendChild(btnReplay);
    mainControls.appendChild(btnShuffle);

    // نوار پیشرفت و زمان
    const progressWrap = document.createElement('div');
    progressWrap.className = 'music-progress-wrap';
    const time = document.createElement('span');
    time.className = 'music-time';
    time.textContent = '0:00 / 0:00';
    const progress = document.createElement('div');
    progress.className = 'music-progress';
    progress.setAttribute('role', 'progressbar');
    const progressFill = document.createElement('span');
    progressFill.className = 'music-progress-fill';
    progress.appendChild(progressFill);

    progressWrap.appendChild(progress);
    progressWrap.appendChild(time);

    controls.appendChild(mainControls);
    controls.appendChild(progressWrap);

    // اتصال به DOM
    card.appendChild(header);
    card.appendChild(disc);
    card.appendChild(controls);

    // --- Event Listeners برای این کارت ---
    btnPlay.addEventListener('click', () => {
      if (state.currentIndex === index && !state.audio.paused) {
        pause();
      } else {
        play(index);
      }
    });

    btnPrev.addEventListener('click', () => {
      if (btnPrev.classList.contains('is-disabled')) return;
      playPrev(index);
    });

    btnNext.addEventListener('click', () => {
      if (btnNext.classList.contains('is-disabled')) return;
      playNext(index);
    });

    btnReplay.addEventListener('click', () => {
      if (btnReplay.classList.contains('is-disabled')) return;
      replay(index);
    });

    btnShuffle.addEventListener('click', () => {
      toggleShuffle();
    });

    return {
      el: card,
      btnPlay, btnPrev, btnNext, btnReplay, btnShuffle,
      progressFill, progressBar: progress, time,
      iconPlay: btnPlay.querySelector('.icon-play'),
      iconPause: btnPlay.querySelector('.icon-pause')
    };
  }

  function renderTracks(tracks) {
    const library = document.getElementById('music-library');
    const empty = document.getElementById('music-empty');
    if (!library || !empty) return;
    library.innerHTML = '';
    library.setAttribute('aria-busy', 'false');
    state.cards = [];
    if (tracks.length === 0) {
      library.hidden = true;
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    library.hidden = false;
    tracks.forEach((track, i) => {
      const card = createCard(track, i);
      library.appendChild(card.el);
      state.cards.push(card);
    });
  }

  /* ---------- Playback Logic ---------- */
  function ensureAudio() {
    if (state.audio) return state.audio;
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.addEventListener('timeupdate', () => {
      if (state.currentIndex < 0) return;
      const card = state.cards[state.currentIndex];
      if (!card) return;
      const dur = audio.duration || 0;
      const cur = audio.currentTime || 0;
      const pct = dur > 0 ? (cur / dur) * 100 : 0;
      card.progressFill.style.width = `${pct}%`;
      card.progressBar.setAttribute('aria-valuenow', String(Math.round(pct)));
      card.time.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
    });

    audio.addEventListener('ended', () => {
      if (state.isShuffle) {
        playRandom();
      } else {
        playNext(state.currentIndex);
      }
    });

    audio.addEventListener('error', () => {
      const idx = state.currentIndex;
      if (idx >= 0) {
        const card = state.cards[idx];
        if (card) card.time.textContent = t('music.track.unavailable', 'File unavailable');
        resetCard(idx);
      }
      state.currentIndex = -1;
    });
    state.audio = audio;
    return audio;
  }

  function resetAllCards() {
    state.cards.forEach((card, i) => resetCard(i));
  }

  function resetCard(index) {
    const card = state.cards[index];
    if (!card) return;
    card.iconPlay.style.display = '';
    card.iconPause.style.display = 'none';
    card.btnPlay.setAttribute('aria-label', t('music.track.play', 'Play'));
    card.el.classList.remove('is-playing');
    card.progressFill.style.width = '0%';
    card.progressBar.setAttribute('aria-valuenow', '0');
    // غیرفعال کردن دکمه‌های کنترل
    card.btnPrev.classList.add('is-disabled');
    card.btnNext.classList.add('is-disabled');
    card.btnReplay.classList.add('is-disabled');
  }

  function enableControls(index) {
    const card = state.cards[index];
    if (!card) return;
    card.btnPrev.classList.remove('is-disabled');
    card.btnNext.classList.remove('is-disabled');
    card.btnReplay.classList.remove('is-disabled');
  }

  function play(index) {
    const track = state.tracks[index];
    if (!track) return;
    const audio = ensureAudio();

    // اگر آهنگ دیگری در حال پخش است، اول ریست کن
    if (state.currentIndex >= 0 && state.currentIndex !== index) {
      resetCard(state.currentIndex);
    }
    state.currentIndex = index;
    const card = state.cards[index];

    // فعال کردن دکمه‌های کنترل
    enableControls(index);

    audio.src = track.location;
    audio.currentTime = 0;

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.then(() => {
        card.iconPlay.style.display = 'none';
        card.iconPause.style.display = '';
        card.btnPlay.setAttribute('aria-label', t('music.track.pause', 'Pause'));
        card.el.classList.add('is-playing');
      }).catch(() => {
        card.time.textContent = t('music.track.unavailable', 'File unavailable');
        resetCard(index);
        state.currentIndex = -1;
      });
    }
  }

  function pause() {
    if (!state.audio) return;
    state.audio.pause();
    const idx = state.currentIndex;
    if (idx >= 0) {
      const card = state.cards[idx];
      card.iconPlay.style.display = '';
      card.iconPause.style.display = 'none';
      card.btnPlay.setAttribute('aria-label', t('music.track.play', 'Play'));
      card.el.classList.remove('is-playing');
    }
  }

  function playNext(currentIdx) {
    if (state.tracks.length === 0) return;
    const nextIdx = (currentIdx + 1) % state.tracks.length;
    play(nextIdx);
  }

  function playPrev(currentIdx) {
    if (state.tracks.length === 0) return;
    const prevIdx = (currentIdx - 1 + state.tracks.length) % state.tracks.length;
    play(prevIdx);
  }

  function replay(index) {
    if (state.audio) {
      state.audio.currentTime = 0;
      if (state.audio.paused) play(index);
    }
  }

  function playRandom() {
    if (state.tracks.length === 0) return;
    let randomIdx;
    do {
      randomIdx = Math.floor(Math.random() * state.tracks.length);
    } while (randomIdx === state.currentIndex && state.tracks.length > 1);
    play(randomIdx);
  }

  function toggleShuffle() {
    state.isShuffle = !state.isShuffle;
    state.cards.forEach(card => {
      card.btnShuffle.classList.toggle('is-active', state.isShuffle);
    });
    if (state.isShuffle) {
      playRandom();
    }
  }

  /* ---------- Init ---------- */
  async function init() {
    try {
      const tracks = await prepareTracks();
      state.tracks = tracks;
      renderTracks(tracks);
    } catch (err) {
      renderTracks([]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();