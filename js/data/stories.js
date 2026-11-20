// Trail Tales stories.
// Rule for every page: if the words name it, the picture shows it, in that amount.
// Each picture is drawn from the same numbers the sentence uses.
import { scene, prop, propIcon, seasonIcon } from '../art.js';
import { randInt, shuffle } from '../ui.js';

const LV = (lvl, arr) => arr[Math.max(1, Math.min(5, lvl)) - 1];
const wrap = (inner) => `<svg class="scene" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
const s = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function row(name, count, { x, y, step = 30, perRow = 5, dy = 22, sc = 1, flip = false, mark } = {}) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const r = Math.floor(i / perRow), k = i % perRow;
    const px = x + k * step, py = y + r * dy;
    out += prop(name, px, py, sc, flip);
    if (mark) out += mark(px, py, i);
  }
  return out;
}

/* ================= Beaver Bridge ================= */

function bridge(v, { filled = v.filled, left = [], right = [], on = [], tappable = false } = {}) {
  const T = v.total, x0 = 100, x1 = 300, w = (x1 - x0) / T;
  let o = `<rect width="400" height="220" fill="#cfe9f3"/>
    <path d="M0 118 Q100 92 200 110 Q300 128 400 98 V220 H0Z" fill="#b4d695"/>
    <rect y="180" width="400" height="40" fill="#6fb3d9"/>
    <path d="M130 196 h22 M190 204 h28 M246 194 h18" stroke="#fff" stroke-width="2" opacity=".5" stroke-linecap="round"/>
    <path d="M0 150 H84 Q94 150 96 164 L102 220 H0 Z" fill="#82b05e"/><path d="M0 150 H84 Q94 150 96 164" fill="none" stroke="#6a9a48" stroke-width="3"/>
    <path d="M400 150 H316 Q306 150 304 164 L298 220 H400 Z" fill="#82b05e"/><path d="M400 150 H316 Q306 150 304 164" fill="none" stroke="#6a9a48" stroke-width="3"/>
    <rect x="88" y="159" width="224" height="6" rx="3" fill="#6b4426"/>`;
  for (let i = 0; i < T; i++) {
    const x = x0 + i * w + 1;
    if (i < filled) o += `<rect x="${x}" y="141" width="${w - 2}" height="19" rx="5" fill="#a8743f" stroke="#6b4426" stroke-width="1.5"/>`;
    else o += `<rect class="${tappable ? 'slot' : ''}" data-i="${i}" x="${x}" y="141" width="${w - 2}" height="19" rx="5" fill="#ffffff" fill-opacity=".45" stroke="#6b4426" stroke-width="1.5" stroke-dasharray="4 3"/>`;
  }
  left.forEach(([n, x, sc, flip]) => { o += prop(n, x, 150, sc, flip); });
  right.forEach(([n, x, sc, flip]) => { o += prop(n, x, 150, sc, flip); });
  on.forEach(([n, x, sc, flip]) => { o += prop(n, x, 141, sc, flip); });
  return wrap(o);
}

const FRIENDS_LEFT = [['mole', 14, 0.6, true], ['fox', 44, 0.6, true], ['goat', 78, 0.6, true]];

const beaverBridge = {
  id: 'bridge',
  title: 'Beaver Bridge',
  grown: 'Build a bridge with a grown-up using blocks, tiles, or books. How many pieces long can you make it?',
  cover: () => bridge({ total: 8, filled: 5 }, { left: [['beaver', 46, 1, true]] }),
  init(v, lvl) {
    v.need = randInt(LV(lvl, [2, 3, 4, 5, 6]), LV(lvl, [4, 5, 7, 8, 10]));
    v.filled = randInt(2, Math.min(4, 12 - v.need));
    v.total = v.filled + v.need;
  },
  pages: {
    start: {
      scene: v => bridge(v, { left: [['beaver', 46, 1, true]] }),
      text: () => 'Bev the beaver is building a bridge over the creek. It is not done yet.',
      next: 'need',
    },
    need: {
      type: 'math',
      scene: v => bridge(v, { left: [['beaver', 46, 1, true]] }),
      text: v => `The bridge needs ${v.total} logs. Bev has put in ${v.filled}. How many more logs does the bridge need?`,
      answer: v => v.need,
      frames: v => ({ type: 'part', a: v.filled, c: v.total }),
      next: 'fork',
    },
    fork: {
      type: 'choices',
      scene: v => bridge(v, { left: [['beaver', 46, 1, true]] }),
      text: v => `Bev needs ${s(v.need, 'more log', 'more logs')}. Where will you look?`,
      choices: [
        { label: 'In the woods', icon: 'pine', to: 'woods' },
        { label: 'Down the creek', icon: 'log', to: 'creek' },
      ],
    },
    woods: {
      type: 'math',
      setup(v) { v.a = randInt(Math.max(1, v.need - 6), Math.min(6, v.need - 1)); v.b = v.need - v.a; },
      scene: v => scene({ bg: 'day', props: [['pine', 14, 158, 1], ['pine', 390, 158, 1], ['beaver', 204, 162, 0.9]] },
        prop('stump', 40, 192, 1.1) + row('log', v.a, { x: 88, y: 186, step: 38, perRow: 3, dy: 18, sc: 0.65 })
        + prop('rock', 232, 194, 1.1) + row('log', v.b, { x: 282, y: 186, step: 38, perRow: 3, dy: 18, sc: 0.65 })),
      text: v => `In the woods you find ${s(v.a, 'log', 'logs')} by the stump and ${s(v.b, 'log', 'logs')} by the rock. How many logs did you find?`,
      answer: v => v.need,
      frames: v => ({ type: 'join', a: v.a, b: v.b }),
      next: 'place',
    },
    creek: {
      type: 'math',
      setup(v) { v.k = randInt(1, Math.min(4, 14 - v.need)); },
      scene: v => scene({ bg: 'day', creek: true, props: [['beaver', 340, 166, 0.9]] },
        row('log', v.need, { x: 44, y: 148, step: 44, perRow: 5, dy: 18, sc: 0.7 })
        + Array.from({ length: v.k }, (_, i) => `<g transform="rotate(${i % 2 ? 10 : -12} ${130 + i * 62} 188)" opacity=".85">${prop('log', 130 + i * 62, 193, 0.7)}</g><path d="M${104 + i * 62} 197 h52" stroke="#fff" stroke-width="2" opacity=".7" stroke-linecap="round"/>`).join('')),
      text: v => `There are ${v.need + v.k} logs by the creek. Splash! ${s(v.k, 'log rolls', 'logs roll')} into the water and ${v.k === 1 ? 'floats' : 'float'} away. How many logs are left on the bank?`,
      answer: v => v.need,
      frames: v => ({ type: 'leave', a: v.need + v.k, b: v.k }),
      next: 'place',
    },
    place: {
      type: 'place',
      setup(v) { v.placed = 0; },
      scene: v => bridge(v, { filled: v.filled + v.placed, left: [['beaver', 46, 1, true]], tappable: true }),
      text: v => `You and Bev carry the ${s(v.need, 'log', 'logs')} back. Tap each empty spot to put a log in.`,
      done: v => v.placed >= v.need,
      doneText: v => `All ${v.total} logs are in. The bridge is done!`,
      next: 'cross',
    },
    cross: {
      type: 'pick',
      setup(v, lvl) {
        v.w = { mole: 1, fox: randInt(8, 14), goat: randInt(LV(lvl, [20, 30, 40, 50, 60]), LV(lvl, [30, 50, 70, 90, 99])) };
        v.ask = Math.random() < 0.5 ? 'lightest' : 'heaviest';
      },
      scene: v => bridge(v, { filled: v.total, left: FRIENDS_LEFT, right: [['beaver', 352, 1]] }),
      text: v => `Three friends want to cross. Mo weighs ${v.w.mole} pound. Pip weighs ${v.w.fox} pounds. Gus weighs ${v.w.goat} pounds. ${v.ask === 'lightest' ? 'Bev wants the lightest friend to go first. Who is the lightest?' : 'Bev wants the heaviest friend to test the bridge. Who is the heaviest?'}`,
      options: v => [['mole', 'Mo'], ['fox', 'Pip'], ['goat', 'Gus']].map(([p, n]) => ({ key: p, icon: propIcon(p), label: `${n}: ${v.w[p]}` })),
      correct: v => (v.ask === 'lightest' ? 'mole' : 'goat'),
      next: 'end',
    },
    end: {
      scene: v => bridge(v, { filled: v.total, on: [['mole', 150, 0.7, true], ['fox', 200, 0.7, true], ['goat', 252, 0.7, true]], right: [['beaver', 352, 1]] }),
      text: () => 'The bridge holds! One by one, the friends cross the creek. Bev slaps her tail. Good job!',
      end: true,
    },
  },
};

/* ================= The Lost Lantern ================= */

const FLY_SPOTS = [[60, 60], [330, 50], [110, 96], [300, 104], [44, 118], [352, 138], [132, 44], [268, 66], [86, 148], [318, 160], [150, 124]];
const HIDE = [
  { p: 'hollowlog', name: 'log', prep: 'in' },
  { p: 'bush', name: 'bush', prep: 'in' },
  { p: 'rock', name: 'rock', prep: 'behind' },
  { p: 'stump', name: 'stump', prep: 'behind' },
];
const HIDE_XY = [[58, 200], [200, 212], [338, 200]];

function owlScene(v, found) {
  let inner = prop('oak', 200, 182, 1.8) + prop('owl', 236, 92, 0.9);
  v.places.forEach((pl, i) => { inner += prop(pl.p, HIDE_XY[i][0], HIDE_XY[i][1], 0.9); });
  inner += prop('fox', 128, 214, 0.75);
  if (found) { const i = v.places.indexOf(v.spot); inner += prop('lantern', HIDE_XY[i][0] + (i === 2 ? -44 : 40), HIDE_XY[i][1] + 2, 1.2); }
  return scene({ bg: 'night', props: [['moon', 340, 62, 1.1]] }, inner);
}

function lanternScene(v, inside) {
  let inner = prop('fox', 84, 210, 0.9) + prop('lantern', 200, 208, 3, false, inside >= v.flies);
  for (let i = 0; i < inside; i++) {
    const x = 186 + (i % 3) * 14, y = 138 + Math.floor(i / 3) * 14;
    inner += `<circle cx="${x}" cy="${y}" r="6" fill="#fff3a8" opacity=".5"/><circle cx="${x}" cy="${y}" r="3.4" fill="#ffe27a"/>`;
  }
  for (let i = 0; i < v.flies - inside; i++) {
    const [x, y] = FLY_SPOTS[i];
    inner += `<circle cx="${x}" cy="${y}" r="9" fill="#ffe27a" opacity=".35"/><circle cx="${x}" cy="${y}" r="3.6" fill="#fff6c2"/>`;
  }
  return scene({ bg: 'night', props: [['moon', 350, 40, 0.8]] }, inner);
}

const lostLantern = {
  id: 'lantern',
  title: 'The Lost Lantern',
  grown: 'Tell a grown-up which way you went and where the lantern was hiding.',
  cover: () => scene({ bg: 'dusk', props: [['pine', 60, 172, 1.1], ['pine', 340, 170, 1.2], ['lantern', 200, 190, 1.8], ['fox', 276, 196, 1.2]] }),
  init() {},
  pages: {
    start: {
      scene: () => scene({ bg: 'dusk', props: [['sun', 330, 138, 1.6], ['barn', 90, 176, 1.1], ['fox', 250, 196, 1.4]] }),
      text: () => 'The sun is going down by the barn. Pip the fox runs up to you.',
      next: 'ask',
    },
    ask: {
      scene: () => scene({ bg: 'dusk', props: [['pine', 50, 170, 1.2], ['pine', 120, 165, 0.9], ['pine', 350, 168, 1.1], ['fox', 230, 198, 1.6, true]] }),
      text: () => '“I lost my lantern in the woods,” says Pip. “Can you help me find it?”',
      button: 'Yes! Let’s go.',
      next: 'fork',
    },
    fork: {
      type: 'choices',
      scene: () => scene({ bg: 'dusk' },
        `<path d="M184 220 L216 220 L212 190 Q260 172 336 156 L326 148 Q256 162 200 176 Q144 162 74 148 L64 156 Q140 172 188 190 Z" fill="#d9bf8f"/>
         <ellipse cx="52" cy="150" rx="50" ry="9" fill="#5d8fb0"/>${prop('log', 40, 146, 0.8)}${prop('frog', 44, 136, 0.7)}
         ${prop('rock', 318, 146, 0.8)}${prop('rock', 356, 152, 1)}${prop('rock', 340, 132, 0.6)}${prop('fox', 200, 214, 0.8)}`),
      text: () => 'The path splits in two. One way goes down to the creek. One way goes up the rocky hill. Which way will you look first?',
      choices: [
        { label: 'Down to the creek', icon: 'frog', to: 'creek' },
        { label: 'Up the rocky hill', icon: 'rock', to: 'hill' },
      ],
    },
    creek: {
      type: 'math',
      setup(v, lvl) { const S = LV(lvl, [5, 7, 9, 10, 11]); v.a = randInt(1, Math.min(6, S - 1)); v.b = randInt(1, Math.min(5, S - v.a)); },
      scene: v => scene({ bg: 'dusk', creek: true, props: [['bush', 30, 166, 0.9]] },
        prop('log', 150, 178, 2.2) + row('frog', v.a, { x: 98, y: 148, step: 20, perRow: 6, sc: 0.75 })
        + Array.from({ length: v.b }, (_, i) => `<ellipse cx="${240 + i * 30}" cy="187" rx="13" ry="5" fill="#4f9a3e"/>${prop('frog', 240 + i * 30, 186, 0.75)}`).join('')
        + prop('fox', 60, 216, 0.85)),
      text: v => `No lantern by the creek. But ${s(v.a, 'frog sits', 'frogs sit')} on the log and ${s(v.b, 'frog sits', 'frogs sit')} on ${v.b === 1 ? 'a lily pad' : 'lily pads'}. Pip wants to ask them all. How many frogs is that?`,
      answer: v => v.a + v.b,
      frames: v => ({ type: 'join', a: v.a, b: v.b }),
      next: 'dark',
    },
    hill: {
      type: 'math',
      setup(v, lvl) { v.a = randInt(LV(lvl, [3, 4, 5, 6, 7]), LV(lvl, [5, 7, 8, 10, 10])); v.b = randInt(1, v.a - 1); },
      scene: v => scene({ bg: 'dusk', props: [['pine', 372, 150, 0.7]] },
        row('rock', v.a, { x: 118, y: 172, step: 52, perRow: 5, dy: 32, sc: 0.7,
          mark: (x, y, i) => (i < v.b ? `<circle cx="${x}" cy="${y - 30}" r="9" fill="#4f9a45"/><path d="M${x - 4} ${y - 30} l3 4 l6 -8" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : '') })
        + prop('fox', 52, 208, 0.9)),
      text: v => `The lantern may be behind a rock! There are ${v.a} rocks on the hill. You and Pip look behind ${v.b} of them. No lantern. How many rocks are left to check?`,
      answer: v => v.a - v.b,
      frames: v => ({ type: 'leave', a: v.a, b: v.b }),
      next: 'dark',
    },
    dark: {
      type: 'count',
      setup(v, lvl) { v.flies = randInt(LV(lvl, [3, 4, 5, 6, 7]), LV(lvl, [5, 7, 9, 10, 11])); },
      scene: () => ({ bg: 'night', props: [['moon', 340, 62, 1.1], ['pine', 40, 178, 1.3], ['oak', 200, 184, 1.5], ['pine', 372, 180, 1.1], ['fox', 110, 208, 0.9]] }),
      text: () => 'Now it is too dark to see. Fireflies can help! Tap each firefly to light it up.',
      doneText: v => `${v.flies} fireflies light the way to a big oak tree.`,
      next: 'owl',
    },
    owl: {
      type: 'pick',
      setup(v) { v.places = shuffle(HIDE).slice(0, 3); v.spot = v.places[randInt(0, 2)]; },
      scene: (v, found) => owlScene(v, found),
      text: v => {
        const [A, B] = v.places.filter(p => p !== v.spot);
        return `Hoot the owl sits in the oak. “I saw your lantern fall,” says Hoot. “It is not ${A.prep} the ${A.name}. It is not ${B.prep} the ${B.name}.” Where is the lantern?`;
      },
      options: v => v.places.map(pl => ({ key: pl.p, icon: propIcon(pl.p), label: `The ${pl.name}` })),
      correct: v => v.spot.p,
      doneText: () => 'You found the lantern!',
      next: 'glow',
    },
    glow: {
      type: 'math',
      setup(v) { v.in = randInt(1, v.flies - 1); },
      scene: (v, done) => lanternScene(v, done ? v.flies : v.in),
      text: v => `The lantern is dark. The ${v.flies} fireflies want to help! ${s(v.in, 'firefly flies', 'fireflies fly')} into the lantern. How many fireflies are still outside?`,
      answer: v => v.flies - v.in,
      frames: v => ({ type: 'part', a: v.in, c: v.flies }),
      doneText: v => `Now all ${v.flies} are inside.`,
      next: 'end',
    },
    end: {
      scene: () => scene({ bg: 'night', props: [['moon', 330, 60, 1.2], ['pine', 50, 176, 1.1], ['lantern', 170, 200, 2.2, false, true], ['fox', 256, 206, 1.3, true]] }),
      text: () => 'The lantern glows! “Thank you,” says Pip. You walk home under the stars.',
      end: true,
    },
  },
};

/* ================= The Oldest Oak ================= */

function pineBranches(v) {
  let o = `<rect x="195" y="34" width="10" height="134" fill="#6b4426"/><path d="M200 14 L214 40 H186 Z" fill="#3f7a46"/>`;
  for (let i = 0; i < v.a; i++) {
    const side = i % 2 ? 1 : -1, y = 58 + Math.floor(i / 2) * 22;
    if (v.thin.includes(i)) o += `<path d="M200 ${y} Q${200 + side * 34} ${y + 2} ${200 + side * 62} ${y + 12}" stroke="#8a6a48" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="${200 + side * 62}" cy="${y + 12}" r="3" fill="#7fa86a"/>`;
    else o += `<path d="M200 ${y} L${200 + side * 74} ${y - 8}" stroke="#6b4426" stroke-width="7" stroke-linecap="round"/><ellipse cx="${200 + side * 50}" cy="${y - 13}" rx="30" ry="8" fill="#3f7a46"/>`;
  }
  return scene({ bg: 'day' }, o + prop('owl', 336, 196, 1));
}

function barnInside(v) {
  let o = `<rect width="400" height="220" fill="#9a6a40"/>`;
  for (let x = 0; x <= 400; x += 40) o += `<line x1="${x}" y1="0" x2="${x}" y2="190" stroke="#7a4e2c" stroke-width="2"/>`;
  o += `<rect y="190" width="400" height="30" fill="#e3c66a"/><path d="M20 200 l14 -6 M90 206 l16 -5 M200 200 l14 -6 M300 206 l16 -5" stroke="#c9a640" stroke-width="2"/>`;
  o += `<rect x="322" y="14" width="56" height="44" fill="#bfe3f2" stroke="#5b3a22" stroke-width="4"/>${prop('owl', 350, 58, 0.7)}`;
  o += `<rect x="14" y="92" width="290" height="9" rx="3" fill="#5b3a22"/><rect x="14" y="160" width="372" height="9" rx="3" fill="#5b3a22"/>`;
  o += row('hen', v.b, { x: 46, y: 93, step: 48, perRow: 6, sc: 0.8 });
  o += row('hen', v.a, { x: 46, y: 161, step: 48, perRow: 7, sc: 0.8 });
  return wrap(o);
}

function fallScene() {
  const tree = (x, c1, c2) => `<path d="M${x - 5} 186 L${x - 4} 140 H${x + 4} L${x + 5} 186 Z" fill="#7a4e2c"/><circle cx="${x - 16}" cy="128" r="20" fill="${c1}"/><circle cx="${x + 16}" cy="126" r="22" fill="${c2}"/><circle cx="${x}" cy="108" r="22" fill="${c1}"/>`;
  let o = tree(70, '#e08a2e', '#d9642c') + tree(330, '#d9642c', '#e3ad25');
  [[120, 60], [150, 110], [180, 40], [226, 96], [260, 56], [290, 130], [136, 160], [246, 150], [210, 190], [104, 200], [300, 196]].forEach(([x, y], i) => {
    o += `<ellipse cx="${x}" cy="${y}" rx="7" ry="4" fill="${i % 2 ? '#e08a2e' : '#d9642c'}" transform="rotate(${i * 37} ${x} ${y})"/>`;
  });
  return scene({ bg: 'day' }, o + prop('owl', 200, 196, 1.2));
}

function nestScene(v, have) {
  let o = prop('nest', 296, 206, 2.6) + prop('owl', 372, 200, 0.9);
  for (let i = 0; i < v.c; i++) {
    const x = 24 + (i % 4) * 54, y = 146 + Math.floor(i / 4) * 20;
    o += i < have
      ? `<rect x="${x}" y="${y}" width="46" height="10" rx="5" fill="#7a4e2c"/>`
      : `<rect x="${x}" y="${y}" width="46" height="10" rx="5" fill="#fff" fill-opacity=".5" stroke="#7a4e2c" stroke-width="1.5" stroke-dasharray="4 3"/>`;
  }
  return scene({ bg: 'day' }, o);
}

const oldestOak = {
  id: 'oak',
  title: 'The Oldest Oak',
  grown: 'Go outside with a grown-up and look for a stump or a cut log. Can you count its rings?',
  cover: () => scene({ bg: 'day', props: [['oak', 200, 182, 2], ['owl', 236, 74, 0.9]] }),
  init() {},
  pages: {
    start: {
      scene: () => scene({ bg: 'day', props: [['cloud', 300, 50, 1.2], ['fallenoak', 190, 190, 1.6], ['owl', 340, 190, 1.1]] }),
      text: () => 'Last night a big storm came. The old oak tree fell down. It was the home of Hoot the owl!',
      next: 'rings',
    },
    rings: {
      type: 'rings',
      setup(v, lvl) { v.age = randInt(LV(lvl, [4, 5, 6, 7, 8]), LV(lvl, [6, 8, 10, 12, 14])); },
      text: () => 'Look at the stump. Each ring is one year of growing. Tap each ring to count them.',
      doneText: v => `${v.age} rings! The oak was ${v.age} years old.`,
      next: 'fork',
    },
    fork: {
      type: 'choices',
      scene: () => scene({ bg: 'day', props: [['pine', 80, 180, 1.5], ['barn', 316, 182, 1.1], ['owl', 196, 200, 1]] }),
      text: () => 'Hoot needs a new home. Where should she look?',
      choices: [
        { label: 'In the tall pine tree', icon: 'pine', to: 'pine' },
        { label: 'In the old barn', icon: 'barn', to: 'barn' },
      ],
    },
    pine: {
      type: 'math',
      setup(v, lvl) {
        v.home = 'pine';
        v.a = randInt(LV(lvl, [3, 4, 5, 6, 7]), LV(lvl, [5, 7, 8, 10, 10]));
        v.b = randInt(1, v.a - 1);
        v.thin = shuffle([...Array(v.a).keys()]).slice(0, v.b);
      },
      scene: v => pineBranches(v),
      text: v => `Hoot looks at a tall pine tree. It has ${v.a} branches. ${v.b} of them ${v.b === 1 ? 'is' : 'are'} too thin to hold a nest. How many branches are strong?`,
      answer: v => v.a - v.b,
      frames: v => ({ type: 'leave', a: v.a, b: v.b }),
      next: 'season',
    },
    barn: {
      type: 'math',
      setup(v, lvl) { v.home = 'barn'; const S = LV(lvl, [5, 7, 9, 10, 12]); v.a = randInt(1, Math.min(7, S - 1)); v.b = randInt(1, Math.min(6, S - v.a)); },
      scene: v => barnInside(v),
      text: v => `Hoot peeks in the barn window. The barn is full of hens! ${s(v.a, 'hen sleeps', 'hens sleep')} on the low beam. ${s(v.b, 'hen sleeps', 'hens sleep')} on the high beam. How many hens are in the barn?`,
      answer: v => v.a + v.b,
      frames: v => ({ type: 'join', a: v.a, b: v.b }),
      next: 'season',
    },
    season: {
      type: 'pick',
      scene: () => fallScene(),
      text: () => 'The leaves are turning orange and falling down. It is fall. Hoot must build her nest before the next season. What season comes after fall?',
      options: () => shuffle(['winter', 'spring', 'summer']).map(k => ({ key: k, icon: seasonIcon(k), label: k[0].toUpperCase() + k.slice(1) })),
      correct: () => 'winter',
      doneText: () => 'Yes! Winter is coming. Time to build.',
      next: 'nest',
    },
    nest: {
      type: 'math',
      setup(v, lvl) { v.c = randInt(LV(lvl, [3, 4, 5, 6, 8]), LV(lvl, [5, 7, 9, 10, 12])); v.h = randInt(1, v.c - 1); },
      scene: (v, done) => nestScene(v, done ? v.c : v.h),
      text: v => `A good nest needs ${v.c} sticks. Hoot has ${v.h}. How many more sticks does she need?`,
      answer: v => v.c - v.h,
      frames: v => ({ type: 'part', a: v.h, c: v.c }),
      next: 'end',
    },
    end: {
      scene: v => scene({ bg: 'day' }, prop('stump', 80, 198, 1.4) + prop('acorn', 130, 200, 1.3)
        + (v.home === 'barn'
          ? prop('barn', 290, 196, 1.7) + prop('owl', 290, 112, 0.5)
          : prop('pine', 290, 198, 2.2) + prop('nest', 318, 120, 1.1) + prop('owl', 318, 114, 0.7))),
      text: v => `Hoot has a new home in the ${v.home === 'barn' ? 'barn' : 'pine tree'}! The old oak was ${v.age} years old. You plant an acorn by its stump. One day it will grow rings of its own.`,
      end: true,
    },
  },
};

/* ================= Who Took the Pie? ================= */

export const SUSPECTS = [
  { id: 'fox', name: 'Pip', prop: 'fox', clue: 'The pie taker has no bushy tail.' },
  { id: 'hen', name: 'Hen', prop: 'hen', clue: 'The pie taker has no feathers.' },
  { id: 'goat', name: 'Gus', prop: 'goat', clue: 'The pie taker has no horns.' },
  { id: 'mole', name: 'Mo', prop: 'mole', clue: 'The pie taker has no pink nose.' },
];

const FOUR = prop('fox', 58, 206, 0.95) + prop('hen', 140, 208, 1.05) + prop('goat', 268, 208, 0.95, true) + prop('mole', 346, 208, 1.1, true);

function pieTop(v, culprit) {
  const cx = 190, cy = 110, r = 70;
  let o = `<rect width="400" height="220" fill="#e6d5b3"/><circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="#fbf7ee" stroke="#cdbb97" stroke-width="3"/>`;
  for (let i = 0; i < v.c; i++) {
    const a0 = (i / v.c) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / v.c) * Math.PI * 2 - Math.PI / 2;
    const p = (a, rr) => `${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
    if (i < v.left) {
      o += `<path d="M${cx} ${cy} L${p(a0, r)} A${r} ${r} 0 0 1 ${p(a1, r)} Z" fill="#e2a65a" stroke="#9a5a2a" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M${p(a0 + 0.06, r - 5)} A${r - 5} ${r - 5} 0 0 1 ${p(a1 - 0.06, r - 5)}" stroke="#c9853f" stroke-width="7" fill="none"/>`;
    } else {
      const am = (a0 + a1) / 2;
      o += `<circle cx="${cx + Math.cos(am) * 40}" cy="${cy + Math.sin(am) * 40}" r="2.5" fill="#c9853f"/><circle cx="${cx + Math.cos(am + 0.2) * 52}" cy="${cy + Math.sin(am + 0.2) * 52}" r="1.8" fill="#c9853f"/>`;
    }
  }
  return wrap(o + prop(culprit, 340, 200, 1.2, true));
}

const pie = {
  id: 'pie',
  title: 'Who Took the Pie?',
  grown: 'Make up a riddle about an animal and ask a grown-up to guess the answer.',
  cover: () => scene({ bg: 'day', props: [['window', 200, 164, 2.2], ['pie', 200, 156, 1.6]] }),
  init() {},
  pages: {
    start: {
      scene: () => scene({ bg: 'day', props: [['window', 200, 164, 2.2], ['pie', 200, 156, 1.6], ['cloud', 60, 44, 1]] }),
      text: () => 'A fresh pie sits by the window to cool.',
      next: 'gone',
    },
    gone: {
      scene: () => scene({ bg: 'day', props: [['window', 200, 164, 2.2], ['crumbs', 196, 158, 1.8], ['cloud', 330, 44, 1]] }),
      text: () => 'Later, the pie is gone! Only crumbs are left. Who took it?',
      next: 'suspects',
    },
    suspects: {
      scene: () => scene({ bg: 'day', props: [['window', 200, 140, 1.5], ['crumbs', 198, 136, 1.2]] }, FOUR),
      text: () => 'Four friends were near the window: Pip the fox, Hen, Gus the goat, and Mo the mole. Read the clues to find the pie taker.',
      button: 'Find the clues',
      next: 'mystery',
    },
    mystery: { type: 'mystery', next: 'slices' },
    slices: {
      type: 'math',
      setup(v, lvl) { const sizes = LV(lvl, [[4], [4, 6], [6], [6, 8], [8]]); v.c = sizes[randInt(0, sizes.length - 1)]; v.left = randInt(1, v.c - 1); },
      scene: v => pieTop(v, v.culpritProp),
      text: v => `${v.culprit} still has the pie! It had ${v.c} slices. Now ${s(v.left, 'slice is', 'slices are')} left. How many slices did ${v.culprit} eat?`,
      answer: v => v.c - v.left,
      frames: v => ({ type: 'leave', a: v.c, b: v.c - v.left }),
      next: 'end',
    },
    end: {
      scene: () => scene({ bg: 'day', props: [['window', 200, 140, 1.5], ['pie', 200, 135, 1.2]] }, FOUR),
      text: v => `${v.culprit} says sorry and helps bake a new pie. Now a new pie sits by the window, and every friend gets a slice!`,
      end: true,
    },
  },
};

export const STORIES = [beaverBridge, lostLantern, oldestOak, pie];
