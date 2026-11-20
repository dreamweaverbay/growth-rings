// Shared UI pieces.
import { sfx } from './sound.js';

export function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') {
      for (const [sk, sv] of Object.entries(v)) {
        if (sk.startsWith('--')) n.style.setProperty(sk, sv);
        else n.style[sk] = sv;
      }
    }
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2).toLowerCase(), v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) {
    if (kid === null || kid === undefined || kid === false) continue;
    n.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return n;
}

export function svg(markup, cls = '') {
  const wrap = document.createElement('span');
  wrap.className = 'svgwrap ' + cls;
  wrap.innerHTML = markup;
  return wrap;
}

export const icons = {
  back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  home: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="5.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor"/><path d="M8 11V8a4 4 0 018 0v3" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  people: '<svg viewBox="0 0 32 24"><circle cx="10" cy="7" r="4.2" fill="currentColor"/><path d="M2 22c0-5 3.6-8 8-8s8 3 8 8z" fill="currentColor"/><circle cx="23" cy="9" r="3.4" fill="currentColor" opacity=".75"/><path d="M17 22c.4-4 2.8-6.5 6-6.5s6 2.5 6 6.5z" fill="currentColor" opacity=".75"/></svg>',
  leaf: '<svg viewBox="0 0 24 24"><path d="M5 19C5 10 11 4 20 4c0 9-6 15-15 15z" fill="#d9a521"/><path d="M5 19L14 10" stroke="#8a6410" stroke-width="1.6" stroke-linecap="round"/></svg>',
  bulb: '<svg viewBox="0 0 24 24"><path d="M12 3a6 6 0 00-3.5 10.9V17h7v-3.1A6 6 0 0012 3z" fill="currentColor"/><rect x="9" y="18.5" width="6" height="2.5" rx="1" fill="currentColor"/></svg>',
  speaker: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  again: '<svg viewBox="0 0 24 24"><path d="M19 12a7 7 0 11-2.05-4.95" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M19 4v5h-5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

// Activity icons — simple, flat, not cartoonish.
export const activityIcons = {
  story: `<svg viewBox="0 0 64 64"><path d="M8 14c8-3 16-3 24 2v36c-8-5-16-5-24-2z" fill="#f4d9b0" stroke="#7a4a22" stroke-width="2.5" stroke-linejoin="round"/><path d="M56 14c-8-3-16-3-24 2v36c8-5 16-5 24-2z" fill="#fbe9cc" stroke="#7a4a22" stroke-width="2.5" stroke-linejoin="round"/><path d="M40 44c3-6 2-10-2-14s-2-8 3-10" fill="none" stroke="#c9742e" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 5"/><path d="M16 26h9M16 32h9M16 38h6" stroke="#b08158" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  grove: `<svg viewBox="0 0 64 64"><rect x="8" y="8" width="48" height="48" rx="8" fill="#e9f0dc" stroke="#4e7a32" stroke-width="2.5"/><path d="M32 8v48M8 32h48" stroke="#4e7a32" stroke-width="2.5"/><path d="M14 26c0-7 4-11 11-11 0 7-4 11-11 11z" fill="#5f8f3e"/><ellipse cx="44" cy="22" rx="5.5" ry="6.5" fill="#a8672e"/><path d="M37.5 18.5c1-4 12-4 13 0z" fill="#6b3f1a"/><path d="M18 40h12a6 6 0 01-12 0z" fill="#c9453a" transform="translate(2 -2)"/><rect x="24" y="44" width="4" height="6" rx="1.5" fill="#f1e2c9"/><path d="M44 38l6 12h-12z" fill="#7a5532"/></svg>`,
  magic: `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="50" rx="22" ry="6" fill="#3a2a4a"/><path d="M18 50V24h28v26z" fill="#4b3560"/><rect x="18" y="38" width="28" height="5" fill="#c94f6d"/><ellipse cx="32" cy="24" rx="14" ry="4" fill="#5d4378"/><path d="M50 10l1.8 4.2L56 16l-4.2 1.8L50 22l-1.8-4.2L44 16l4.2-1.8z" fill="#f2c14e"/><path d="M12 14l1.1 2.4L15.5 17.5l-2.4 1.1L12 21l-1.1-2.4L8.5 17.5l2.4-1.1z" fill="#f2c14e"/></svg>`,
  weather: `<svg viewBox="0 0 64 64"><circle cx="24" cy="24" r="10" fill="#f2b33d"/><g stroke="#f2b33d" stroke-width="3" stroke-linecap="round"><path d="M24 6v4M24 38v4M6 24h4M10.5 10.5l3 3M34.5 13.5l3-3M10.5 37.5l3-3"/></g><path d="M22 50a9 9 0 010-18 12 12 0 0123 3 7.5 7.5 0 011 15z" fill="#fff" stroke="#3f7fb8" stroke-width="2.5" stroke-linejoin="round"/></svg>`,
  facts: `<svg viewBox="0 0 64 64"><path d="M10 40C10 20 22 8 44 8c0 22-12 34-34 32z" fill="#6fae55"/><path d="M10 40L34 18" stroke="#3d6b25" stroke-width="2.5" stroke-linecap="round"/><circle cx="38" cy="38" r="13" fill="#eaf5fb" fill-opacity=".85" stroke="#5b3a22" stroke-width="4"/><path d="M48 48l10 10" stroke="#5b3a22" stroke-width="6" stroke-linecap="round"/></svg>`,
  fishing: `<svg viewBox="0 0 64 64"><path d="M6 36c8-12 26-14 38-4l10-8v24l-10-8C32 50 14 48 6 36z" fill="#5f8f4e"/><path d="M16 36c10 4 22 4 28-4" stroke="#3e6a32" stroke-width="2.5" fill="none"/><circle cx="15" cy="32" r="2.6" fill="#1d2a14"/><path d="M40 4v12" stroke="#5a5f66" stroke-width="2.5"/><path d="M40 16v6a4 4 0 01-8 0" stroke="#5a5f66" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="40" cy="6" r="3" fill="#e0574c"/></svg>`,
  build: `<svg viewBox="0 0 64 64"><path d="M14 22l18-9 18 9-18 9z" fill="#5aa0d8" fill-opacity=".85" stroke="#235a86" stroke-width="2" stroke-linejoin="round"/><path d="M14 22v20l18 9V31z" fill="#e0574c" fill-opacity=".85" stroke="#8c2a22" stroke-width="2" stroke-linejoin="round"/><path d="M50 22v20l-18 9V31z" fill="#f2c14e" fill-opacity=".85" stroke="#9a7212" stroke-width="2" stroke-linejoin="round"/><path d="M32 4l9 9H23z" fill="#6cbf6a" fill-opacity=".9" stroke="#2f7a2d" stroke-width="2" stroke-linejoin="round"/></svg>`,
};

export function iconButton(name, label, onClick, cls = '') {
  return el('button', { class: 'iconbtn ' + cls, 'aria-label': label, onclick: (e) => { sfx.tap(); onClick(e); } }, svg(icons[name]));
}

export function bigButton(text, onClick, cls = '') {
  return el('button', { class: 'bigbtn ' + cls, onclick: (e) => { sfx.tap(); onClick(e); } }, text);
}

// Hold-to-confirm button for grown-ups.
export function holdButton(text, onDone, ms = 1400) {
  let timer = null;
  let start = 0;
  let raf = 0;
  const fill = el('span', { class: 'holdfill' });
  const label = el('span', { class: 'holdlabel' }, text);
  const btn = el('button', { class: 'holdbtn' }, fill, label);
  const stop = () => {
    clearTimeout(timer); cancelAnimationFrame(raf);
    fill.style.transform = 'scaleX(0)';
    btn.classList.remove('holding');
  };
  const tick = () => {
    const p = Math.min(1, (performance.now() - start) / ms);
    fill.style.transform = `scaleX(${p})`;
    if (p < 1) raf = requestAnimationFrame(tick);
  };
  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    start = performance.now();
    btn.classList.add('holding');
    raf = requestAnimationFrame(tick);
    timer = setTimeout(() => {
      cancelAnimationFrame(raf);
      fill.style.transform = 'scaleX(1)';
      btn.classList.remove('holding');
      btn.classList.add('confirmed');
      btn.disabled = true;
      label.textContent = 'Thanks, grown-up!';
      onDone();
    }, ms);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, () => { if (!btn.disabled) stop(); }));
  btn.addEventListener('contextmenu', e => e.preventDefault());
  return btn;
}

export function toast(text, ms = 2200) {
  const t = el('div', { class: 'toast' }, text);
  document.body.append(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, ms);
}

export function overlay(content, cls = '') {
  const o = el('div', { class: 'overlay ' + cls }, el('div', { class: 'overlay-card' }, content));
  document.body.append(o);
  requestAnimationFrame(() => o.classList.add('show'));
  return {
    node: o,
    close() { o.classList.remove('show'); setTimeout(() => o.remove(), 300); },
  };
}

// Grown-up gate: a multiplication question a six-year-old is unlikely to answer.
export function grownUpGate(onPass) {
  const a = 12 + Math.floor(Math.random() * 8);
  const b = 6 + Math.floor(Math.random() * 4);
  const input = el('input', { class: 'gate-input', inputmode: 'numeric', type: 'text', autocomplete: 'off', 'aria-label': 'Answer' });
  const msg = el('p', { class: 'gate-msg' }, '');
  let ov;
  const check = () => {
    if (parseInt(input.value, 10) === a * b) { ov.close(); onPass(); }
    else { msg.textContent = 'Not quite. Try again.'; input.value = ''; input.focus(); }
  };
  input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
  ov = overlay(el('div', { class: 'gate' },
    el('div', { class: 'gate-icon' }, svg(icons.lock)),
    el('h2', {}, 'Grown-ups only'),
    el('p', { class: 'gate-q' }, `What is ${a} × ${b}?`),
    input, msg,
    el('div', { class: 'row gap' },
      el('button', { class: 'bigbtn ghost', onclick: () => ov.close() }, 'Cancel'),
      el('button', { class: 'bigbtn', onclick: check }, 'Enter')),
  ), 'gate-overlay');
  setTimeout(() => input.focus(), 250);
}

export function shake(node) {
  node.classList.remove('shake');
  void node.offsetWidth;
  node.classList.add('shake');
}

export function shuffle(arr, rnd = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function randInt(lo, hi, rnd = Math.random) {
  return lo + Math.floor(rnd() * (hi - lo + 1));
}

export function seededRandom(seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
