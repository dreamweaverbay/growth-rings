// Weather Desk: look outside, check the real forecast, then deliver the report.
import { el, svg, icons, overlay, grownUpGate } from '../ui.js';

export const WX = {
  sunny: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="13" fill="#f2b33d"/><g stroke="#f2b33d" stroke-width="4" stroke-linecap="round">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="32" y1="8" x2="32" y2="13" transform="rotate(${a} 32 32)"/>`).join('')}</g></svg>`,
  partly: `<svg viewBox="0 0 64 64"><circle cx="24" cy="24" r="11" fill="#f2b33d"/><g stroke="#f2b33d" stroke-width="3.5" stroke-linecap="round">${[0, 60, 120, 180, 240, 300].map(a => `<line x1="24" y1="5" x2="24" y2="9" transform="rotate(${a} 24 24)"/>`).join('')}</g><path d="M22 52a9 9 0 010-18 12 12 0 0123 3 7.5 7.5 0 011 15z" fill="#fff" stroke="#8aa4bd" stroke-width="2.5"/></svg>`,
  cloudy: `<svg viewBox="0 0 64 64"><path d="M16 46a10 10 0 010-20 14 14 0 0127 2 9 9 0 012 18z" fill="#dfe6ee" stroke="#8aa4bd" stroke-width="2.5"/><path d="M26 52a8 8 0 010-16 11 11 0 0121 2 7 7 0 011 14z" fill="#fff" stroke="#8aa4bd" stroke-width="2.5"/></svg>`,
  fog: `<svg viewBox="0 0 64 64"><path d="M18 34a9 9 0 010-18 12 12 0 0123 2 8 8 0 012 16z" fill="#e5e9ee" stroke="#9aa9b8" stroke-width="2.5"/><g stroke="#9aa9b8" stroke-width="4" stroke-linecap="round"><line x1="10" y1="42" x2="46" y2="42"/><line x1="18" y1="50" x2="54" y2="50"/><line x1="12" y1="58" x2="40" y2="58"/></g></svg>`,
  rain: `<svg viewBox="0 0 64 64"><path d="M18 36a10 10 0 010-20 14 14 0 0127 2 9 9 0 012 18z" fill="#dfe6ee" stroke="#6f8aa6" stroke-width="2.5"/><g stroke="#3a86c8" stroke-width="3.5" stroke-linecap="round"><line x1="20" y1="44" x2="16" y2="54"/><line x1="32" y1="44" x2="28" y2="54"/><line x1="44" y1="44" x2="40" y2="54"/></g></svg>`,
  snow: `<svg viewBox="0 0 64 64"><path d="M18 34a10 10 0 010-20 14 14 0 0127 2 9 9 0 012 18z" fill="#eef2f6" stroke="#8aa4bd" stroke-width="2.5"/><g fill="#6aa8d8"><circle cx="20" cy="46" r="3.2"/><circle cx="32" cy="52" r="3.2"/><circle cx="44" cy="46" r="3.2"/><circle cx="26" cy="58" r="2.6"/><circle cx="40" cy="58" r="2.6"/></g></svg>`,
  storm: `<svg viewBox="0 0 64 64"><path d="M18 36a10 10 0 010-20 14 14 0 0127 2 9 9 0 012 18z" fill="#c9d2dc" stroke="#5e7389" stroke-width="2.5"/><path d="M34 38l-8 12h7l-4 11 11-15h-7l5-8z" fill="#f2c14e" stroke="#b58712" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
};

const WORD = { sunny: 'sunny', partly: 'partly cloudy', cloudy: 'cloudy', fog: 'foggy', rain: 'rainy', snow: 'snowy', storm: 'stormy' };

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

const SKY_CHOICES = [
  { key: 'sunny', label: 'Sunny' }, { key: 'cloudy', label: 'Cloudy' }, { key: 'rain', label: 'Rainy' },
  { key: 'snow', label: 'Snowy' }, { key: 'fog', label: 'Foggy' },
];
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

function recommend(fc) {
  const rec = new Set();
  if (fc.hi < 40) rec.add('coat'); else if (fc.hi < 62) rec.add('jacket');
  if (fc.hi >= 72) rec.add('tshirt');
  if (fc.rain >= 50 || fc.key === 'rain' || fc.key === 'storm') rec.add('umbrella');
  if (fc.key === 'rain' || fc.key === 'snow' || fc.key === 'storm') rec.add('boots');
  if ((fc.key === 'sunny' || fc.key === 'partly') && fc.hi >= 60) rec.add('shades');
  return rec;
}

async function getForecast(store) {
  const s = store.get();
  const place = s.settings.place;
  if (!place) return null;
  const today = store.todayKey();
  const cache = s.weather.cache;
  if (cache && cache.date === today && cache.place === place.name && Date.now() - cache.at < 3 * 3600 * 1000) return cache.fc;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}`
    + '&current=temperature_2m,weather_code'
    + '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max'
    + '&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=2';
  try {
    const ctl = new AbortController();
    const to = setTimeout(() => ctl.abort(), 8000);
    const r = await fetch(url, { signal: ctl.signal });
    clearTimeout(to);
    if (!r.ok) throw new Error('bad response');
    const d = await r.json();
    const fc = {
      key: codeToKey(d.daily.weather_code[0]),
      hi: Math.round(d.daily.temperature_2m_max[0]),
      lo: Math.round(d.daily.temperature_2m_min[0]),
      rain: d.daily.precipitation_probability_max[0] ?? 0,
      wind: Math.round(d.daily.wind_speed_10m_max[0]),
      now: Math.round(d.current.temperature_2m),
      nowKey: codeToKey(d.current.weather_code),
      tomorrow: { key: codeToKey(d.daily.weather_code[1]), hi: Math.round(d.daily.temperature_2m_max[1]) },
    };
    store.update(st => { st.weather.cache = { date: today, place: place.name, at: Date.now(), fc }; });
    return fc;
  } catch (e) {
    if (cache && cache.date === today) return cache.fc;
    return 'offline';
  }
}

export function start(ctx) {
  const { body, store, sfx } = ctx;
  const obs = { sky: null, feel: null, wear: new Set() };
  let fcPromise = getForecast(store);
  let airOv = null;
  stepLook();

  function frame(stepNo, title, ...content) {
    body.innerHTML = '';
    body.append(el('div', { class: 'wx' },
      el('div', { class: 'wx-steps' }, ['Look', 'Check', 'Dress', 'Report'].map((s, i) =>
        el('span', { class: 'wx-step' + (i === stepNo ? ' on' : '') + (i < stepNo ? ' done' : '') }, s))),
      el('h2', { class: 'wx-title' }, title),
      ...content));
  }

  function stepLook() {
    const s = store.get();
    const recent = s.weather.log.slice(-7);
    const skyGrid = el('div', { class: 'wx-grid five' }, SKY_CHOICES.map(c =>
      el('button', { class: 'wx-pick' + (obs.sky === c.key ? ' on' : ''), onclick: () => { sfx.pick(); obs.sky = c.key; stepLook(); } },
        svg(WX[c.key], 'wx-icon'), el('span', {}, c.label))));
    const feelGrid = el('div', { class: 'wx-grid four' }, FEEL.map(c =>
      el('button', { class: 'wx-pick small' + (obs.feel === c.key ? ' on' : ''), onclick: () => { sfx.pick(); obs.feel = c.key; stepLook(); } },
        el('span', { class: 'emoji big' }, c.emoji), el('span', {}, c.label))));
    frame(0, 'Look out the window. What do you see?',
      skyGrid,
      el('p', { class: 'wx-sub' }, 'How does it feel outside?'),
      feelGrid,
      el('div', { class: 'tale-actions' }, el('button', { class: 'bigbtn', disabled: !(obs.sky && obs.feel), onclick: () => { sfx.tap(); stepCheck(); } }, 'Check the forecast', svg(icons.next))),
      recent.length ? el('div', { class: 'wx-week' },
        el('span', { class: 'muted' }, 'My weather days:'),
        recent.map(l => el('span', { class: 'wx-day', title: l.date }, svg(WX[l.fc ? l.fc.key : l.sky] || WX.cloudy, 'wx-mini'), el('small', {}, new Date(l.date + 'T12:00').toLocaleDateString(undefined, { weekday: 'short' }))))) : null,
    );
  }

  async function stepCheck() {
    frame(1, 'Checking the forecast…', el('div', { class: 'wx-loading' }, svg(WX.partly, 'wx-icon spin')));
    const fc = await fcPromise;
    if (!document.body.contains(body)) return;
    if (!fc || fc === 'offline') {
      const noPlace = !fc;
      frame(1, noPlace ? 'We need a town for the forecast' : 'The forecast can’t load right now',
        el('p', { class: 'tale-text' }, noPlace ? 'Ask a grown-up to set your town. You can still give a report from what you saw.' : 'No internet right now. You can still give a report from what you saw.'),
        el('div', { class: 'row gap center wrap' },
          noPlace ? el('button', { class: 'smallbtn', onclick: () => grownUpGate(() => { location.hash = '#/grownup'; }) }, svg(icons.lock), ' Grown-up: set the town') : el('button', { class: 'smallbtn', onclick: () => { fcPromise = getForecast(store); stepCheck(); } }, 'Try again'),
          el('button', { class: 'bigbtn', onclick: () => stepDress(null) }, 'Keep going', svg(icons.next))));
      return;
    }
    sfx.good();
    const match = obs.sky === fc.nowKey || obs.sky === fc.key || (fc.nowKey === 'partly' && (obs.sky === 'sunny' || obs.sky === 'cloudy'));
    const feelMatch = obs.feel === feelFromTemp(fc.now);
    frame(1, 'Today’s forecast',
      el('div', { class: 'fc-card' },
        svg(WX[fc.key], 'fc-icon'),
        el('div', { class: 'fc-nums' },
          el('div', { class: 'fc-word' }, WORD[fc.key][0].toUpperCase() + WORD[fc.key].slice(1)),
          el('div', { class: 'fc-row' }, el('span', { class: 'fc-hi' }, `${fc.hi}°`), el('span', { class: 'muted' }, ' high'), el('span', { class: 'fc-lo' }, ` ${fc.lo}°`), el('span', { class: 'muted' }, ' low')),
          el('div', { class: 'fc-row small' }, `Right now: ${fc.now}° · Rain chance: ${fc.rain}% · Wind: ${fc.wind} mph`))),
      el('div', { class: 'fc-compare' },
        el('p', {}, el('strong', {}, match ? 'Good eye! ' : 'Hmm! '), `You saw ${obs.sky === 'rain' ? 'rain' : WORD[obs.sky] || obs.sky}. Right now it is ${WORD[fc.nowKey]}.`, fc.key !== fc.nowKey ? ` Later today it will be ${WORD[fc.key]}.` : ''),
        el('p', {}, `You said it feels ${obs.feel}. It is ${fc.now} degrees, which is ${feelFromTemp(fc.now)}.`, feelMatch ? ' You got it!' : '')),
      el('p', { class: 'muted center' }, `Tomorrow: ${WORD[fc.tomorrow.key]}, high of ${fc.tomorrow.hi}°`),
      el('div', { class: 'tale-actions' }, el('button', { class: 'bigbtn', onclick: () => { sfx.tap(); stepDress(fc); } }, 'What should we wear?', svg(icons.next))));
  }

  function stepDress(fc) {
    const rec = fc ? recommend(fc) : null;
    let checked = false;
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
      sfx.tap(); stepReport(fc);
    } }, 'Check my choices ', svg(icons.next));
    if (!rec) nextBtn.firstChild.textContent = 'Write my report ';
    frame(2, 'What should people wear or bring today?', el('p', { class: 'wx-sub' }, 'Pick everything that makes sense.'), grid, feedback, el('div', { class: 'tale-actions' }, nextBtn));
  }

  function reportLines(fc) {
    const s = store.get();
    const name = s.settings.childName;
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const lines = [name ? `${greet}! I’m ${name}, and here is the weather.` : `${greet}! Here is the weather.`];
    if (fc) {
      lines.push(`Today will be ${WORD[fc.key]}.`);
      lines.push(`The high is ${fc.hi} degrees. The low is ${fc.lo} degrees.`);
      lines.push(fc.rain >= 20 ? `There is a ${fc.rain} percent chance of rain.` : 'Rain is not likely today.');
      if (fc.wind >= 15) lines.push(`It will be windy, with wind up to ${fc.wind} miles an hour.`);
    } else {
      lines.push(`Outside it looks ${WORD[obs.sky] || obs.sky}, and it feels ${obs.feel}.`);
    }
    const wear = [...obs.wear].map(k => WEAR.find(w => w.key === k).label.toLowerCase());
    if (wear.length) lines.push(`Don’t forget your ${wear.length > 1 ? wear.slice(0, -1).join(', ') + ' and ' + wear.slice(-1) : wear[0]}!`);
    if (fc) lines.push(`Tomorrow looks ${WORD[fc.tomorrow.key]}.`);
    lines.push('That’s the weather. Back to you!');
    return lines;
  }

  function stepReport(fc) {
    const lines = reportLines(fc);
    frame(3, 'Your weather report',
      el('div', { class: 'report-card' }, fc ? svg(WX[fc.key], 'report-icon') : svg(WX[obs.sky] || WX.cloudy, 'report-icon'),
        el('ol', { class: 'report-lines' }, lines.map(l => el('li', {}, l)))),
      el('p', { class: 'wx-sub' }, 'Read it to yourself first. Then go on the air for your family.'),
      el('div', { class: 'tale-actions' }, el('button', { class: 'bigbtn onair-btn', onclick: () => onAir(fc, lines) }, '🔴 Go on the air')));
  }

  function onAir(fc, lines) {
    sfx.onAir();
    let i = 0;
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
      el('div', { class: 'studio-top' }, el('span', { class: 'onair' }, 'ON AIR'), el('span', { class: 'studio-name' }, 'Weather Desk')),
      el('div', { class: 'studio-main' },
        el('div', { class: 'studio-map' }, svg(WX[fc ? fc.key : obs.sky] || WX.cloudy, 'studio-icon'), fc ? el('div', { class: 'studio-temp' }, `${fc.hi}°`) : null),
        prompter),
      el('div', { class: 'row gap center' }, nextLine));
    airOv = overlay(studio, 'studio-overlay');

    function finishAir() {
      sfx.applause(1.6);
      airOv.close(); airOv = null;
      store.update(s => {
        s.weather.log = s.weather.log.filter(l => l.date !== store.todayKey());
        s.weather.log.push({ date: store.todayKey(), sky: obs.sky, feel: obs.feel, wear: [...obs.wear], fc: fc ? { key: fc.key, hi: fc.hi, lo: fc.lo, rain: fc.rain } : null });
        s.weather.log = s.weather.log.slice(-60);
      });
      ctx.finish({
        title: 'That’s a wrap!',
        line: 'You delivered today’s weather report.',
        grownPrompt: 'Grown-up: did you hear the report? Ask the weather reporter one question about today’s weather.',
        note: fc ? fc.key : obs.sky,
        again: false,
      });
    }
  }

  return () => { if (airOv) airOv.close(); };
}
