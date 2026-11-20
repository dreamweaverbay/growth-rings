// Growth Rings — local storage. Everything stays on this device.

const KEY = 'growth-rings.v1';

const DEFAULTS = () => ({
  version: 1,
  created: Date.now(),
  settings: {
    childName: '',
    sound: true,
    dailyLimit: 0,          // 0 = no limit; otherwise finished activities per day
    place: null,            // { name, lat, lon }
  },
  extraToday: { date: '', count: 0 },
  events: [],               // { t, a, k: 'done' | 'grown', m, note }
  story: { level: 1, streak: 0, finished: {} },
  grove: { solved: {} },
  magic: { learned: {}, performed: {} },
  weather: { log: [], cache: null },
  build: { done: {} },
});

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS();
    const parsed = JSON.parse(raw);
    return merge(DEFAULTS(), parsed);
  } catch (e) {
    return DEFAULTS();
  }
}

function merge(base, extra) {
  for (const k of Object.keys(extra || {})) {
    const v = extra[k];
    if (v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) {
      base[k] = merge(base[k], v);
    } else {
      base[k] = v;
    }
  }
  return base;
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage full or blocked */ }
}

export function get() { return state; }

export function update(fn) { fn(state); save(); }

export function logEvent(a, k, extra = {}) {
  update(s => { s.events.push({ t: Date.now(), a, k, ...extra }); });
}

export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function doneToday() {
  const k = todayKey();
  return state.events.filter(e => e.k === 'done' && todayKey(new Date(e.t)) === k).length;
}

export function limitReached() {
  const lim = state.settings.dailyLimit;
  if (!lim) return false;
  const extra = state.extraToday.date === todayKey() ? state.extraToday.count : 0;
  return doneToday() >= lim + extra;
}

export function allowOneMore() {
  update(s => {
    const k = todayKey();
    if (s.extraToday.date !== k) s.extraToday = { date: k, count: 0 };
    s.extraToday.count += 1;
  });
}

export function exportData() {
  return JSON.stringify(state, null, 2);
}

export function importData(text) {
  const parsed = JSON.parse(text);
  if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.events)) throw new Error('Not a Growth Rings backup');
  state = merge(DEFAULTS(), parsed);
  save();
}

export function resetAll() {
  state = DEFAULTS();
  save();
}

// Week helpers (weeks start on Monday)
export function weekStart(t) {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  const dow = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - dow);
  return d.getTime();
}

export const WEEK = 7 * 24 * 3600 * 1000;
