// Fish, lure, and water drawings for Fishing Hole. All built from shapes in code.
import { seededRandom } from './ui.js';

let uid = 0;
const nid = (p) => `${p}${++uid}`;

/* ---------------- Fish ---------------- */

export function fishSVG(fish, cls = '') {
  const L = fish.look;
  if (L.flat) return flounderSVG(fish, cls);
  const id = nid('f');
  const rnd = seededRandom(fish.id);
  const short = L.short;
  const hx = L.snout ? 8 : 14;
  const tx = short ? 138 : 150;
  const h = Math.min(31, (L.depth * 100) / 2 * (short ? 1 : 1));
  const top = 50 - h, bot = 50 + h;
  const headY = L.blunt ? h * 1.05 : L.snout ? h * 0.35 : h * 0.62;

  const body = `M ${hx} 50 C ${hx} ${50 - headY}, ${hx + (L.blunt ? 10 : 26)} ${top}, ${hx + 58} ${top}
    C ${tx - 30} ${top}, ${tx - 10} ${50 - h * 0.4}, ${tx} ${50 - h * 0.3}
    L ${tx} ${50 + h * 0.3}
    C ${tx - 10} ${50 + h * 0.4}, ${tx - 30} ${bot}, ${hx + 58} ${bot}
    C ${hx + (L.blunt ? 10 : 26)} ${bot}, ${hx} ${50 + headY * 0.9}, ${hx} 50 Z`;

  const th = Math.max(h, 16);
  const tails = {
    square: `M ${tx - 3} ${50 - h * 0.3} L ${tx + 28} ${50 - th * 0.95} Q ${tx + 22} 50 ${tx + 28} ${50 + th * 0.95} L ${tx - 3} ${50 + h * 0.3} Z`,
    fork: `M ${tx - 3} ${50 - h * 0.28} L ${tx + 34} ${50 - th * 1.05} L ${tx + 17} 50 L ${tx + 34} ${50 + th * 1.05} L ${tx - 3} ${50 + h * 0.28} Z`,
    deepfork: `M ${tx - 3} ${50 - h * 0.22} Q ${tx + 18} ${50 - th * 0.5} ${tx + 38} ${50 - th * 1.25} Q ${tx + 18} 50 ${tx + 38} ${50 + th * 1.25} Q ${tx + 18} ${50 + th * 0.5} ${tx - 3} ${50 + h * 0.22} Z`,
  };
  const tail = tails[L.tail || 'square'];

  let fins = '';
  if (L.longDorsal) {
    fins += `<path d="M ${hx + 14} ${top + 4} Q ${hx + 20} ${top - 12} ${hx + 40} ${top - 10} L ${tx - 8} ${50 - h * 0.45} L ${tx - 14} ${top + 8} Z" fill="${L.fin}"/>`;
  } else {
    const d0 = hx + (short ? 40 : 46);
    fins += `<path d="M ${d0} ${top + 3} Q ${d0 + 12} ${top - h * 0.75} ${d0 + 30} ${top - h * 0.5} Q ${d0 + 48} ${top - h * 0.7} ${d0 + 66} ${top + 4} Z" fill="${L.fin}" opacity=".95"/>`;
    for (let i = 0; i < 4; i++) fins += `<line x1="${d0 + 8 + i * 9}" y1="${top + 2}" x2="${d0 + 10 + i * 9}" y2="${top - h * 0.55}" stroke="${shade(L.fin, -30)}" stroke-width="1" opacity=".6"/>`;
  }
  fins += `<path d="M ${tx - 44} ${bot - 3} Q ${tx - 34} ${bot + h * 0.5} ${tx - 16} ${bot - 4} Z" fill="${L.fin}"/>`;
  fins += `<path d="M ${hx + 50} ${bot - 2} Q ${hx + 56} ${bot + h * 0.35} ${hx + 66} ${bot - 2} Z" fill="${L.fin}"/>`;
  if (L.pattern.includes('finlets')) {
    for (let i = 0; i < 5; i++) {
      const x = tx - 32 + i * 6;
      fins += `<path d="M ${x} ${50 - h * 0.62 + i * 1.6} l 4 -5 l 2 5 z" fill="${L.fin}"/><path d="M ${x} ${50 + h * 0.62 - i * 1.6} l 4 5 l 2 -5 z" fill="${L.fin}"/>`;
    }
  }

  // patterns, clipped to the body
  let pat = '';
  const dark = shade(L.back, -25);
  for (const p of L.pattern) {
    if (p === 'band') {
      let d = `M ${hx + 30} 48`;
      for (let x = hx + 30; x <= tx; x += 8) d += ` L ${x} ${47 - h * 0.18 - rnd() * h * 0.18}`;
      for (let x = tx; x >= hx + 30; x -= 8) d += ` L ${x} ${53 + h * 0.1 + rnd() * h * 0.16}`;
      pat += `<path d="${d} Z" fill="${dark}" opacity=".7"/>`;
    }
    if (p === 'vbars') for (let x = hx + 38; x < tx - 6; x += 15) pat += `<rect x="${x}" y="${top}" width="7" height="${h * 2}" rx="3" fill="${dark}" opacity=".42"/>`;
    if (p === 'hstripes') for (let i = -2; i <= 3; i++) pat += `<path d="M ${hx + 26} ${50 + i * h * 0.27} Q ${(hx + tx) / 2} ${50 + i * h * 0.27 - 2} ${tx + 2} ${50 + i * h * 0.22}" stroke="#2b3138" stroke-width="2.4" fill="none" opacity=".8"/>`;
    if (p === 'spotrows') for (let r = 0; r < 3; r++) for (let x = hx + 40; x < tx - 4; x += 7) pat += `<circle cx="${x + (r % 2) * 3}" cy="${50 + h * (0.22 + r * 0.18)}" r="1.4" fill="${dark}" opacity=".7"/>`;
    if (p === 'blotches') for (let i = 0; i < 16; i++) pat += `<ellipse cx="${hx + 28 + rnd() * (tx - hx - 30)}" cy="${top + 4 + rnd() * h * 1.5}" rx="${3 + rnd() * 4}" ry="${2 + rnd() * 3}" fill="${dark}" opacity=".55"/>`;
    if (p === 'dots') for (let i = 0; i < 26; i++) pat += `<circle cx="${hx + 26 + rnd() * (tx - hx - 20)}" cy="${top + 3 + rnd() * h * 1.25}" r="${1.1 + rnd() * 1}" fill="#1f2328" opacity=".75"/>`;
    if (p === 'pinkstripe') pat += `<path d="M ${hx + 22} 50 Q ${(hx + tx) / 2} 46 ${tx + 2} 50 Q ${(hx + tx) / 2} 58 ${hx + 22} 54 Z" fill="#e47a8c" opacity=".75"/>`;
    if (p === 'saddles') for (let x = hx + 40; x < tx - 10; x += 22) pat += `<path d="M ${x} ${top} Q ${x + 8} ${50 - h * 0.2} ${x + 16} ${top} Z" fill="${dark}" opacity=".55"/>`;
    if (p === 'scales') for (let r = -2; r <= 2; r++) for (let x = hx + 34; x < tx - 4; x += 9) pat += `<path d="M ${x + (r % 2) * 4} ${50 + r * h * 0.32 - 4} q 4 4 0 8" stroke="#fff" stroke-width="1" fill="none" opacity=".55"/>`;
  }

  let extra = '';
  if (L.pattern.includes('earflap')) extra += `<ellipse cx="${hx + 33}" cy="${50 - h * 0.12}" rx="5.5" ry="5" fill="#1b2230"/>`;
  if (L.pattern.includes('tailspot')) extra += `<circle cx="${tx - 12}" cy="${50 - h * 0.15}" r="5.5" fill="#15181c"/><circle cx="${tx - 12}" cy="${50 - h * 0.15}" r="6.6" fill="none" stroke="#f2d8b8" stroke-width="1"/>`;
  if (L.pattern.includes('barbels')) extra += `<path d="M ${hx + 4} 52 q -10 6 -12 18 M ${hx + 6} 53 q -4 8 0 18 M ${hx + 2} 48 q -10 -2 -14 -10" stroke="#3b4048" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;

  // gill, eye, mouth
  const gx = hx + 28;
  extra += `<path d="M ${gx} ${50 - h * 0.6} Q ${gx + 6} 50 ${gx} ${50 + h * 0.6}" stroke="${shade(L.side, -30)}" stroke-width="1.6" fill="none" opacity=".7"/>`;
  extra += `<ellipse cx="${hx + 42}" cy="${50 + h * 0.18}" rx="9" ry="4.5" transform="rotate(18 ${hx + 42} ${50 + h * 0.18})" fill="${L.fin}" opacity=".85"/>`;
  const er = L.bigEye ? 6.2 : short ? 4.6 : 4.2;
  const ex = hx + (L.snout ? 20 : 14), ey = 50 - h * (L.snout ? 0.25 : 0.32);
  extra += `<circle cx="${ex}" cy="${ey}" r="${er}" fill="${L.eye || '#d9b54a'}"/><circle cx="${ex - 0.6}" cy="${ey}" r="${er * 0.55}" fill="#111"/><circle cx="${ex - 1.8}" cy="${ey - 1.6}" r="${er * 0.22}" fill="#fff"/>`;
  const m = L.mouth;
  if (m === 'big') extra += `<path d="M ${hx - 1} 50 Q ${hx + 10} 57 ${hx + 25} 52" stroke="${shade(L.back, -45)}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M ${hx + 25} 52 q 2 -3 1 -6" stroke="${shade(L.back, -45)}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  else if (m === 'wide') extra += `<path d="M ${hx} 52 Q ${hx + 8} 55 ${hx + 14} 53" stroke="#2c3036" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  else if (m === 'up') extra += `<path d="M ${hx} 48 Q ${hx + 8} 53 ${hx + 18} 51" stroke="${shade(L.back, -40)}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  else extra += `<path d="M ${hx} 51 Q ${hx + 5} 53 ${hx + (m === 'small' ? 6 : 10)} 52" stroke="${shade(L.back, -40)}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  if (L.snout) extra += `<path d="M ${hx} 50 L ${hx + 30} 51" stroke="${shade(L.back, -40)}" stroke-width="1.6"/>`;

  return `<svg class="fish ${cls}" viewBox="0 -8 200 116" aria-label="${fish.name}">
    <defs>
      <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${L.back}"/><stop offset=".5" stop-color="${L.side}"/><stop offset="1" stop-color="${L.belly}"/></linearGradient>
      <clipPath id="${id}c"><path d="${body}"/></clipPath>
    </defs>
    <path d="${tail}" fill="${L.fin}"/>
    ${fins}
    <path d="${body}" fill="url(#${id}g)"/>
    <g clip-path="url(#${id}c)">${pat}</g>
    ${extra}
  </svg>`;
}

function flounderSVG(fish, cls) {
  const L = fish.look;
  const rnd = seededRandom(fish.id);
  let fringe = '';
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    if (Math.cos(a) > 0.85) continue;
    const x = 96 + Math.cos(a) * 74, y = 54 + Math.sin(a) * 34;
    fringe += `<circle cx="${x}" cy="${y}" r="5" fill="${L.fin}"/>`;
  }
  let blot = '';
  for (let i = 0; i < 14; i++) blot += `<ellipse cx="${50 + rnd() * 100}" cy="${36 + rnd() * 36}" rx="${3 + rnd() * 5}" ry="${2 + rnd() * 3}" fill="${shade(L.back, -30)}" opacity=".55"/>`;
  for (let i = 0; i < 8; i++) blot += `<circle cx="${50 + rnd() * 100}" cy="${36 + rnd() * 36}" r="2.4" fill="#f1e6d0" opacity=".7"/>`;
  return `<svg class="fish ${cls}" viewBox="0 -8 200 116" aria-label="${fish.name}">
    <path d="M 160 54 L 192 30 Q 184 54 192 78 Z" fill="${L.fin}"/>
    ${fringe}
    <ellipse cx="96" cy="54" rx="70" ry="32" fill="${L.side}"/>
    ${blot}
    <circle cx="44" cy="40" r="5" fill="#d9b54a"/><circle cx="43.5" cy="40" r="2.8" fill="#111"/>
    <circle cx="56" cy="34" r="5" fill="#d9b54a"/><circle cx="55.5" cy="34" r="2.8" fill="#111"/>
    <path d="M 30 56 Q 36 60 42 57" stroke="#4a3a28" stroke-width="2" fill="none"/>
  </svg>`;
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, v + amt));
  return '#' + [c(n >> 16), c((n >> 8) & 255), c(n & 255)].map(v => v.toString(16).padStart(2, '0')).join('');
}

/* ---------------- Lures ---------------- */

function hooks(points) {
  return points.map(([x, y]) => `<g stroke="#5a5f66" stroke-width="2" fill="none" stroke-linecap="round">
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y + 8}"/><path d="M ${x} ${y + 8} q -7 8 -10 0"/><path d="M ${x} ${y + 8} q 7 8 10 0"/><path d="M ${x} ${y + 8} q 0 10 -5 9"/></g>`).join('');
}

export function lureSVG(baitId, cw, opts = {}) {
  const id = nid('l');
  const grad = `<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cw.back}"/><stop offset=".55" stop-color="${cw.base}"/><stop offset="1" stop-color="${cw.accent}"/></linearGradient>`;
  const flake = (x0, x1, y0, y1) => {
    if (!opts.flake) return '';
    const rnd = seededRandom(baitId + cw.id);
    let s = '';
    for (let i = 0; i < 26; i++) s += `<circle cx="${x0 + rnd() * (x1 - x0)}" cy="${y0 + rnd() * (y1 - y0)}" r="${0.8 + rnd()}" fill="#fff" opacity=".85"/>`;
    return s;
  };
  const stripes = (x0, x1, y0, y1) => cw.stripes ? Array.from({ length: 5 }, (_, i) => `<path d="M ${x0 + i * (x1 - x0) / 5 + 6} ${y0} l -4 ${y1 - y0}" stroke="#1d2a14" stroke-width="5" opacity=".75"/>`).join('') : '';
  const eye = (x, y, r = 5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f2d24a" stroke="#333" stroke-width="1"/><circle cx="${x}" cy="${y}" r="${r * 0.5}" fill="#111"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.2}" fill="#fff"/>`;
  let body = '';

  if (baitId === 'crank') {
    body = `<path d="M 44 54 L 14 74 Q 12 80 20 78 L 52 62 Z" fill="#dfeaf2" fill-opacity=".6" stroke="#9fb2c0" stroke-width="1.5"/>
      <ellipse cx="96" cy="50" rx="52" ry="23" fill="url(#${id}g)"/>
      <clipPath id="${id}c"><ellipse cx="96" cy="50" rx="52" ry="23"/></clipPath>
      <g clip-path="url(#${id}c)">${stripes(60, 150, 26, 74)}${flake(50, 145, 30, 72)}</g>
      ${eye(66, 44)}${hooks([[82, 72], [128, 70]])}
      <circle cx="40" cy="58" r="3" fill="none" stroke="#5a5f66" stroke-width="2"/>
      <path d="M 148 50 l 10 0" stroke="#5a5f66" stroke-width="2"/>`;
  } else if (baitId === 'spinner') {
    body = `<path d="M 24 50 L 120 18" stroke="#6a6f76" stroke-width="2.5" fill="none"/><path d="M 24 50 L 62 62" stroke="#6a6f76" stroke-width="2.5"/>
      <ellipse cx="132" cy="18" rx="22" ry="9" transform="rotate(-18 132 18)" fill="${cw.kind === 'bright' ? '#f2c94a' : '#d9dee3'}" stroke="#8a8f96" stroke-width="1.5"/>
      <ellipse cx="96" cy="28" rx="10" ry="5" transform="rotate(-18 96 28)" fill="#d9dee3" stroke="#8a8f96" stroke-width="1"/>
      ${Array.from({ length: 16 }, (_, i) => `<path d="M 70 62 Q 110 ${50 + i * 1.6} ${150 + (i % 3) * 6} ${44 + i * 2}" stroke="${i % 3 === 0 ? cw.accent : i % 3 === 1 ? cw.base : cw.back}" stroke-width="2.6" fill="none"/>`).join('')}
      <ellipse cx="66" cy="62" rx="12" ry="9" fill="url(#${id}g)"/>${eye(60, 59, 3.5)}${flake(110, 160, 46, 76)}
      <path d="M 70 64 L 150 64 q 10 0 8 -12" stroke="#5a5f66" stroke-width="2.4" fill="none"/>`;
  } else if (baitId === 'worm') {
    body = `<path d="M 20 52 C 50 30, 70 70, 100 50 S 150 30, 178 56" stroke="url(#${id}g)" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="M 20 52 C 50 30, 70 70, 100 50 S 150 30, 178 56" stroke="${cw.back}" stroke-width="14" fill="none" stroke-linecap="round" opacity=".35"/>
      ${Array.from({ length: 6 }, (_, i) => `<line x1="${30 + i * 5}" y1="${44 + i}" x2="${32 + i * 5}" y2="${58 - i}" stroke="${cw.back}" stroke-width="1.5" opacity=".6"/>`).join('')}
      ${flake(24, 176, 36, 66)}
      <path d="M 178 56 q 14 8 6 18 q -6 6 -12 -2" stroke="${cw.base}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  } else if (baitId === 'jig') {
    body = `${Array.from({ length: 22 }, (_, i) => `<path d="M 66 50 Q 104 ${38 + i * 1.2} ${142 + (i % 4) * 5} ${32 + i * 2.4}" stroke="${i % 4 === 0 ? cw.accent : i % 2 ? cw.base : cw.back}" stroke-width="2.6" fill="none"/>`).join('')}
      <path d="M 148 44 q 22 -16 30 -6 q -8 8 -22 10 Z M 148 62 q 22 16 30 6 q -8 -8 -22 -10 Z" fill="${cw.base}" stroke="${cw.back}" stroke-width="1.5"/>
      <ellipse cx="54" cy="50" rx="18" ry="15" fill="url(#${id}g)"/>${eye(46, 46, 4)}${flake(40, 150, 36, 66)}
      <circle cx="56" cy="32" r="4" fill="none" stroke="#5a5f66" stroke-width="2"/>
      <path d="M 70 46 L 130 40 q 12 -2 10 -14" stroke="#5a5f66" stroke-width="2.4" fill="none"/>`;
  } else if (baitId === 'popper') {
    body = `${Array.from({ length: 10 }, (_, i) => `<path d="M 142 50 Q 160 ${44 + i * 1.4} ${182} ${38 + i * 2.6}" stroke="${i % 2 ? cw.accent : '#fff'}" stroke-width="2" fill="none"/>`).join('')}
      <path d="M 40 30 Q 100 24 146 42 Q 152 50 146 58 Q 100 76 40 70 Z" fill="url(#${id}g)"/>
      <clipPath id="${id}c"><path d="M 40 30 Q 100 24 146 42 Q 152 50 146 58 Q 100 76 40 70 Z"/></clipPath>
      <g clip-path="url(#${id}c)">${stripes(60, 140, 26, 74)}${flake(44, 140, 30, 70)}</g>
      <ellipse cx="42" cy="50" rx="7" ry="20" fill="${cw.back}"/><ellipse cx="44" cy="50" rx="4" ry="15" fill="#2a2a2a" opacity=".5"/>
      ${eye(62, 42, 5)}${hooks([[80, 70], [126, 64]])}`;
  } else if (baitId === 'swimbait') {
    body = `<path d="M 30 50 C 34 30, 80 28, 120 38 C 140 42, 150 46, 158 48 L 158 52 C 150 54, 140 58, 120 62 C 80 72, 34 70, 30 50 Z" fill="url(#${id}g)"/>
      <clipPath id="${id}c"><path d="M 30 50 C 34 30, 80 28, 120 38 C 140 42, 150 46, 158 48 L 158 52 C 150 54, 140 58, 120 62 C 80 72, 34 70, 30 50 Z"/></clipPath>
      <g clip-path="url(#${id}c)">${stripes(60, 150, 30, 70)}${flake(36, 150, 32, 68)}</g>
      <ellipse cx="170" cy="50" rx="7" ry="16" fill="${cw.base}" stroke="${cw.back}" stroke-width="2"/><path d="M 156 50 L 166 50" stroke="${cw.back}" stroke-width="4"/>
      <path d="M 30 50 C 30 38, 44 34, 54 36 L 54 64 C 44 66, 30 62, 30 50 Z" fill="#7d838a"/>${eye(42, 46, 4.5)}
      <path d="M 56 36 L 66 30 L 92 30 q 6 0 6 6" stroke="#5a5f66" stroke-width="2.4" fill="none"/>`;
  } else if (baitId === 'spoon') {
    body = `<defs><linearGradient id="${id}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".5" stop-color="#aab2ba"/><stop offset="1" stop-color="#e2e6ea"/></linearGradient></defs>
      <path d="M 30 50 C 40 26, 110 22, 150 40 C 162 46, 162 54, 150 60 C 110 78, 40 74, 30 50 Z" fill="url(#${id}m)" stroke="#8a8f96" stroke-width="2"/>
      <path d="M 44 46 C 60 30, 112 28, 146 44 C 150 48, 148 52, 140 52 C 110 50, 70 52, 44 56 Z" fill="url(#${id}g)" opacity=".85"/>
      <path d="M 50 44 C 80 32, 120 34, 146 46" stroke="#fff" stroke-width="3" opacity=".6" fill="none"/>
      ${stripes(60, 140, 30, 70)}${flake(40, 150, 34, 66)}
      <circle cx="38" cy="50" r="3.5" fill="none" stroke="#5a5f66" stroke-width="2"/>
      <circle cx="156" cy="50" r="3.5" fill="none" stroke="#5a5f66" stroke-width="2"/>${hooks([[164, 50]])}`;
  }
  return `<svg class="lure ${opts.cls || ''}" viewBox="0 10 200 80"><defs>${grad}</defs>${body}</svg>`;
}

/* ---------------- Water scenes ---------------- */

export function waterSVG(waterId, opts = {}) {
  const id = nid('w');
  const parts = [];
  const sky = `<rect width="400" height="60" fill="#cfe8f2"/>`;
  if (waterId === 'pond') {
    parts.push(sky, `<path d="M0 40 Q60 22 120 36 L120 60 L0 60 Z" fill="#7fb05a"/><path d="M280 38 Q340 20 400 34 L400 60 L280 60 Z" fill="#7fb05a"/>`,
      `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6aa77a"/><stop offset="1" stop-color="#2f5a42"/></linearGradient></defs>`,
      `<rect y="48" width="400" height="192" fill="url(#${id})"/>`,
      `<path d="M0 218 Q100 206 200 216 Q300 226 400 212 V240 H0 Z" fill="#5a4630"/>`,
      ...[30, 60, 340, 370].map(x => `<path d="M${x} 222 q 6 -30 -2 -60 M${x + 8} 222 q -4 -24 4 -44" stroke="#3f7a3a" stroke-width="3" fill="none"/>`),
      ...[24, 34, 44].map((x, i) => `<line x1="${x}" y1="48" x2="${x + 2}" y2="${8 + i * 4}" stroke="#4f7a32" stroke-width="2.5"/><rect x="${x - 2}" y="${8 + i * 4}" width="7" height="16" rx="3" fill="#7a4e2c"/>`),
      `<ellipse cx="250" cy="50" rx="16" ry="4" fill="#4f9a3e"/><ellipse cx="300" cy="52" rx="12" ry="3" fill="#5aa848"/><ellipse cx="180" cy="51" rx="10" ry="3" fill="#4f9a3e"/>`);
  } else if (waterId === 'river') {
    parts.push(sky, `<path d="M0 44 Q100 30 200 40 T400 36 V60 H0 Z" fill="#6f9a4a"/>`,
      ...[40, 90, 330].map(x => `<rect x="${x - 3}" y="18" width="6" height="26" fill="#6b4426"/><circle cx="${x}" cy="16" r="14" fill="#4f8a3d"/>`),
      `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fa8c8"/><stop offset="1" stop-color="#2a5874"/></linearGradient></defs>`,
      `<rect y="48" width="400" height="192" fill="url(#${id})"/>`,
      ...Array.from({ length: 10 }, (_, i) => `<path d="M${(i * 83) % 400} ${70 + (i * 37) % 120} h 26" stroke="#fff" stroke-width="2" opacity=".35" stroke-linecap="round" class="current"/>`),
      `<path d="M0 222 Q200 210 400 222 V240 H0 Z" fill="#6b6458"/>`,
      ...[[40, 222, 18], [110, 226, 12], [180, 220, 22], [260, 226, 14], [340, 220, 20]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.55}" fill="#8a857a"/>`));
  } else if (waterId === 'lake') {
    parts.push(sky, `<path d="M0 46 Q80 26 160 40 Q240 52 320 34 Q370 26 400 38 V60 H0 Z" fill="#7a9a6a"/>`,
      `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f9ccc"/><stop offset="1" stop-color="#173f62"/></linearGradient></defs>`,
      `<rect y="48" width="400" height="192" fill="url(#${id})"/>`,
      `<rect x="300" y="40" width="100" height="6" fill="#8a5a33"/>`, ...[310, 340, 370].map(x => `<rect x="${x}" y="44" width="5" height="120" fill="#6b4426" opacity=".8"/>`),
      `<path d="M0 222 Q200 212 400 224 V240 H0 Z" fill="#3c4a3a"/>`,
      `<rect x="60" y="208" width="110" height="12" rx="6" fill="#5a3a22" transform="rotate(-6 115 214)"/>`,
      ...[200, 214, 226].map(x => `<path d="M${x} 224 q 8 -26 0 -46" stroke="#3f6a3a" stroke-width="3" fill="none"/>`));
  } else {
    parts.push(`<rect width="400" height="60" fill="#bfe3f6"/>`,
      `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38a3d4"/><stop offset="1" stop-color="#0d3f6e"/></linearGradient></defs>`,
      `<rect y="46" width="400" height="194" fill="url(#${id})"/>`,
      `<path d="M0 48 ${Array.from({ length: 20 }, (_, i) => `q 10 -6 20 0`).join(' ')}" stroke="#fff" stroke-width="2.5" fill="none" opacity=".8"/>`,
      ...[60, 150, 250, 330].map(x => `<path d="M${x} 50 L${x - 30} 200 L${x + 10} 200 Z" fill="#fff" opacity=".06"/>`),
      `<path d="M0 222 Q100 212 200 220 T400 216 V240 H0 Z" fill="#e2c88f"/>`,
      `<path d="M300 222 q -6 -20 6 -26 q 10 -4 8 10 q 12 -6 10 8 q -2 8 -6 8 Z" fill="#e8746a"/>`,
      `<path d="M330 224 q 4 -26 14 -30 M338 224 q 8 -14 18 -14" stroke="#f0a04a" stroke-width="5" fill="none" stroke-linecap="round"/>`,
      ...[40, 70, 210].map(x => `<path d="M${x} 224 q 8 -20 -2 -40 q -8 -14 2 -30" stroke="#3a8a5a" stroke-width="4" fill="none"/>`));
  }
  if (opts.haze) parts.push(`<rect y="48" width="400" height="192" fill="${opts.hazeColor || '#8a7350'}" opacity="${opts.haze}"/>`);
  return `<svg class="water" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">${parts.join('')}</svg>`;
}

export const ZONES = { top: [24, 36], mid: [38, 64], bottom: [62, 78], floor: [80, 84] };
