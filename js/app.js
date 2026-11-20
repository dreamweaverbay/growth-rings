// Growth Rings — hub shell, home screen, grown-up area.
import * as store from './store.js';
import { sfx, unlockAudio } from './sound.js';
import { el, svg, icons, activityIcons, iconButton, bigButton, holdButton, overlay, grownUpGate, toast } from './ui.js';

const app = document.getElementById('app');

export const ACTIVITIES = [
  {
    id: 'story', name: 'Trail Tales', color: '#d98436',
    load: () => import('./activities/story.js'),
    status: s => {
      const n = Object.keys(s.story.finished).length;
      return n ? `${n} of 4 trails read` : '4 trails to read';
    },
  },
  {
    id: 'facts', name: 'Field Guide', color: '#7d55b5',
    load: () => import('./activities/facts.js'),
    status: s => {
      const n = Object.keys(s.facts.learned).length;
      return n ? `${n} facts found` : 'Questions and fun facts';
    },
  },
  {
    id: 'grove', name: 'Grove Grid', color: '#5f8f3e',
    load: () => import('./activities/grove.js'),
    status: s => (s.grove.solved[store.todayKey()] ? 'Solved today \u2713' : 'New puzzle today'),
  },
  {
    id: 'fishing', name: 'Fishing Hole', color: '#2a8a87',
    load: () => import('./activities/fishing.js'),
    status: s => {
      const w = Object.keys(s.fishing.stocked).length;
      const b = s.fishing.box.length;
      return w || b ? `${w} of 4 waters \u00B7 ${b} bait${b === 1 ? '' : 's'}` : 'Fish homes and lures';
    },
  },
  {
    id: 'weather', name: 'Weather Desk', color: '#3a86c8',
    load: () => import('./activities/weather.js'),
    status: s => (s.weather.log.some(l => l.date === store.todayKey()) ? 'Report done today \u2713' : 'Today\u2019s report'),
  },
];
// Pocket Magic (js/activities/magic.js) and Build Lab (js/activities/build.js) are parked for now.
// They will come back as their own tools.

export const COLORS = Object.fromEntries(ACTIVITIES.map(a => [a.id, a.color]));

let cleanup = null;

function route() {
  if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } cleanup = null; }
  const h = location.hash || '#/';
  window.scrollTo(0, 0);
  if (h.startsWith('#/a/')) {
    const id = h.slice(4);
    const act = ACTIVITIES.find(a => a.id === id);
    if (!act) { location.hash = '#/'; return; }
    if (store.limitReached()) { renderDoneForToday(); return; }
    openActivity(act);
  } else if (h === '#/grownup') {
    renderGrownUp();
  } else {
    renderHome();
  }
}

/* ---------------- Home ---------------- */

function renderHome() {
  const s = store.get();
  app.innerHTML = '';
  if (store.limitReached()) { renderDoneForToday(); return; }
  const name = s.settings.childName;
  const tiles = el('div', { class: 'tiles' }, ACTIVITIES.map((a, i) =>
    el('button', {
      class: 'tile', style: { '--c': a.color, animationDelay: `${i * 50}ms` },
      onclick: () => { sfx.pick(); location.hash = '#/a/' + a.id; },
    },
      svg(activityIcons[a.id], 'tile-icon'),
      el('span', { class: 'tile-name' }, a.name),
      el('span', { class: 'tile-status' }, a.status(s)),
    )));
  app.append(el('div', { class: 'home' },
    el('header', { class: 'topbar' },
      el('div', { class: 'brand' }, svg(icons.home, 'brand-mark'), el('span', {}, 'Growth Rings')),
      el('button', { class: 'grownup-link', onclick: () => grownUpGate(() => { location.hash = '#/grownup'; }) }, svg(icons.lock), 'Grown-ups'),
    ),
    el('main', { class: 'home-main' },
      el('div', { class: 'home-hello' },
        el('h1', {}, name ? `Hi, ${name}!` : 'Hi there!'),
        el('p', { class: 'lead' }, 'What will you do today?')),
      tiles),
  ));
}

/* ---------------- Done for today ---------------- */

const OFFSCREEN = [
  ['Draw something you saw today', '\u270F\uFE0F'],
  ['Build with your tiles or blocks', '\uD83E\uDDF1'],
  ['Read a book on the couch', '\uD83D\uDCD6'],
  ['Go look for animal tracks outside', '\uD83C\uDF3F'],
  ['Help a grown-up with a job', '\uD83E\uDD1D'],
];

function renderDoneForToday() {
  app.innerHTML = '';
  app.append(el('div', { class: 'doneday' },
    el('h1', {}, 'That\u2019s all for today!'),
    el('p', { class: 'lead' }, 'Time for the real world. Pick one:'),
    el('ul', { class: 'offscreen' }, OFFSCREEN.map(([t, e]) => el('li', {}, el('span', { class: 'emoji' }, e), t))),
    el('button', { class: 'grownup-link subtle', onclick: () => grownUpGate(() => { store.allowOneMore(); toast('One more today'); renderHome(); }) }, svg(icons.lock), 'Grown-up: allow one more'),
  ));
}

/* ---------------- Activity shell ---------------- */

async function openActivity(act) {
  app.innerHTML = '';
  const titleBar = el('header', { class: 'act-bar', style: { '--c': act.color } },
    iconButton('back', 'Back home', () => { location.hash = '#/'; }),
    el('div', { class: 'act-title' }, svg(activityIcons[act.id], 'act-icon'), el('span', {}, act.name)),
    el('div', { class: 'act-right' }),
  );
  const body = el('main', { class: 'act-body', style: { '--c': act.color } });
  app.append(el('div', { class: 'act act-' + act.id, style: { '--c': act.color } }, titleBar, body));

  const started = Date.now();
  const ctx = {
    body,
    right: titleBar.querySelector('.act-right'),
    store, sfx,
    color: act.color,
    exit: () => { location.hash = '#/'; },
    finish: (opts) => showFinish(act, opts, started),
  };
  try {
    const mod = await act.load();
    if (location.hash !== '#/a/' + act.id) return;
    const c = mod.start(ctx);
    cleanup = typeof c === 'function' ? c : null;
  } catch (e) {
    console.error(e);
    body.append(el('p', { class: 'error' }, 'This activity could not load. Check the internet connection and try again.'));
  }
}

function showFinish(act, opts = {}, started) {
  const minutes = Math.max(1, Math.round((Date.now() - started) / 60000));
  store.logEvent(act.id, 'done', { m: minutes, note: opts.note || '' });
  sfx.finish();
  let ov;
  const grown = opts.grownPrompt ? el('div', { class: 'grown-box' },
    el('div', { class: 'grown-head' }, svg(icons.people, 'grown-icon'), el('span', {}, 'Grown-up moment')),
    el('p', { class: 'grown-prompt' }, opts.grownPrompt),
    holdButton('Grown-up: hold to say we did it', () => { store.logEvent(act.id, 'grown', { note: opts.note || '' }); sfx.spark(); }),
  ) : null;
  const buttons = el('div', { class: 'row gap center' });
  if (opts.again !== false) buttons.append(el('button', { class: 'bigbtn ghost', onclick: () => { sfx.tap(); ov.close(); if (opts.onAgain) opts.onAgain(); else route(); } }, svg(icons.again), opts.againLabel || 'Again'));
  buttons.append(el('button', { class: 'bigbtn', style: { background: act.color }, onclick: () => { sfx.tap(); ov.close(); location.hash = '#/'; if (location.hash === '#/') route(); } }, 'Home'));
  ov = overlay(el('div', { class: 'finish' },
    el('div', { class: 'finish-badge', style: { background: act.color } }, svg(icons.check)),
    el('div', { class: 'finish-text' },
      el('h2', {}, opts.title || 'Nice work!'),
      opts.line ? el('p', { class: 'lead' }, opts.line) : null,
      grown,
      buttons,
    ),
  ), 'finish-overlay');
}

/* ---------------- Grown-up area ---------------- */

function renderGrownUp() {
  const s = store.get();
  app.innerHTML = '';
  const now = Date.now();
  const thisW = store.weekStart(now);
  const lastW = thisW - store.WEEK;
  const rows = ACTIVITIES.map(a => {
    const ev = s.events.filter(e => e.a === a.id);
    const tw = ev.filter(e => e.t >= thisW);
    const lw = ev.filter(e => e.t >= lastW && e.t < thisW);
    return el('tr', {},
      el('td', {}, el('span', { class: 'dot', style: { background: a.color } }), a.name),
      el('td', {}, String(tw.filter(e => e.k === 'done').length)),
      el('td', {}, String(lw.filter(e => e.k === 'done').length)),
      el('td', {}, String(tw.filter(e => e.k === 'grown').length)),
      el('td', {}, String(tw.filter(e => e.k === 'done').reduce((m, e) => m + (e.m || 0), 0))),
    );
  });

  const nameInput = el('input', { type: 'text', value: s.settings.childName, placeholder: 'First name', maxlength: 20 });
  nameInput.addEventListener('change', () => { store.update(st => { st.settings.childName = nameInput.value.trim(); }); toast('Saved'); });

  const limitSel = el('select', {}, [0, 2, 3, 4, 5, 6].map(n => el('option', { value: n, selected: s.settings.dailyLimit === n ? true : null }, n ? `${n} activities a day` : 'No daily limit')));
  limitSel.addEventListener('change', () => { store.update(st => { st.settings.dailyLimit = parseInt(limitSel.value, 10); }); toast('Saved'); });

  const soundToggle = el('input', { type: 'checkbox', checked: s.settings.sound ? true : null });
  soundToggle.addEventListener('change', () => { store.update(st => { st.settings.sound = soundToggle.checked; }); });

  // weather place search
  const placeLabel = el('p', { class: 'muted' }, s.settings.place ? `Current: ${s.settings.place.name}` : 'Not set yet. The Weather Desk needs a town for the forecast.');
  const placeInput = el('input', { type: 'text', placeholder: 'Town name, e.g. Bowling Green' });
  const placeResults = el('div', { class: 'place-results' });
  const searchPlace = async () => {
    const q = placeInput.value.trim();
    if (!q) return;
    placeResults.innerHTML = '<p class="muted">Searching…</p>';
    try {
      const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en&format=json`);
      const data = await r.json();
      placeResults.innerHTML = '';
      if (!data.results || !data.results.length) { placeResults.append(el('p', { class: 'muted' }, 'No matches. Try just the town name.')); return; }
      data.results.forEach(p => {
        const label = [p.name, p.admin1, p.country_code].filter(Boolean).join(', ');
        placeResults.append(el('button', { class: 'place-btn', onclick: () => {
          store.update(st => { st.settings.place = { name: label, lat: p.latitude, lon: p.longitude }; st.weather.cache = null; });
          placeLabel.textContent = `Current: ${label}`;
          placeResults.innerHTML = '';
          toast('Weather town saved');
        } }, label));
      });
    } catch (e) {
      placeResults.innerHTML = '<p class="muted">Couldn’t search right now. Check the internet connection.</p>';
    }
  };
  placeInput.addEventListener('keydown', e => { if (e.key === 'Enter') searchPlace(); });
  const geoBtn = el('button', { class: 'smallbtn', onclick: () => {
    if (!navigator.geolocation) { toast('Location not available'); return; }
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      store.update(st => { st.settings.place = { name: 'This tablet’s location', lat: +latitude.toFixed(3), lon: +longitude.toFixed(3) }; st.weather.cache = null; });
      placeLabel.textContent = 'Current: This tablet’s location';
      toast('Weather location saved');
    }, () => toast('Location permission was not given'));
  } }, 'Use this tablet’s location');

  const fileIn = el('input', { type: 'file', accept: 'application/json,.json', style: { display: 'none' } });
  fileIn.addEventListener('change', async () => {
    const f = fileIn.files[0]; if (!f) return;
    try { store.importData(await f.text()); toast('Backup restored'); renderGrownUp(); }
    catch (e) { toast('That file isn’t a Growth Rings backup'); }
  });

  const download = () => {
    const blob = new Blob([store.exportData()], { type: 'application/json' });
    const a = el('a', { href: URL.createObjectURL(blob), download: `growth-rings-backup-${store.todayKey()}.json` });
    document.body.append(a); a.click(); a.remove();
  };

  const reset = () => {
    let ov;
    ov = overlay(el('div', { class: 'gate' },
      el('h2', {}, 'Erase everything?'),
      el('p', {}, 'This removes all progress and settings on this tablet. Download a backup first if you might want it later.'),
      el('div', { class: 'row gap' },
        el('button', { class: 'bigbtn ghost', onclick: () => ov.close() }, 'Keep it'),
        el('button', { class: 'bigbtn danger', onclick: () => { store.resetAll(); ov.close(); toast('Erased'); renderGrownUp(); } }, 'Erase'))));
  };

  app.append(el('div', { class: 'grownup' },
    el('header', { class: 'act-bar plain' },
      iconButton('back', 'Back home', () => { location.hash = '#/'; }),
      el('div', { class: 'act-title' }, el('span', {}, 'Grown-up area')),
      el('div', {}),
    ),
    el('main', { class: 'grownup-main' },
      el('section', { class: 'card' },
        el('h2', {}, 'What he’s choosing'),
        el('p', { class: 'muted' }, 'Finished activities and grown-up moments. Use this to decide what to keep, cut, or expand.'),
        el('table', { class: 'stats' },
          el('thead', {}, el('tr', {}, el('th', {}, 'Activity'), el('th', {}, 'This week'), el('th', {}, 'Last week'), el('th', {}, 'Grown-up moments'), el('th', {}, 'Minutes this week'))),
          el('tbody', {}, rows))),
      el('section', { class: 'card' },
        el('h2', {}, 'Settings'),
        el('label', { class: 'field' }, el('span', {}, 'Child’s first name'), nameInput),
        el('label', { class: 'field' }, el('span', {}, 'Daily limit'), limitSel),
        el('p', { class: 'muted small' }, 'When the limit is reached, the hub shows off-screen ideas until tomorrow. You can allow one more from that screen.'),
        el('label', { class: 'field inline' }, soundToggle, el('span', {}, 'Sound effects')),
      ),
      el('section', { class: 'card' },
        el('h2', {}, 'Weather town'),
        placeLabel,
        el('div', { class: 'row gap' }, placeInput, el('button', { class: 'smallbtn', onclick: searchPlace }, 'Search')),
        placeResults,
        geoBtn,
        el('p', { class: 'muted small' }, 'Forecasts come from Open-Meteo, a free service with no account.'),
      ),
      el('section', { class: 'card' },
        el('h2', {}, 'Backup'),
        el('p', { class: 'muted' }, 'Everything is saved only on this tablet. Clearing the browser’s data erases it, so download a backup now and then.'),
        el('div', { class: 'row gap wrap' },
          el('button', { class: 'smallbtn', onclick: download }, 'Download backup'),
          el('button', { class: 'smallbtn', onclick: () => fileIn.click() }, 'Restore from backup'),
          el('button', { class: 'smallbtn danger', onclick: reset }, 'Erase everything')),
        fileIn,
      ),
      el('section', { class: 'card' },
        el('h2', {}, 'Make it an app'),
        el('p', { class: 'muted' }, 'In Chrome on the tablet, open the ⋮ menu and choose “Add to home screen” or “Install app.” It will open full-screen and work offline (except the weather forecast).'),
      ),
    ),
  ));
}

/* ---------------- Boot ---------------- */

unlockAudio();
window.addEventListener('hashchange', route);
route();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
