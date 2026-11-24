// Leaf Lab: how plants make their own food.
//   Leaf Kitchen: guess what a plant uses, then switch sunlight, water, air, and soil on and off and watch.
//   Grow Lab: design a plant, name it, pick a summer, and see what the food it made turns into.
import { el, svg, icons, randInt } from '../ui.js';
import { PLANTS, LEAVES, ROOTS, SUMMERS, PLANT_WORDS, GUESSES, DISCOVERIES, BIG_WORDS, season, why, harvest, harvestText, harvestShort } from '../data/plants.js';
import { plantSVG, plantIcon, rootsSVG, ringSVG, pumpkinSVG, PICS } from '../plantart.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = (t) => 1 - Math.pow(1 - t, 2);
const tag = (x, y, text) => {
  const w = text.length * 6.6 + 14;
  return `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="-10" width="${w}" height="20" rx="10" fill="#fff" opacity=".9"/><text y="4.5" text-anchor="middle" font-family="Andika, sans-serif" font-size="13" font-weight="700" fill="#3b2a1e">${text}</text></g>`;
};
const dots = (path, n, dur, shape) => Array.from({ length: n }, (_, i) =>
  `<g>${shape}<animateMotion dur="${dur}s" begin="-${(dur / n * i).toFixed(2)}s" repeatCount="indefinite" path="${path}"/></g>`).join('');

/* ---------- Leaf Kitchen picture ---------- */
// st: { sun, water, air, soil }. Everything drawn here follows those four switches.
export function kitchenSVG(st) {
  const cooking = st.sun && st.water && st.air;
  const sky = st.sun
    ? `<rect width="400" height="300" fill="#cfeaf7"/><g stroke="#f8c93e" stroke-width="5" stroke-linecap="round"><path d="M62 14v-8M62 106v-8M12 56h8M112 56h-8M27 21l6 6M97 91l-6-6M97 21l-6 6M27 91l6-6"/></g><circle cx="62" cy="56" r="27" fill="#f8c93e"/>
       <g class="lk-ray" stroke="#f8c93e" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="11 9" fill="none"><path d="M92 68L224 110"/><path d="M90 76L248 122"/><path d="M86 84L270 132"/></g>${tag(150, 78, 'sunlight')}`
    : `<rect width="400" height="300" fill="#2f3c5a"/><circle cx="62" cy="56" r="22" fill="#e9e6cf"/><circle cx="72" cy="50" r="19" fill="#2f3c5a"/>
       <g fill="#e9e6cf"><circle cx="150" cy="36" r="1.8"/><circle cx="230" cy="58" r="1.5"/><circle cx="318" cy="30" r="1.8"/><circle cx="360" cy="84" r="1.5"/><circle cx="120" cy="100" r="1.4"/></g>`;
  const rootCol = st.soil ? '#c9a070' : '#b08450';
  const ground = st.soil
    ? `<rect y="190" width="400" height="110" fill="${st.water ? '#70492a' : '#a98058'}"/><rect y="190" width="400" height="7" fill="${st.sun ? '#6fae45' : '#4d7a3a'}"/>
       <g fill="${st.water ? '#5a3a20' : '#8f6a45'}"><circle cx="60" cy="232" r="5"/><circle cx="118" cy="268" r="4"/><circle cx="300" cy="244" r="5"/><circle cx="352" cy="276" r="4"/><circle cx="262" cy="282" r="3"/></g>
       ${st.water ? `<g fill="#6cc0ee"><path d="M150 214c-4 6-6 9-6 12a6 6 0 0 0 12 0c0-3-2-6-6-12z"/><path d="M246 226c-4 6-6 9-6 12a6 6 0 0 0 12 0c0-3-2-6-6-12z"/><path d="M178 262c-3 5-5 8-5 10a5 5 0 0 0 10 0c0-2-2-5-5-10z"/><path d="M226 270c-3 5-5 8-5 10a5 5 0 0 0 10 0c0-2-2-5-5-10z"/></g>` : ''}`
    : `<rect y="286" width="400" height="14" fill="#c9a36e"/>
       <path d="M146 196h108v78a12 12 0 0 1-12 12h-84a12 12 0 0 1-12-12z" fill="#ffffff" fill-opacity=".35" stroke="#8fb0c0" stroke-width="3"/>
       ${st.water ? `<path d="M149 212h102v62a9 9 0 0 1-9 9h-84a9 9 0 0 1-9-9z" fill="#6cc0ee" opacity=".6"/><path d="M149 212h102" stroke="#fff" stroke-width="2" opacity=".7"/>` : ''}
       <rect x="100" y="187" width="216" height="9" rx="3" fill="#b98d55"/>`;
  const roots = `<g fill="none" stroke="${rootCol}" stroke-linecap="round"><path d="M200 192 Q 196 222 180 252" stroke-width="4"/><path d="M200 192 Q 206 226 222 256" stroke-width="4"/><path d="M200 192 Q 201 218 200 242" stroke-width="3.5"/><path d="M190 226 q -12 4 -20 2" stroke-width="2.5"/><path d="M212 232 q 12 2 18 -4" stroke-width="2.5"/></g>`;
  const leafFill = st.sun ? '#5fae45' : '#3f7a3a';
  const plant = `<path d="M200 192 Q 205 142 200 96" fill="none" stroke="${st.sun ? '#4f8f3a' : '#3a6a34'}" stroke-width="7" stroke-linecap="round"/>
    <g transform="translate(200 152) rotate(204)"><path d="M0 0 C 8 -13, 28 -13, 38 0 C 28 13, 8 13, 0 0Z" fill="${leafFill}" stroke="#3f8a32" stroke-width="1.5"/></g>
    <g transform="translate(200 98) rotate(-62)"><path d="M0 0 C 6 -9, 20 -9, 27 0 C 20 9, 6 9, 0 0Z" fill="${leafFill}" stroke="#3f8a32" stroke-width="1.5"/></g>
    <g transform="translate(200 128) rotate(-12)"><path class="lk-leaf${cooking ? ' cooking' : ''}" d="M0 0 C 22 -34, 76 -34, 102 0 C 76 34, 22 34, 0 0Z" fill="${leafFill}" stroke="#3f8a32" stroke-width="2"/><path d="M2 0H94M30 0l14 -14M30 0l14 14M56 0l12 -11M56 0l12 11" stroke="#3f8a32" stroke-width="1.6" fill="none" opacity=".6" stroke-linecap="round"/></g>`;
  const water = st.water ? dots('M180 252 Q 196 222 200 192 Q 205 150 200 128 Q 226 122 250 117', 4, 3.4, '<circle r="4.6" fill="#3f9be0" stroke="#fff" stroke-width="1"/>') + tag(140, 246, 'water') : '';
  const air = st.air
    ? dots('M394 58 Q 330 66 262 108', 3, 2.8, '<circle r="5" fill="#9fb3c4" stroke="#fff" stroke-width="1"/>') + tag(352, 40, 'air')
    : `<path d="M110 190V120A96 96 0 0 1 302 120V190" fill="#ffffff" fill-opacity=".2" stroke="#9fc0cf" stroke-width="3.5"/><circle cx="206" cy="21" r="6" fill="#9fc0cf"/>${tag(352, 60, 'no air')}`;
  const made = cooking
    ? dots('M250 117 Q 226 122 200 128 Q 204 160 200 192 Q 200 218 200 240', 3, 3, '<rect x="-4.5" y="-4.5" width="9" height="9" rx="2" fill="#f2a53a" stroke="#fff" stroke-width="1" transform="rotate(45)"/>') + tag(160, 168, 'sugar')
      + (st.air ? dots('M258 100 Q 292 66 332 12', 3, 2.6, '<circle r="5.5" fill="#d8f0fb" stroke="#6bb6dc" stroke-width="2"/>') + tag(300, 22, 'oxygen') : '')
    : '';
  return `<svg class="lk-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">${sky}${ground}${roots}${plant}${water}${air}${made}</svg>`;
}

/* ---------- Grow Lab pictures ---------- */
function summerBack(summer) {
  const dry = summer.id === 'dry', cloudy = summer.id === 'cloudy';
  const cloud = (x, y, k, fill) => `<g transform="translate(${x} ${y}) scale(${k})" fill="${fill}"><ellipse cx="0" cy="0" rx="30" ry="14"/><ellipse cx="-18" cy="6" rx="20" ry="11"/><ellipse cx="20" cy="6" rx="22" ry="11"/></g>`;
  const drops = (xs, y0) => `<g class="gl-rain" stroke="#4ea3d8" stroke-width="2.4" stroke-linecap="round">${xs.map((x, i) => `<path d="M${x} ${y0 + (i % 3) * 14}l-3 9" style="animation-delay:${(i % 5) * -0.17}s"/>`).join('')}</g>`;
  const sky = dry
    ? `<rect width="400" height="260" fill="#f6e3b6"/><circle cx="64" cy="48" r="32" fill="#f6b52e"/><circle cx="64" cy="48" r="42" fill="#f6b52e" opacity=".25"/>`
    : cloudy
      ? `<rect width="400" height="260" fill="#c3cbd3"/><circle cx="64" cy="48" r="24" fill="#e8d9a0" opacity=".7"/>${cloud(70, 44, 1.5, '#9aa5b0')}${cloud(190, 34, 1.7, '#a7b1bb')}${cloud(318, 46, 1.6, '#9aa5b0')}${drops([40, 84, 128, 172, 216, 262, 306, 350, 62, 150, 240, 330], 70)}`
      : `<rect width="400" height="260" fill="#cfeaf7"/><circle cx="64" cy="48" r="26" fill="#f8c93e"/>${cloud(316, 40, 1.3, '#ffffff')}${drops([296, 312, 328, 344, 304, 336], 62)}`;
  const soil = dry
    ? `<rect y="178" width="400" height="82" fill="#cfa873"/><rect y="226" width="400" height="34" fill="#70492a"/><g stroke="#a98058" stroke-width="2" fill="none"><path d="M40 180l8 14-6 12"/><path d="M130 180l-6 16 8 10"/><path d="M270 180l6 12-8 14"/><path d="M350 180l-8 16 6 10"/></g>${tag(346, 244, 'water')}`
    : `<rect y="178" width="400" height="82" fill="#70492a"/><rect y="178" width="400" height="6" fill="#6fae45"/><g fill="#6cc0ee" opacity=".8"><circle cx="50" cy="204" r="3"/><circle cx="118" cy="232" r="3"/><circle cx="292" cy="210" r="3"/><circle cx="350" cy="238" r="3"/><circle cx="240" cy="244" r="3"/><circle cx="160" cy="200" r="3"/></g>`;
  return `<svg class="gl-svg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid meet">${sky}${soil}</svg>`;
}
function ruler() {
  const ticks = [2, 4, 6, 8, 10, 12, 14].map(ft => `<path d="M318 ${178 - ft * 11}h10" stroke="#5b3a22" stroke-width="2"/><text x="334" y="${182 - ft * 11}" font-family="Andika, sans-serif" font-size="11" font-weight="700" fill="#5b3a22">${ft}</text>`).join('');
  return `<path d="M318 178V20" stroke="#5b3a22" stroke-width="2.5"/>${ticks}<text x="318" y="14" text-anchor="middle" font-family="Andika, sans-serif" font-size="11" font-weight="700" fill="#5b3a22">feet</text>`;
}

export function start(ctx) {
  const { body, store, sfx } = ctx;
  let timers = [];
  let tick = 0;
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  function reset() {
    timers.forEach(clearTimeout); timers = [];
    clearInterval(tick); tick = 0;
    body.innerHTML = '';
  }
  const top = (backLabel, back, title) => el('div', { class: 'fh-top' }, el('button', { class: 'smallbtn', onclick: () => { sfx.tap(); back(); } }, '← ' + backLabel), el('h2', {}, title));

  let picks = [];
  const draft = { kind: 'sunflower', leaf: 2, roots: 'shallow', first: null, second: null };

  const draftName = () => (draft.first && draft.second ? `The ${draft.first} ${draft.second}` : 'Your new plant');
  const preview = () => `<svg class="gl-prev" viewBox="-120 -175 240 270"><rect x="-120" y="-175" width="240" height="175" fill="#cfeaf7"/><rect x="-120" y="0" width="240" height="95" fill="#70492a"/><rect x="-120" y="0" width="240" height="6" fill="#6fae45"/><g transform="translate(${draft.kind === 'pumpkin' ? -22 : 0} 0)">${plantSVG({ kind: draft.kind, leaf: draft.leaf, roots: draft.roots, grow: draft.kind === 'sunflower' ? 0.72 : 0.8, head: 0.7, pumpkin: 15, tomatoes: 7 })}</g></svg>`;

  menu();
  return () => reset();

  /* ================= Menu ================= */
  function menu() {
    reset();
    const s = store.get().leaf;
    body.append(
      el('div', { class: 'fh-menu' },
        el('button', { class: 'fh-mode', onclick: () => { sfx.pick(); guess(); } },
          el('div', { class: 'fh-mode-art lk-art' }, svg(kitchenSVG({ sun: true, water: true, air: true, soil: true }), 'lk-mini')),
          el('div', { class: 'fh-mode-text' },
            el('span', { class: 'fh-mode-title' }, 'Leaf Kitchen'),
            el('span', { class: 'muted' }, 'See how a leaf makes food'),
            s.kitchen ? el('span', { class: 'tale-done' }, svg(icons.check), 'You ran the kitchen') : null)),
        el('button', { class: 'fh-mode', onclick: () => { sfx.pick(); lab(0); } },
          el('div', { class: 'fh-mode-art gl-art' }, svg(plantIcon({ kind: 'sunflower', leaf: 3, grow: 0.8, head: 0.8 }), 'gl-mini')),
          el('div', { class: 'fh-mode-text' },
            el('span', { class: 'fh-mode-title' }, 'Grow Lab'),
            el('span', { class: 'muted' }, 'Design a plant, then grow it'),
            s.garden.length ? el('span', { class: 'tale-done' }, svg(icons.check), `${s.garden.length} plant${s.garden.length > 1 ? 's' : ''} in your garden`) : null))),
    );
    if (s.garden.length) {
      body.append(el('h3', { class: 'fh-box-title' }, 'My Garden'),
        el('div', { class: 'fh-box' }, s.garden.slice().reverse().map(p =>
          el('button', { class: 'fh-box-item gl-item', onclick: () => { sfx.pick(); Object.assign(draft, { kind: p.kind, leaf: p.leaf, roots: p.roots, first: p.first, second: p.second }); lab(3); } },
            svg(plantIcon({ kind: p.kind, leaf: p.leaf, grow: 0.7, head: 0.7, pumpkin: 14, tomatoes: 6 }), 'gl-item-pic'),
            el('span', {}, p.name),
            el('span', { class: 'gl-tried' }, SUMMERS.map(su => el('span', { class: 'gl-try' + (p.results[su.id] ? ' on' : '') }, el('b', {}, su.name.split(' ')[0]), p.results[su.id] ? harvestShort(p.kind, p.results[su.id].value, p.results[su.id].jars) : '–')))))));
    }
  }

  /* ================= Leaf Kitchen ================= */

  // First, what does he think? No right or wrong yet. The kitchen is the test.
  function guess() {
    reset();
    picks = [];
    const grid = el('div', { class: 'lk-guess' });
    const go = el('button', { class: 'bigbtn', disabled: true, onclick: () => { sfx.tap(); kitchen(); } }, 'Test it', svg(icons.next));
    const draw = () => {
      grid.innerHTML = '';
      GUESSES.forEach(g => grid.append(el('button', { class: 'lk-card' + (picks.includes(g.id) ? ' on' : ''), onclick: () => {
        if (picks.includes(g.id)) picks = picks.filter(x => x !== g.id);
        else if (picks.length < 3) picks.push(g.id);
        else return;
        sfx.pick(); draw();
      } }, svg(PICS[g.pic], 'lk-card-pic'), el('span', {}, g.name))));
      go.disabled = picks.length !== 3;
    };
    draw();
    body.append(top('Leaf Lab', menu, 'Leaf Kitchen'),
      el('div', { class: 'lk-ask' },
        el('p', { class: 'tale-text strong' }, 'What does a plant use to make its food?'),
        el('p', { class: 'll-q' }, 'Pick 3. Then we will test it.'),
        grid, el('div', { class: 'tale-actions' }, go)));
  }

  function kitchen() {
    reset();
    const st = { sun: false, water: false, air: true, soil: true };
    const found = {};
    let progress = 0, soilTime = 0, note = null;
    const scene = el('div', { class: 'lk-scene' });
    const jars = el('div', { class: 'lk-jars' });
    const msg = el('p', { class: 'lk-msg' });
    const list = el('div', { class: 'lk-list' });
    const done = el('div', { class: 'tale-actions' });
    const switches = el('div', { class: 'lk-switches' });
    const SW = [['sun', 'Sunlight', 'sun'], ['water', 'Water', 'water'], ['air', 'Air', 'air'], ['soil', 'Soil', 'soil']];

    const cooking = () => st.sun && st.water && st.air;
    const stateMsg = () => cooking() ? 'Cooking! The leaf is making sugar.'
      : !st.sun ? (st.water ? 'No sunlight. The leaf has no power.' : 'The leaf is a kitchen. Can you get it cooking?')
        : !st.water ? 'No water. An ingredient is missing.'
          : 'No air can get in. An ingredient is missing.';
    const drawScene = () => { scene.innerHTML = kitchenSVG(st); };
    const drawJars = () => {
      const n = Math.min(5, Math.floor(progress * 5 + 0.001));
      jars.innerHTML = '';
      jars.append(el('span', { class: 'lk-jars-label' }, 'Food made'), ...Array.from({ length: 5 }, (_, i) => svg(PICS.jar, 'lk-jar' + (i < n ? ' full' : ''))));
    };
    const drawList = () => {
      list.innerHTML = '';
      const next = DISCOVERIES.find(d => !found[d.id]);
      DISCOVERIES.forEach(d => list.append(el('div', { class: 'lk-todo' + (found[d.id] ? ' done' : '') + (next && next.id === d.id ? ' next' : '') },
        el('span', { class: 'lk-check' }, found[d.id] ? svg(icons.check) : ''), d.todo)));
      done.innerHTML = '';
      if (!next) done.append(el('button', { class: 'bigbtn', onclick: () => { sfx.tap(); recap(); } }, 'What did we learn?', svg(icons.next)));
    };
    const drawMsg = () => { msg.textContent = note || stateMsg(); msg.classList.toggle('found', !!note); };
    const drawSwitches = () => {
      switches.innerHTML = '';
      SW.forEach(([key, name, pic]) => switches.append(el('button', { class: 'lk-switch' + (st[key] ? ' on' : ''), onclick: () => {
        st[key] = !st[key]; note = null; soilTime = 0;
        sfx.pick(); drawSwitches(); drawScene(); check(); drawMsg();
      } }, svg(PICS[pic], 'lk-switch-pic'), el('span', { class: 'lk-switch-name' }, name), el('span', { class: 'lk-switch-state' }, st[key] ? 'ON' : 'OFF'))));
    };
    const discover = (id) => {
      if (found[id]) return;
      found[id] = true;
      note = DISCOVERIES.find(d => d.id === id).found;
      sfx.good(); drawList(); drawMsg();
      if (DISCOVERIES.every(d => found[d.id])) { store.update(s => { s.leaf.kitchen = (s.leaf.kitchen || 0) + 1; }); sfx.tada(); }
    };
    // The three "take it away" discoveries only count once he has seen the leaf cook.
    const check = () => {
      if (!found.cook) return;
      if (!st.sun && st.water && st.air) discover('nosun');
      else if (st.sun && (st.water !== st.air)) discover('nopart');
    };

    body.append(top('Leaf Lab', menu, 'Leaf Kitchen'),
      el('div', { class: 'lk' },
        el('div', { class: 'lk-left' }, scene, jars),
        el('div', { class: 'lk-right' }, switches, msg, list, done)));
    drawScene(); drawJars(); drawSwitches(); drawList(); drawMsg();

    tick = setInterval(() => {
      if (!cooking()) return;
      if (progress < 1) {
        const before = Math.floor(progress * 5 + 0.001);
        progress = Math.min(1, progress + 0.05);
        if (Math.floor(progress * 5 + 0.001) > before) { sfx.pick(); drawJars(); }
        if (progress >= 1) discover('cook');
      } else if (!st.soil) {
        soilTime += 0.25;
        if (soilTime >= 1.5) discover('nosoil');
      }
    }, 250);
  }

  function recap() {
    reset();
    const pic = (name, label) => el('div', { class: 'lk-part' }, svg(PICS[name], 'lk-part-pic'), el('span', {}, label));
    const sign = (t) => el('span', { class: 'lk-sign' }, t);
    const words = el('div', { class: 'lk-words' }, BIG_WORDS.map(w => {
      const card = el('button', { class: 'lk-word', onclick: () => { sfx.pick(); card.classList.toggle('open'); } },
        el('span', { class: 'lk-word-top' }, w.word), el('span', { class: 'lk-word-say' }, w.say), el('span', { class: 'lk-word-means' }, w.means));
      return card;
    }));
    body.append(top('Leaf Lab', menu, 'What the leaf does'),
      el('div', { class: 'lk-recap' },
        el('div', { class: 'lk-recipe' }, pic('water', 'Water'), sign('+'), pic('air', 'Air'), el('div', { class: 'lk-arrow' }, svg(PICS.sun, 'lk-arrow-sun'), el('span', {}, 'sunlight power'), el('span', { class: 'lk-arrow-line' })), pic('sugar', 'Sugar'), sign('+'), pic('oxygen', 'Oxygen')),
        el('p', { class: 'tale-text' }, 'Water and air go in. Sunlight is the power. Sugar comes out. That is the plant’s food!'),
        picks.length ? el('div', { class: 'lk-picks' }, el('h3', {}, 'Your 3 picks'), picks.map(id => {
          const g = GUESSES.find(x => x.id === id);
          return el('div', { class: 'lk-pickrow' + (g.right ? ' right' : '') }, svg(PICS[g.pic], 'lk-pick-pic'), el('span', {}, g.after));
        })) : null,
        el('h3', { class: 'lk-words-title' }, 'Big words. Tap one!'), words,
        el('div', { class: 'tale-actions' }, el('button', { class: 'bigbtn', onclick: () => {
          sfx.tap();
          ctx.finish({ title: 'You ran the Leaf Kitchen!', line: 'A plant makes its own food from water and air, with power from the sun.', note: 'kitchen', againLabel: 'Grow Lab', onAgain: () => lab(0) });
        } }, 'Done', svg(icons.next)))));
  }

  /* ================= Grow Lab ================= */
  function lab(stepNo = 0) {
    reset();
    const pv = el('div', { class: 'll-preview gl-preview' });
    const title = el('div', { class: 'll-name' });
    const sub = el('div', { class: 'll-sub muted' });
    const panel = el('div', { class: 'll-panel' });
    const steps = ['Plant', 'Design', 'Name', 'Grow'];
    const tabs = el('div', { class: 'wx-steps' }, steps.map((s, i) => el('button', { class: 'wx-step' + (i === stepNo ? ' on' : '') + (i < stepNo ? ' done' : ''), onclick: () => { if (i < 3 || (draft.first && draft.second)) lab(i); } }, s)));
    body.append(top('Leaf Lab', menu, 'Grow Lab'),
      el('div', { class: 'll' }, el('div', { class: 'll-left' }, pv, title, sub), el('div', { class: 'll-right' }, tabs, panel)));
    const refresh = () => {
      pv.innerHTML = preview();
      title.textContent = draftName();
      sub.textContent = `${PLANTS.find(p => p.id === draft.kind).name} · ${LEAVES[draft.leaf - 1].name.toLowerCase()} leaves · ${draft.roots} roots`;
    };
    refresh();
    const next = (n) => el('div', { class: 'tale-actions' }, el('button', { class: 'bigbtn', onclick: () => { sfx.tap(); lab(n); } }, 'Next', svg(icons.next)));

    if (stepNo === 0) {
      const tip = el('p', { class: 'll-tip' });
      const grid = el('div', { class: 'll-grid' });
      const draw = () => {
        grid.innerHTML = '';
        PLANTS.forEach(p => grid.append(el('button', { class: 'll-pick' + (draft.kind === p.id ? ' on' : ''), onclick: () => { sfx.pick(); draft.kind = p.id; draw(); refresh(); } },
          svg(plantIcon({ kind: p.id, leaf: 2, grow: 0.75, head: 0.7, pumpkin: 14, tomatoes: 6 }), 'gl-pick-pic'), el('span', {}, p.name))));
        tip.textContent = PLANTS.find(p => p.id === draft.kind).ask;
      };
      draw();
      panel.append(el('p', { class: 'll-q' }, 'Pick a plant to grow.'), grid, tip, next(1));
    } else if (stepNo === 1) {
      const tip = el('p', { class: 'll-tip' });
      const wrap = el('div', {});
      let last = 'leaf';
      const draw = () => {
        wrap.innerHTML = '';
        wrap.append(
          el('div', { class: 'll-group g1' }, el('div', { class: 'll-group-head' }, el('span', { class: 'll-num' }, '1'), 'Leaves'),
            el('div', { class: 'gl-opts' }, LEAVES.map(l => el('button', { class: 'gl-opt' + (draft.leaf === l.id ? ' on' : ''), onclick: () => { sfx.pick(); draft.leaf = l.id; last = 'leaf'; draw(); refresh(); } },
              svg(`<svg viewBox="-4 -22 48 44"><g transform="translate(0 0)"><path d="M0 0 C ${l.id * 2.6} ${-l.id * 5.4}, ${l.id * 10} ${-l.id * 5.4}, ${l.id * 13} 0 C ${l.id * 10} ${l.id * 5.4}, ${l.id * 2.6} ${l.id * 5.4}, 0 0Z" fill="#5fae45" stroke="#3f8a32" stroke-width="1.4"/></g></svg>`, 'gl-opt-pic'), el('span', {}, l.name))))),
          el('div', { class: 'll-group g2' }, el('div', { class: 'll-group-head' }, el('span', { class: 'll-num' }, '2'), 'Roots'),
            el('div', { class: 'gl-opts' }, ROOTS.map(r => el('button', { class: 'gl-opt' + (draft.roots === r.id ? ' on' : ''), onclick: () => { sfx.pick(); draft.roots = r.id; last = 'roots'; draw(); refresh(); } },
              svg(`<svg viewBox="-64 -16 128 104"><rect x="-64" y="0" width="128" height="88" fill="#70492a"/><rect x="-64" y="-5" width="128" height="6" fill="#6fae45"/><path d="M0 0V-14" stroke="#4f8f3a" stroke-width="5" stroke-linecap="round"/>${rootsSVG(r.id, 1)}</svg>`, 'gl-opt-pic roots'), el('span', {}, r.name))))));
        tip.textContent = last === 'leaf' ? LEAVES[draft.leaf - 1].tip : ROOTS.find(r => r.id === draft.roots).tip;
      };
      draw();
      panel.append(el('p', { class: 'll-q' }, 'Design your plant. Pick its leaves and its roots.'), wrap, tip, next(2));
    } else if (stepNo === 2) {
      const group = (key, n, label, words) => el('div', { class: 'll-group g' + n },
        el('div', { class: 'll-group-head' }, el('span', { class: 'll-num' }, String(n)), label),
        el('div', { class: 'll-words' }, words.map(w => el('button', { class: 'll-word' + (draft[key] === w ? ' on' : ''), onclick: () => { sfx.pick(); draft[key] = w; lab(2); } }, w))));
      const slot = (key, n) => el('span', { class: 'll-slot g' + n + (draft[key] ? ' filled' : '') }, draft[key] || String(n));
      const dice = el('button', { class: 'smallbtn', onclick: () => { sfx.pick(); draft.first = PLANT_WORDS.first[randInt(0, 11)]; draft.second = PLANT_WORDS.second[randInt(0, 11)]; lab(2); } }, '🎲 Surprise me');
      panel.append(el('p', { class: 'll-q' }, 'Name your plant. Pick a first word and a second word.'),
        el('div', { class: 'll-build' }, el('span', {}, 'The'), slot('first', 1), slot('second', 2), dice),
        group('first', 1, 'First word', PLANT_WORDS.first), group('second', 2, 'Second word', PLANT_WORDS.second),
        draft.first && draft.second ? next(3) : el('p', { class: 'muted' }, 'Pick one word from each box to keep going.'));
    } else {
      panel.append(el('p', { class: 'll-q' }, 'Time to grow it. What kind of summer will it be?'),
        el('div', { class: 'll-clarity' }, SUMMERS.map(su => el('button', { class: 'll-clear', onclick: () => { sfx.pick(); grow(su); } },
          svg(summerBack(su), 'gl-summer-pic'), el('span', { class: 'll-clear-name' }, su.name), el('span', { class: 'muted small' }, su.blurb)))));
    }
  }

  function grow(summer) {
    reset();
    const res = season(draft.leaf, draft.roots, summer);
    const value = harvest(draft.kind, res.jars);
    const kind = draft.kind;
    const gF = kind === 'sunflower' ? value / 14 : kind === 'oak' ? 0.35 + 0.13 * res.jars : 0.4 + 0.12 * res.jars;
    const pumpkinR = 4 + 5.2 * Math.cbrt(value);
    const plantLayer = el('div', { class: 'gl-plant' });
    const jars = el('div', { class: 'lk-jars' });
    const result = el('div', { class: 'cast-result' });
    const scene = el('div', { class: 'gl-scene' }, svg(summerBack(summer), 'gl-back'), plantLayer);
    body.append(top('Grow Lab', () => lab(3), `${draftName()} in a ${summer.name.toLowerCase()} summer`), el('div', { class: 'gl-stage' }, scene, jars), result);

    const draw = (p) => {
      const e = ease(p);
      const late = clamp((p - 0.5) / 0.5, 0, 1);
      const o = { kind, leaf: draft.leaf, roots: draft.roots, grow: 0.1 + (gF - 0.1) * e, wilt: res.wilt && p > 0.62,
        head: late * Math.max(0.3, res.jars / 5), pumpkin: late > 0 ? Math.max(3, pumpkinR * late) : 0, tomatoes: Math.round(value * late) };
      plantLayer.innerHTML = `<svg class="gl-svg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid meet">${kind === 'sunflower' ? ruler() : ''}<g transform="translate(${kind === 'pumpkin' ? 170 : 200} 178)">${plantSVG(o)}</g></svg>`;
      const n = Math.round(res.jars * e);
      jars.innerHTML = '';
      jars.append(el('span', { class: 'lk-jars-label' }, 'Food made'), ...Array.from({ length: 5 }, (_, i) => svg(PICS.jar, 'lk-jar' + (i < n ? ' full' : ''))));
    };
    const T = 5200, t0 = performance.now();
    draw(0);
    sfx.drumroll && later(() => sfx.drumroll(), T - 1300);
    tick = setInterval(() => {
      const p = clamp((performance.now() - t0) / T, 0, 1);
      draw(p);
      if (p >= 1) { clearInterval(tick); tick = 0; reveal(); }
    }, 90);

    function reveal() {
      const name = draftName();
      store.update(s => {
        let e = s.leaf.garden.find(g => g.name === name && g.kind === kind && g.leaf === draft.leaf && g.roots === draft.roots);
        if (!e) { e = { name, first: draft.first, second: draft.second, kind, leaf: draft.leaf, roots: draft.roots, results: {} }; s.leaf.garden.push(e); }
        e.results[summer.id] = { value, jars: res.jars };
      });
      res.jars >= 3 ? sfx.tada() : sfx.knock();
      const art = kind === 'tomato'
        ? svg(`<svg viewBox="0 0 ${10 * 16 + 4} ${Math.ceil(value / 10) * 16 + 4}">${Array.from({ length: value }, (_, i) => `<circle cx="${10 + (i % 10) * 16}" cy="${10 + Math.floor(i / 10) * 16}" r="6.4" fill="#e0452f"/><path d="M${7 + (i % 10) * 16} ${5 + Math.floor(i / 10) * 16}l3 1.6 3 -1.6" stroke="#3f8a32" stroke-width="1.6" fill="none" stroke-linecap="round"/>`).join('')}</svg>`, 'gl-res-pic wide')
        : kind === 'oak' ? svg(ringSVG([6, 4, 7], [2.5, 3.5, 6, 9, 11][res.jars - 1]), 'gl-res-pic')
          : kind === 'pumpkin' ? svg(pumpkinSVG(pumpkinR), 'gl-res-pic')
            : svg(plantIcon({ kind, leaf: draft.leaf, grow: Math.max(0.2, gF), head: Math.max(0.3, res.jars / 5), wilt: res.wilt }, { soil: false }), 'gl-res-pic');
      result.innerHTML = '';
      result.append(
        el('div', { class: 'catch-card pop' + (res.jars < 3 ? ' miss' : '') }, art,
          el('div', { class: 'catch-text' },
            el('h3', {}, harvestText(kind, value, res.jars)),
            kind === 'oak' ? el('p', { class: 'muted' }, 'The outside ring is this year’s wood. The tree built it from the food its leaves made.') : null,
            el('p', { class: 'tale-text' }, why(draft.leaf, draft.roots, summer, res)),
            el('p', { class: 'muted' }, `Saved to My Garden: ${name}`))),
        el('div', { class: 'row gap center wrap' },
          el('button', { class: 'bigbtn ghost', onclick: () => { sfx.tap(); lab(3); } }, 'Try another summer'),
          el('button', { class: 'bigbtn ghost', onclick: () => { sfx.tap(); lab(1); } }, 'Change the design'),
          el('button', { class: 'bigbtn', onclick: () => {
            sfx.tap();
            ctx.finish({ title: `${name} is in your garden!`, line: 'Its leaves made the food that grew it.', note: kind, againLabel: 'Grow another', onAgain: () => lab(0) });
          } }, 'Done', svg(icons.next))));
      setTimeout(() => result.scrollIntoView({ behavior: 'smooth', block: 'end' }), 50);
    }
  }
}
