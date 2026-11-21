// Weather Desk: look outside, check the real forecast, then deliver the report.
// The report follows the clock: by day it covers right now and the rest of today,
// after dark it covers tonight and tomorrow. A second mode plans for tomorrow.
import { el, svg, icons, overlay, grownUpGate } from '../ui.js';

export const WX = {
  sunny: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="13" fill="#f2b33d"/><g stroke="#f2b33d" stroke-width="4" stroke-linecap="round">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="32" y1="8" x2="32" y2="13" transform="rotate(${a} 32 32)"/>`).join('')}</g></svg>`,
  partly: `<svg viewBox="0 0 64 64"><circle cx="24" cy="24" r="11" fill="#f2b33d"/><g stroke="#f2b33d" stroke-width="3.5" stroke-linecap="round">${[0, 60, 120, 180, 240, 300].map(a => `<line x1="24" y1="5" x2="24" y2="9" transform="rotate(${a} 24 24)"/>`).join('')}</g><path d="M22 52a9 9 0 010-18 12 12 0 0123 3 7.5 7.5 0 011 15z" fill="#fff" stroke="#8aa4bd" stroke-width="2.5"/></svg>`,
  cloudy: `<svg viewBox="0 0 64 64"><path d="M16 46a10 10 0 010-20 14 14 0 0127 2 9 9 0 012 18z" fill="#dfe6ee" stroke="#8aa4bd" stroke-width="2.5"/><path d="M26 52a8 8 0 010-16 11 11 0 0121 2 7 7 0 011 14z" fill="#fff" stroke="#8aa4bd" stroke-width="2.5"/></svg>`,
  fog: `<svg viewBox="0 0 64 64"><path d="M18 34a9 9 0 010-18 12 12 0 0123 2 8 8 0 012 16z" fill="#e5e9ee" stroke="#9aa9b8" stroke-width="2.5"/><g stroke="#9aa9b8" stroke-width="4" stroke-linecap="round"><line x1="10" y1="42" x2="46" y2="42"/><line x1="18" y1="50" x2="54" y2="50"/><line x1="12" y1="58" x2="40" y2="58"/></g></svg>`,
  rain: `<svg viewBox="0 0 64 64"><path d="M18 36a10 10 0 010-20 14 14 0 0127 2 9 9 0 012 18z" fill="#dfe6ee" stroke="#6f8aa6" stroke-width="2.5"/><g stroke="#3a86c8" stroke-width="3.5" stroke-linecap="round"><line x1="20" y1="44" x2="16" y2="54"/><line x1="32" y1="44" x2="28" y2="54"/><line x1="44" y1="44" x2="40" y2="54"/></g></svg>`,
  snow: `<svg viewBox="0 0 64 64"><path d="M18 34a10 10 0 010-20 14 14 0 0127 2 9 9 0 012 18z" fill="#eef2f6" stroke="#8aa4bd" stroke-width="2.5"/><g fill="#6aa8d8"><circle cx="20" cy="46" r="3.2"/><circle cx="32" cy="52" r="3.2"/><circle cx="44" cy="46" r="3.2"/><circle cx="26" cy="58" r="2.6"/><circle cx="40" cy="58" r="2.6"/></g></svg>`,
  storm: `<svg viewBox="0 0 64 64"><path d="M18 36a10 10 0 010-20 14 14 0 0127 2 9 9 0 012 18z" fill="#c9d2dc" stroke="#5e7389" stroke-width="2.5"/><path d="M34 38l-8 12h7l-4 11 11-15h-7l5-8z" fill="#f2c14e" stroke="#b58712" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  clearNight: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="29" fill="#27345c"/><circle cx="29" cy="33" r="14" fill="#f4dc8a"/><circle cx="36" cy="27" r="12.5" fill="#27345c"/><g fill="#fff6cf"><circle cx="44" cy="18" r="2.2"/><circle cx="50" cy="34" r="1.6"/><circle cx="41" cy="45" r="1.8"/><circle cx="17" cy="15" r="1.5"/></g></svg>`,
  partlyNight: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="29" fill="#27345c"/><circle cx="24" cy="23" r="11" fill="#f4dc8a"/><circle cx="29.5" cy="18.5" r="9.8" fill="#27345c"/><circle cx="47" cy="17" r="1.8" fill="#fff6cf"/><path d="M24 50a8.5 8.5 0 010-17 11.5 11.5 0 0122 3 7 7 0 011 14z" fill="#e9eef4" stroke="#8aa4bd" stroke-width="2"/></svg>`,
};

const WORD = { sunny: 'sunny', partly: 'partly cloudy', cloudy: 'cloudy', fog: 'foggy', rain: 'rainy', snow: 'snowy', storm: 'stormy' };
// A clear sky is only "sunny" while the sun is up.
const word = (key, dark) => (dark && key === 'sunny' ? 'clear' : WORD[key] || key);
const icon = (key, dark) => (dark && key === 'sunny' ? WX.clearNight : dark && key === 'partly' ? WX.partlyNight : WX[key] || WX.cloudy);
const cap = (t) => t[0].toUpperCase() + t.slice(1);
const longDate = (d) => new Date(d + 'T12:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

function codeToKey(c) {
  if (c === 0) return 'sunny';
  if (c === 1 || c === 2) return 'partly';
  if (c === 3) return 'cloudy';
  if (c === 45 || c === 48) return 'fog';
  if ((c >= 51 && c <= 67) || (c >= 80 && c <= 82)) return 'rain';
  if ((c >= 71 && c <= 77) || c === 85 || c === 86) return 'snow';
  if (c >= 95) return 'storm';
  return 'cloudy';
}

const FEEL = [
  { key: 'cold', label: 'Cold', emoji: '🥶' }, { key: 'cool', label: 'Cool', emoji: '🧥' },
  { key: 'warm', label: 'Warm', emoji: '🙂' }, { key: 'hot', label: 'Hot', emoji: '🥵' },
];
const WEAR = [
  { key: 'coat', label: 'Coat and hat', emoji: '🧣' },
  { key: 'jacket', label: 'Jacket', emoji: '🧥' },
  { key: 'tshirt', label: 'T-shirt', emoji: '👕' },
  { key: 'umbrella', label: 'Umbrella', emoji: '☂️' },
  { key: 'boots', label: 'Boots', emoji: '🥾' },
  { key: 'shades', label: 'Sunglasses', emoji: '🕶️' },
];

function feelFromTemp(t) { return t < 40 ? 'cold' : t < 60 ? 'cool' : t < 80 ? 'warm' : 'hot'; }

// p: { key, hi, rain, t } where t is the temperature when you head out the door.
function recommend(p) {
  const rec = new Set();
  if (p.t < 40) rec.add('coat'); else if (p.t < 60) rec.add('jacket');
  if (p.hi >= 70) rec.add('tshirt');
  if (p.rain >= 50 || p.key === 'rain' || p.key === 'storm') rec.add('umbrella');
  if (p.key === 'rain' || p.key === 'snow' || p.key === 'storm') rec.add('boots');
  if ((p.key === 'sunny' || p.key === 'partly') && p.hi >= 60) rec.add('shades');
  return rec;
}

// Turn the hour-by-hour forecast into the few facts the report needs.
export function buildForecast(d) {
  const H = d.hourly, D = d.daily;
  const nowT = d.current.time;
  const hourIdx = (t) => { const k = t.slice(0, 13); const i = H.time.findIndex(x => x.slice(0, 13) >= k); return i < 0 ? H.time.length - 1 : i; };
  const period = (i0, i1) => {
    i1 = Math.max(i1, i0 + 1);
    const keys = H.weather_code.slice(i0, i1).map(codeToKey);
    const temps = H.temperature_2m.slice(i0, i1);
    const n = keys.length, count = (k) => keys.filter(x => x === k).length;
    const few = n <= 3;
    let key;
    if (count('storm')) key = 'storm';
    else if (count('snow') >= 2 || (few && count('snow'))) key = 'snow';
    else if (count('rain') >= 2 || (few && count('rain'))) key = 'rain';
    else if (count('fog') >= n / 2) key = 'fog';
    else if (count('sunny') >= n / 2) key = 'sunny';
    else if (n - count('sunny') - count('partly') >= n / 2) key = 'cloudy';
    else key = 'partly';
    return {
      key,
      hi: Math.round(Math.max(...temps)), lo: Math.round(Math.min(...temps)),
      rain: Math.round(Math.max(0, ...H.precipitation_probability.slice(i0, i1).map(x => x ?? 0))),
      wind: Math.round(Math.max(0, ...H.wind_speed_10m.slice(i0, i1).map(x => x ?? 0))),
    };
  };
  const nowI = hourIdx(nowT);
  const sr0 = D.sunrise[0], ss0 = D.sunset[0], sr1 = D.sunrise[1];
  const dark = d.current.is_day === 0;
  const phase = !dark ? 'day' : (nowT < sr0 ? 'early' : 'evening');
  const dayOf = (n) => {
    const date = D.time[n];
    const i7 = hourIdx(date + 'T07:00');
    return { ...period(i7, hourIdx(date + 'T19:00')), date, hi: Math.round(D.temperature_2m_max[n]), lo: Math.round(D.temperature_2m_min[n]), morn: Math.round(H.temperature_2m[i7]) };
  };
  const nightStart = phase === 'early' ? nowI : Math.max(nowI, hourIdx(ss0));
  const nightEnd = phase === 'early' ? hourIdx(sr0) + 1 : hourIdx(sr1) + 1;
  return {
    v: 2, phase, dark,
    date: nowT.slice(0, 10), hour: parseInt(nowT.slice(11, 13), 10),
    now: Math.round(d.current.temperature_2m), nowKey: codeToKey(d.current.weather_code),
    rest: { ...period(nowI, hourIdx(ss0) + 1), hi: Math.round(D.temperature_2m_max[0]) },
    night: period(nightStart, nightEnd),
    today: dayOf(0),
    tomorrow: dayOf(1),
  };
}

async function getForecast(store) {
  const s = store.get();
  const place = s.settings.place;
  if (!place) return null;
  const cache = s.weather.cache;
  const fresh = (ms) => cache && cache.fc && cache.fc.v === 2 && cache.place === place.name && Date.now() - cache.at < ms;
  if (fresh(20 * 60 * 1000)) return cache.fc;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}`
    + '&current=temperature_2m,weather_code,is_day'
    + '&hourly=weather_code,temperature_2m,precipitation_probability,wind_speed_10m'
    + '&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min'
    + '&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=3';
  try {
    const ctl = new AbortController();
    const to = setTimeout(() => ctl.abort(), 8000);
    const r = await fetch(url, { signal: ctl.signal });
    clearTimeout(to);
    if (!r.ok) throw new Error('bad response');
    const fc = buildForecast(await r.json());
    store.update(st => { st.weather.cache = { place: place.name, at: Date.now(), fc }; });
    return fc;
  } catch (e) {
    // An hour-old forecast is still close enough to report from. Older than that, the clock has moved on.
    if (fresh(60 * 60 * 1000)) return cache.fc;
    return 'offline';
  }
}

export function start(ctx) {
  const { body, store, sfx } = ctx;
  const obs = { dark: null, darkSet: false, sky: null, feel: null, wear: new Set() };
  let fcPromise = getForecast(store);
  let known; // the forecast once it has loaded
  let onLook = false;
  let airOv = null;
  const real = (fc) => fc && fc !== 'offline';
  const watch = () => fcPromise.then(fc => {
    known = fc;
    if (onLook && real(fc) && !obs.darkSet && obs.dark !== fc.dark) { obs.dark = fc.dark; obs.sky = null; stepLook(); }
  });

  function frame(steps, stepNo, title, ...content) {
    onLook = false;
    body.innerHTML = '';
    body.append(el('div', { class: 'wx' },
      steps ? el('div', { class: 'wx-steps' }, steps.map((s, i) =>
        el('span', { class: 'wx-step' + (i === stepNo ? ' on' : '') + (i < stepNo ? ' done' : '') }, s))) : null,
      el('h2', { class: 'wx-title' }, title),
      ...content));
  }
  const NOW_STEPS = ['Look', 'Check', 'Dress', 'Report'];
  const PLAN_STEPS = ['Check', 'Dress', 'Report'];
  const guessDark = () => { const h = new Date().getHours(); return h < 7 || h >= 18; };
  watch();
  stepMenu();

  function needForecast(steps, stepNo, fc, onSkip) {
    const noPlace = !fc;
    frame(steps, stepNo, noPlace ? 'We need a town for the forecast' : 'The forecast can’t load right now',
      el('p', { class: 'tale-text' }, noPlace ? 'Ask a grown-up to set your town.' : 'There is no internet right now.', onSkip ? ' You can still give a report from what you saw.' : ''),
      el('div', { class: 'row gap center wrap' },
        noPlace ? el('button', { class: 'smallbtn', onclick: () => grownUpGate(() => { location.hash = '#/grownup'; }) }, svg(icons.lock), ' Grown-up: set the town')
          : el('button', { class: 'smallbtn', onclick: () => { fcPromise = getForecast(store); watch(); onSkip ? stepCheck() : planCheck(); } }, 'Try again'),
        onSkip ? el('button', { class: 'bigbtn', onclick: onSkip }, 'Keep going', svg(icons.next)) : el('button', { class: 'bigbtn ghost', onclick: stepMenu }, 'Back')));
  }

  /* ---------- Menu ---------- */
  function stepMenu() {
    const s = store.get();
    const recent = s.weather.log.slice(-7);
    const dark = real(known) ? known.dark : guessDark();
    frame(null, 0, 'Which report will you give?',
      el('div', { class: 'wx-modes' },
        el('button', { class: 'wx-mode', onclick: () => { sfx.pick(); stepLook(); } },
          svg(dark ? WX.clearNight : WX.partly, 'wx-mode-icon'),
          el('div', { class: 'wx-mode-text' }, el('span', { class: 'wx-mode-title' }, 'Right now'), el('span', { class: 'muted' }, 'Look outside, check the forecast, and go on the air.'))),
        el('button', { class: 'wx-mode', onclick: () => { sfx.pick(); planCheck(); } },
          el('div', { class: 'wx-mode-cal' }, el('span', {}, 'NEXT'), el('strong', {}, 'DAY')),
          el('div', { class: 'wx-mode-text' }, el('span', { class: 'wx-mode-title' }, 'Tomorrow'), el('span', { class: 'muted' }, 'Plan ahead. What will the weather be, and what should you wear?')))),
      recent.length ? el('div', { class: 'wx-week' },
        el('span', { class: 'muted' }, 'My weather days:'),
        recent.map(l => el('span', { class: 'wx-day', title: l.date }, svg(icon(l.fc ? l.fc.key : l.sky, l.dark), 'wx-mini'), el('small', {}, new Date(l.date + 'T12:00').toLocaleDateString('en-US', { weekday: 'short' }))))) : null,
    );
  }

  /* ---------- Right now ---------- */
  function stepLook() {
    if (obs.dark === null) obs.dark = real(known) ? known.dark : guessDark();
    const skies = [
      { key: 'sunny', label: obs.dark ? 'Clear' : 'Sunny' }, { key: 'cloudy', label: 'Cloudy' }, { key: 'rain', label: 'Rainy' },
      { key: 'snow', label: 'Snowy' }, { key: 'fog', label: 'Foggy' },
    ];
    const light = (isDark, label) => el('button', { class: 'wx-toggle' + (obs.dark === isDark ? ' on' : ''), onclick: () => { if (obs.dark === isDark) return; sfx.tap(); obs.dark = isDark; obs.darkSet = true; stepLook(); } }, label);
    const skyGrid = el('div', { class: 'wx-grid five' }, skies.map(c =>
      el('button', { class: 'wx-pick' + (obs.sky === c.key ? ' on' : ''), onclick: () => { sfx.pick(); obs.sky = c.key; stepLook(); } },
        svg(icon(c.key, obs.dark), 'wx-icon'), el('span', {}, c.label))));
    const feelGrid = el('div', { class: 'wx-grid four' }, FEEL.map(c =>
      el('button', { class: 'wx-pick small' + (obs.feel === c.key ? ' on' : ''), onclick: () => { sfx.pick(); obs.feel = c.key; stepLook(); } },
        el('span', { class: 'emoji big' }, c.emoji), el('span', {}, c.label))));
    frame(NOW_STEPS, 0, 'Look out the window. What do you see?',
      el('div', { class: 'wx-toggles' }, el('span', { class: 'muted' }, 'Outside it is'), light(false, 'Light'), light(true, 'Dark')),
      skyGrid,
      el('p', { class: 'wx-sub' }, 'How does it feel outside?'),
      feelGrid,
      el('div', { class: 'tale-actions' }, el('button', { class: 'bigbtn', disabled: !(obs.sky && obs.feel), onclick: () => { sfx.tap(); stepCheck(); } }, 'Check the forecast', svg(icons.next))));
    onLook = true;
  }

  const mini = (label, key, dark, ...facts) => el('div', { class: 'fc-mini' },
    el('span', { class: 'fc-mini-label' }, label), svg(icon(key, dark), 'fc-mini-icon'),
    el('strong', {}, cap(word(key, dark))), facts.map(f => el('span', { class: 'fc-mini-fact' }, f)));
  const rainFact = (p) => `${p.key === 'snow' ? 'Snow' : 'Rain'} chance ${p.rain}%`;

  async function stepCheck() {
    frame(NOW_STEPS, 1, 'Checking the forecast…', el('div', { class: 'wx-loading' }, svg(WX.partly, 'wx-icon spin')));
    const fc = await fcPromise;
    if (!document.body.contains(body)) return;
    if (!real(fc)) { needForecast(NOW_STEPS, 1, fc, () => stepDress(NOW_STEPS, null, 'today', null)); return; }
    sfx.good();
    const match = obs.sky === fc.nowKey || (fc.nowKey === 'partly' && (obs.sky === 'sunny' || obs.sky === 'cloudy')) || (fc.nowKey === 'storm' && obs.sky === 'rain');
    const feelMatch = obs.feel === feelFromTemp(fc.now);
    const outlook = fc.phase === 'day'
      ? [mini('Rest of today', fc.rest.key, false, `High ${fc.rest.hi}°`, rainFact(fc.rest)), mini('Tonight', fc.night.key, true, `Low ${fc.night.lo}°`), mini('Tomorrow', fc.tomorrow.key, false, `High ${fc.tomorrow.hi}°`)]
      : fc.phase === 'evening'
        ? [mini('Tonight', fc.night.key, true, `Low ${fc.night.lo}°`), mini('Tomorrow', fc.tomorrow.key, false, `Morning ${fc.tomorrow.morn}°`, `High ${fc.tomorrow.hi}°`, rainFact(fc.tomorrow))]
        : [mini('Until sunrise', fc.night.key, true, `Low ${fc.night.lo}°`), mini('Today', fc.today.key, false, `High ${fc.today.hi}°`, rainFact(fc.today))];
    frame(NOW_STEPS, 1, 'Right now',
      el('div', { class: 'fc-card' },
        svg(icon(fc.nowKey, fc.dark), 'fc-icon'),
        el('div', { class: 'fc-nums' },
          el('div', { class: 'fc-word' }, cap(word(fc.nowKey, fc.dark))),
          el('div', { class: 'fc-row' }, el('span', { class: 'fc-hi' }, `${fc.now}°`), el('span', { class: 'muted' }, ' right now')),
          el('div', { class: 'fc-row small' }, longDate(fc.date)))),
      el('div', { class: 'fc-compare' },
        el('p', {}, el('strong', {}, match ? 'Good eye! ' : 'Hmm! '), `You saw a ${word(obs.sky, obs.dark)} sky. The forecast says it is ${word(fc.nowKey, fc.dark)} right now.`, match ? '' : ' Weather can change from one spot to the next, so what you see counts too.'),
        el('p', {}, `You said it feels ${obs.feel}. It is ${fc.now} degrees, which is ${feelFromTemp(fc.now)}.`, feelMatch ? ' You got it!' : '')),
      el('div', { class: 'fc-minis' }, outlook),
      el('div', { class: 'tale-actions' }, el('button', { class: 'bigbtn', onclick: () => { sfx.tap(); const [p, label] = dressFor(fc); stepDress(NOW_STEPS, fc, label, p); } }, fc.phase === 'evening' ? 'What should we wear tomorrow?' : 'What should we wear?', svg(icons.next))));
  }

  // Which part of the forecast the clothes are for.
  function dressFor(fc) {
    if (fc.phase === 'day') return [{ key: fc.rest.key, hi: fc.rest.hi, rain: fc.rest.rain, t: fc.now }, 'today'];
    if (fc.phase === 'evening') return [{ ...fc.tomorrow, t: fc.tomorrow.morn }, 'tomorrow'];
    return [{ ...fc.today, t: fc.today.morn }, 'today'];
  }

  /* ---------- Tomorrow planner ---------- */
  async function planCheck() {
    frame(PLAN_STEPS, 0, 'Checking tomorrow’s forecast…', el('div', { class: 'wx-loading' }, svg(WX.partly, 'wx-icon spin')));
    const fc = await fcPromise;
    if (!document.body.contains(body)) return;
    if (!real(fc)) { needForecast(PLAN_STEPS, 0, fc, null); return; }
    sfx.good();
    const t = fc.tomorrow;
    frame(PLAN_STEPS, 0, `Tomorrow is ${longDate(t.date)}`,
      el('div', { class: 'fc-card' },
        svg(icon(t.key, false), 'fc-icon'),
        el('div', { class: 'fc-nums' },
          el('div', { class: 'fc-word' }, cap(word(t.key, false))),
          el('div', { class: 'fc-row' }, el('span', { class: 'fc-hi' }, `${t.hi}°`), el('span', { class: 'muted' }, ' high'), el('span', { class: 'fc-lo' }, ` ${t.lo}°`), el('span', { class: 'muted' }, ' low')),
          el('div', { class: 'fc-row small' }, `${rainFact(t)} · Wind ${t.wind} mph`))),
      el('div', { class: 'fc-compare' },
        el('p', {}, el('strong', {}, 'In the morning: '), `At 7 o’clock it will be ${t.morn} degrees. That is ${feelFromTemp(t.morn)}.`),
        el('p', {}, el('strong', {}, 'In the afternoon: '), `It will warm up to ${t.hi} degrees. That is ${feelFromTemp(t.hi)}.`)),
      el('div', { class: 'tale-actions' }, el('button', { class: 'bigbtn', onclick: () => { sfx.tap(); stepDress(PLAN_STEPS, fc, 'tomorrow', { ...t, t: t.morn }, true); } }, 'What should we wear tomorrow?', svg(icons.next))));
  }

  /* ---------- Dress (both modes) ---------- */
  function stepDress(steps, fc, label, p, plan = false) {
    const stepNo = steps.indexOf('Dress');
    const rec = p ? recommend(p) : null;
    let checked = false;
    obs.wear = new Set();
    const grid = el('div', { class: 'wx-grid three' });
    const feedback = el('div', { class: 'fc-compare' });
    const draw = () => {
      grid.innerHTML = '';
      WEAR.forEach(w => {
        const b = el('button', { class: 'wx-pick small' + (obs.wear.has(w.key) ? ' on' : '') + (checked && rec && rec.has(w.key) ? ' rec' : ''), onclick: () => {
          sfx.pick(); obs.wear.has(w.key) ? obs.wear.delete(w.key) : obs.wear.add(w.key); draw();
        } }, el('span', { class: 'emoji big' }, w.emoji), el('span', {}, w.label));
        grid.append(b);
      });
    };
    draw();
    const nextBtn = el('button', { class: 'bigbtn', onclick: () => {
      if (rec && !checked) {
        checked = true;
        const got = [...rec].filter(k => obs.wear.has(k));
        const missed = [...rec].filter(k => !obs.wear.has(k));
        feedback.innerHTML = '';
        if (!missed.length) { sfx.good(); feedback.append(el('p', {}, el('strong', {}, 'Great choices! '), 'That matches the forecast.')); }
        else {
          sfx.tap();
          feedback.append(el('p', {}, got.length ? el('strong', {}, 'Good thinking. ') : null, 'The forecast says you might also want: ', missed.map(k => WEAR.find(w => w.key === k).label.toLowerCase()).join(', ') + '.'));
        }
        draw();
        nextBtn.firstChild.textContent = 'Write my report ';
        return;
      }
      sfx.tap(); stepReport(steps, fc, label, p, plan);
    } }, 'Check my choices ', svg(icons.next));
    if (!rec) nextBtn.firstChild.textContent = 'Write my report ';
    const facts = p ? el('p', { class: 'wx-sub' }, plan || label === 'tomorrow'
      ? `Tomorrow: ${word(p.key, false)}, ${p.t}° in the morning, high of ${p.hi}°.`
      : (fc && fc.phase === 'early' ? `Today: ${word(p.key, false)}, ${p.t}° in the morning, high of ${p.hi}°.` : `Right now it is ${p.t}°. The rest of today: ${word(p.key, false)}, high of ${p.hi}°.`)) : null;
    frame(steps, stepNo, `What should people wear or bring ${label}?`, facts, el('p', { class: 'wx-sub' }, 'Pick everything that makes sense.'), grid, feedback, el('div', { class: 'tale-actions' }, nextBtn));
  }

  /* ---------- Report (both modes) ---------- */
  const listOf = (arr) => (arr.length > 1 ? arr.slice(0, -1).join(', ') + ' and ' + arr.slice(-1) : arr[0]);
  const rainLine = (p, when) => (p.rain >= 20 ? `There is a ${p.rain} percent chance of ${p.key === 'snow' ? 'snow' : 'rain'} ${when}.` : `${p.key === 'snow' ? 'Snow' : 'Rain'} is not likely ${when}.`);
  const windLine = (p) => (p.wind >= 15 ? [`It will be windy, with wind up to ${p.wind} miles an hour.`] : []);

  function reportLines(fc, label, p, plan) {
    const name = store.get().settings.childName;
    const hour = real(fc) ? fc.hour : new Date().getHours();
    const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const hello = (what) => (name ? `${greet}! I’m ${name}, and here is ${what}.` : `${greet}! Here is ${what}.`);
    const wearKeys = p ? WEAR.map(w => w.key).filter(k => recommend(p).has(k)) : [...obs.wear];
    const wear = wearKeys.map(k => WEAR.find(w => w.key === k).label.toLowerCase());
    const wearLine = wear.length ? [`${label === 'tomorrow' ? 'For tomorrow, don’t' : 'Don’t'} forget your ${listOf(wear)}!`] : [];
    const bye = 'That’s the weather. Back to you!';
    if (!real(fc)) {
      return [hello('the weather'), `Today is ${longDate(store.todayKey())}.`, `Outside it looks ${word(obs.sky, obs.dark)}, and it feels ${obs.feel}.`, ...wearLine, bye];
    }
    if (plan) {
      const t = fc.tomorrow;
      return [hello('tomorrow’s weather'), `Tomorrow is ${longDate(t.date)}.`, `Tomorrow will be ${word(t.key, false)}.`,
        `In the morning it will be ${t.morn} degrees.`, `The high is ${t.hi} degrees.`, rainLine(t, 'tomorrow'), ...windLine(t), ...wearLine, bye];
    }
    const lines = [hello('the weather'), `Today is ${longDate(fc.date)}.`];
    if (fc.phase === 'day') {
      lines.push(`Right now it is ${word(fc.nowKey, false)} and ${fc.now} degrees.`);
      lines.push(fc.rest.key === fc.nowKey ? `It will stay ${word(fc.rest.key, false)} for the rest of today.` : `Later today it will be ${word(fc.rest.key, false)}.`);
      lines.push(`The high today is ${fc.rest.hi} degrees.`, rainLine(fc.rest, 'today'), ...windLine(fc.rest), ...wearLine);
      lines.push(`Tonight will be ${word(fc.night.key, true)}. The low is ${fc.night.lo} degrees.`);
      lines.push(`Tomorrow looks ${word(fc.tomorrow.key, false)}.`);
    } else if (fc.phase === 'evening') {
      lines.push(`It is dark out now. It is ${word(fc.nowKey, true)} and ${fc.now} degrees.`);
      lines.push(`Tonight will be ${word(fc.night.key, true)}. The low is ${fc.night.lo} degrees.`);
      lines.push(`Tomorrow will be ${word(fc.tomorrow.key, false)}.`, `In the morning it will be ${fc.tomorrow.morn} degrees. The high is ${fc.tomorrow.hi} degrees.`, rainLine(fc.tomorrow, 'tomorrow'), ...windLine(fc.tomorrow), ...wearLine);
    } else {
      lines.push(`It is still dark out. It is ${word(fc.nowKey, true)} and ${fc.now} degrees.`);
      lines.push(`Today will be ${word(fc.today.key, false)}.`, `The high is ${fc.today.hi} degrees.`, rainLine(fc.today, 'today'), ...windLine(fc.today), ...wearLine);
    }
    lines.push(bye);
    return lines;
  }

  // The picture and number that stand for the whole report.
  function face(fc, plan) {
    if (!real(fc)) return { art: icon(obs.sky, obs.dark), temp: null };
    if (plan) return { art: icon(fc.tomorrow.key, false), temp: fc.tomorrow.hi };
    return { art: icon(fc.nowKey, fc.dark), temp: fc.now };
  }

  function stepReport(steps, fc, label, p, plan) {
    const lines = reportLines(fc, label, p, plan);
    const f = face(fc, plan);
    frame(steps, steps.indexOf('Report'), plan ? 'Your report for tomorrow' : 'Your weather report',
      el('div', { class: 'report-card' }, svg(f.art, 'report-icon'),
        el('ol', { class: 'report-lines' }, lines.map(l => el('li', {}, l)))),
      el('p', { class: 'wx-sub' }, 'Read it to yourself first. Then go on the air for your family.'),
      el('div', { class: 'tale-actions' }, el('button', { class: 'bigbtn onair-btn', onclick: () => onAir(fc, lines, plan) }, '🔴 Go on the air')));
  }

  function onAir(fc, lines, plan) {
    sfx.onAir();
    let i = 0;
    const f = face(fc, plan);
    const prompter = el('ol', { class: 'prompter' }, lines.map((l, k) => el('li', { class: k === 0 ? 'now' : '' }, l)));
    const nextLine = el('button', { class: 'bigbtn', onclick: () => {
      sfx.tap();
      i++;
      prompter.querySelectorAll('li').forEach((li, k) => { li.classList.toggle('now', k === i); li.classList.toggle('past', k < i); });
      const cur = prompter.children[i];
      if (cur) cur.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (i >= lines.length - 1) { nextLine.textContent = 'Sign off'; nextLine.onclick = finishAir; }
    } }, 'Next line');
    const studio = el('div', { class: 'studio' },
      el('div', { class: 'studio-top' }, el('span', { class: 'onair' }, 'ON AIR'), el('span', { class: 'studio-name' }, plan ? 'Weather Desk: Tomorrow' : 'Weather Desk')),
      el('div', { class: 'studio-main' },
        el('div', { class: 'studio-map' }, svg(f.art, 'studio-icon'), f.temp !== null ? el('div', { class: 'studio-temp' }, `${f.temp}°`) : null),
        prompter),
      el('div', { class: 'row gap center' }, nextLine));
    airOv = overlay(studio, 'studio-overlay');

    function finishAir() {
      sfx.applause(1.6);
      airOv.close(); airOv = null;
      if (!plan) {
        store.update(s => {
          s.weather.log = s.weather.log.filter(l => l.date !== store.todayKey());
          s.weather.log.push({ date: store.todayKey(), sky: obs.sky, dark: !!obs.dark, feel: obs.feel, wear: [...obs.wear], fc: real(fc) ? { key: fc.nowKey, now: fc.now } : null });
          s.weather.log = s.weather.log.slice(-60);
        });
      }
      ctx.finish(plan ? {
        title: 'Tomorrow is planned!',
        line: 'You gave the report for tomorrow.',
        grownPrompt: 'Use the forecast to pick out tomorrow’s clothes together.',
        note: 'tomorrow',
        again: false,
      } : {
        title: 'That’s a wrap!',
        line: 'You delivered the weather report.',
        grownPrompt: 'Grown-up: did you hear the report? Ask the weather reporter one question about the weather.',
        note: real(fc) ? fc.nowKey : obs.sky,
        again: false,
      });
    }
  }

  return () => { if (airOv) airOv.close(); };
}
