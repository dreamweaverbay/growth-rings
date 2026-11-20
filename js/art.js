// Scene art for Trail Tales. Flat shapes, drawn in code.
// Every prop is drawn with its bottom-center at (0,0), about 60 units tall at scale 1.

const P = {
  pine: () => `<rect x="-4" y="-14" width="8" height="14" fill="#6b4426"/>
    <path d="M0 -78 L22 -40 H12 L28 -14 H-28 L-12 -40 H-22 Z" fill="#3f7a46"/>
    <path d="M0 -78 L22 -40 H12 L28 -14 H0 Z" fill="#356a3c"/>`,
  oak: () => `<path d="M-5 0 L-4 -30 Q0 -34 4 -30 L5 0 Z" fill="#7a4e2c"/>
    <circle cx="-16" cy="-44" r="18" fill="#5e9a48"/><circle cx="14" cy="-46" r="20" fill="#5e9a48"/>
    <circle cx="0" cy="-62" r="20" fill="#6fae55"/><circle cx="18" cy="-40" r="13" fill="#4f8a3d"/>`,
  bush: () => `<ellipse cx="-12" cy="-12" rx="16" ry="13" fill="#4f8a3d"/><ellipse cx="10" cy="-14" rx="18" ry="15" fill="#5e9a48"/><ellipse cx="0" cy="-22" rx="13" ry="11" fill="#6fae55"/>`,
  rock: () => `<path d="M-22 0 Q-24 -16 -10 -22 Q4 -28 16 -18 Q26 -8 22 0 Z" fill="#9a9488"/><path d="M-10 -22 Q4 -28 16 -18 Q8 -14 -6 -16 Z" fill="#b5afa3"/>`,
  log: () => `<rect x="-30" y="-14" width="56" height="14" rx="7" fill="#8a5a33"/><ellipse cx="26" cy="-7" rx="6" ry="7" fill="#e2bd86"/><ellipse cx="26" cy="-7" rx="3" ry="3.5" fill="none" stroke="#a8743f" stroke-width="1"/><path d="M-22 -10 H10 M-18 -5 H18" stroke="#6b4426" stroke-width="1.4" stroke-linecap="round"/>`,
  hollowlog: () => `<rect x="-34" y="-20" width="62" height="20" rx="10" fill="#7a4e2c"/><ellipse cx="28" cy="-10" rx="8" ry="10" fill="#e2bd86"/><ellipse cx="28" cy="-10" rx="5" ry="7" fill="#3b2a1e"/>`,
  stump: () => `<path d="M-22 0 L-18 -18 H18 L22 0 Z" fill="#7a4e2c"/><ellipse cx="0" cy="-18" rx="18" ry="6" fill="#e2bd86"/><ellipse cx="0" cy="-18" rx="11" ry="3.6" fill="none" stroke="#a8743f" stroke-width="1"/><ellipse cx="0" cy="-18" rx="5" ry="1.6" fill="none" stroke="#a8743f" stroke-width="1"/>`,
  fallenoak: () => `<rect x="-60" y="-16" width="100" height="16" rx="8" fill="#7a4e2c"/><circle cx="48" cy="-22" r="16" fill="#5e9a48"/><circle cx="62" cy="-12" r="12" fill="#4f8a3d"/><ellipse cx="-60" cy="-8" rx="6" ry="8" fill="#e2bd86"/>`,
  barn: () => `<path d="M-40 0 V-46 L0 -70 L40 -46 V0 Z" fill="#b5483d"/><path d="M-40 -46 L0 -70 L40 -46" fill="none" stroke="#f3e6d0" stroke-width="4"/><rect x="-14" y="-32" width="28" height="32" fill="#8e352d"/><path d="M-14 -32 L14 0 M14 -32 L-14 0" stroke="#f3e6d0" stroke-width="2.5"/><rect x="-8" y="-56" width="16" height="10" fill="#f3e6d0"/>`,
  henhouse: () => `<path d="M-22 0 V-26 L0 -40 L22 -26 V0 Z" fill="#d9a35b"/><path d="M-25 -25 L0 -42 L25 -25" fill="none" stroke="#7a4e2c" stroke-width="4"/><rect x="-7" y="-16" width="14" height="16" rx="7" fill="#5b3a22"/><path d="M-14 0 L-22 10 M14 0 L22 10" stroke="#7a4e2c" stroke-width="3"/>`,
  house: () => `<rect x="-38" y="-44" width="76" height="44" fill="#f0e2c8"/><path d="M-44 -42 L0 -72 L44 -42 Z" fill="#7a4e2c"/><rect x="-26" y="-34" width="22" height="18" fill="#bfe3f2" stroke="#7a4e2c" stroke-width="3"/><path d="M-15 -34 V-16 M-26 -25 H-4" stroke="#7a4e2c" stroke-width="2"/><rect x="10" y="-30" width="16" height="30" fill="#8a5a33"/>`,
  bridge: () => `<path d="M-60 0 Q0 -26 60 0" fill="none" stroke="#8a5a33" stroke-width="7"/><path d="M-60 -14 Q0 -40 60 -14" fill="none" stroke="#a8743f" stroke-width="3"/>${[-44, -22, 0, 22, 44].map(x => `<line x1="${x}" y1="${-26 + Math.abs(x) * 0.33 - 1}" x2="${x}" y2="${-12 + Math.abs(x) * 0.25}" stroke="#a8743f" stroke-width="3"/>`).join('')}`,
  halfbridge: () => `<path d="M-60 0 Q-30 -16 -6 -20" fill="none" stroke="#8a5a33" stroke-width="7"/><path d="M60 0 Q36 -14 18 -19" fill="none" stroke="#8a5a33" stroke-width="7" stroke-dasharray="0"/><path d="M-60 -14 Q-30 -32 -6 -34" fill="none" stroke="#a8743f" stroke-width="3"/>`,
  fox: () => `<path d="M14 -10 Q34 -12 36 -26 Q28 -18 16 -20 Z" fill="#d9792f"/><path d="M36 -26 Q35 -21 31 -19 Q34 -24 36 -26z" fill="#fff4e6"/>
    <ellipse cx="0" cy="-14" rx="18" ry="11" fill="#e0843a"/><rect x="-12" y="-6" width="4" height="6" fill="#5b3a22"/><rect x="6" y="-6" width="4" height="6" fill="#5b3a22"/>
    <path d="M-14 -20 L-26 -30 L-24 -40 L-18 -34 L-10 -36 L-6 -26 Z" fill="#e0843a"/><path d="M-25 -31 L-35 -27 L-24 -23 Z" fill="#e0843a"/><path d="M-30 -25.5 L-24 -23 L-26 -27 Z" fill="#fff4e6"/><circle cx="-19" cy="-30" r="1.8" fill="#3b2a1e"/><circle cx="-34.5" cy="-27" r="1.8" fill="#3b2a1e"/>`,
  owl: () => `<ellipse cx="0" cy="-20" rx="14" ry="20" fill="#9a7552"/><ellipse cx="0" cy="-14" rx="9" ry="12" fill="#d9c2a0"/><path d="M-12 -36 L-8 -44 L-3 -37 M12 -36 L8 -44 L3 -37" fill="#9a7552"/>
    <circle cx="-5.5" cy="-30" r="5" fill="#fff8ea"/><circle cx="5.5" cy="-30" r="5" fill="#fff8ea"/><circle cx="-5.5" cy="-30" r="2.2" fill="#3b2a1e"/><circle cx="5.5" cy="-30" r="2.2" fill="#3b2a1e"/><path d="M-2 -25 L0 -21 L2 -25 Z" fill="#e3ad25"/>`,
  beaver: () => `<ellipse cx="22" cy="-6" rx="12" ry="5" fill="#5b3a22" transform="rotate(-10 22 -6)"/><ellipse cx="0" cy="-16" rx="17" ry="15" fill="#8a5a33"/><circle cx="-12" cy="-28" r="10" fill="#9a6a40"/><circle cx="-16" cy="-31" r="1.8" fill="#3b2a1e"/><rect x="-22" y="-25" width="5" height="5" rx="1" fill="#fff8ea"/><circle cx="-6" cy="-36" r="3" fill="#8a5a33"/>`,
  mole: () => `<ellipse cx="0" cy="-10" rx="16" ry="10" fill="#4a3b36"/><ellipse cx="-16" cy="-10" rx="6" ry="4" fill="#d98c8c"/><circle cx="-10" cy="-13" r="1.4" fill="#000"/><path d="M-6 -2 l-4 3 M2 -2 l-2 4" stroke="#d98c8c" stroke-width="2.5" stroke-linecap="round"/>`,
  hen: () => `<ellipse cx="0" cy="-14" rx="14" ry="12" fill="#f5efe4"/><path d="M10 -18 L22 -26 L18 -14 Z" fill="#e8dfcf"/><circle cx="-10" cy="-26" r="8" fill="#f5efe4"/><path d="M-12 -34 q2 -5 4 0 q2 -5 4 0" fill="#c9453a"/><path d="M-18 -26 L-22 -24 L-18 -22 Z" fill="#e3ad25"/><circle cx="-11" cy="-27" r="1.4" fill="#3b2a1e"/><path d="M-3 -2 V0 M3 -2 V0" stroke="#e3ad25" stroke-width="2.5"/>`,
  goat: () => `<ellipse cx="0" cy="-22" rx="20" ry="11" fill="#e8e2d6"/><rect x="-14" y="-14" width="4" height="14" fill="#cfc7b8"/><rect x="10" y="-14" width="4" height="14" fill="#cfc7b8"/><path d="M-16 -26 L-28 -38 L-22 -42 L-14 -32 Z" fill="#e8e2d6"/><path d="M-24 -40 q-4 -10 4 -12 M-20 -41 q0 -9 7 -9" stroke="#8a7563" stroke-width="2.5" fill="none"/><circle cx="-23" cy="-37" r="1.5" fill="#3b2a1e"/><path d="M-27 -32 l-2 5" stroke="#cfc7b8" stroke-width="3"/>`,
  frog: () => `<ellipse cx="0" cy="-7" rx="12" ry="7" fill="#5aa04a"/><circle cx="-6" cy="-13" r="4" fill="#5aa04a"/><circle cx="6" cy="-13" r="4" fill="#5aa04a"/><circle cx="-6" cy="-14" r="1.6" fill="#1e2a1a"/><circle cx="6" cy="-14" r="1.6" fill="#1e2a1a"/>`,
  fish: () => `<path d="M-14 -6 Q0 -16 12 -6 Q0 4 -14 -6 Z" fill="#e88b3a"/><path d="M12 -6 L20 -12 L20 0 Z" fill="#e88b3a"/><circle cx="-7" cy="-7" r="1.4" fill="#3b2a1e"/>`,
  lantern: (lit) => `${lit ? '<circle cx="0" cy="-16" r="22" fill="#ffd56a" opacity=".35"/>' : ''}<path d="M-6 -30 Q0 -38 6 -30" fill="none" stroke="#3b2a1e" stroke-width="2"/><rect x="-9" y="-30" width="18" height="4" rx="1" fill="#3b2a1e"/><rect x="-8" y="-26" width="16" height="22" rx="3" fill="${lit ? '#ffd56a' : '#b9a98c'}" stroke="#3b2a1e" stroke-width="2"/><rect x="-10" y="-4" width="20" height="4" rx="1" fill="#3b2a1e"/>`,
  moon: () => `<circle cx="0" cy="-20" r="16" fill="#f5edd0"/><circle cx="7" cy="-25" r="14" fill="var(--sky-moon, #1f2a4a)"/>`,
  sun: () => `<circle cx="0" cy="-20" r="16" fill="#f7c64c"/>`,
  pie: () => `<path d="M-20 -6 Q0 -22 20 -6 Z" fill="#e2a65a"/><rect x="-22" y="-7" width="44" height="7" rx="3" fill="#c9853f"/><path d="M-10 -12 l4 -2 M2 -15 l4 -1 M10 -10 l3 -2" stroke="#9a4a2f" stroke-width="2" stroke-linecap="round"/>`,
  crumbs: () => `<circle cx="-8" cy="-2" r="2" fill="#c9853f"/><circle cx="2" cy="-1.5" r="1.6" fill="#c9853f"/><circle cx="10" cy="-2.5" r="2.2" fill="#c9853f"/><circle cx="16" cy="-1" r="1.4" fill="#c9853f"/>`,
  acorn: () => `<ellipse cx="0" cy="-8" rx="6" ry="8" fill="#a8672e"/><path d="M-7 -12 Q0 -20 7 -12 Z" fill="#6b3f1a"/><line x1="0" y1="-18" x2="1" y2="-21" stroke="#6b3f1a" stroke-width="2"/>`,
  sapling: () => `<path d="M0 0 V-18" stroke="#6b4426" stroke-width="2.5"/><path d="M0 -12 Q-10 -16 -12 -24 Q-2 -22 0 -14 Z" fill="#6fae55"/><path d="M0 -16 Q10 -20 12 -28 Q2 -26 0 -18 Z" fill="#5e9a48"/>`,
  nest: () => `<path d="M-18 -6 Q0 6 18 -6 Q14 -12 0 -12 Q-14 -12 -18 -6 Z" fill="#a8743f"/><path d="M-16 -8 Q0 -2 16 -8 M-12 -4 Q0 2 12 -4" stroke="#7a4e2c" stroke-width="1.5" fill="none"/>`,
  sticks: () => `<path d="M-16 0 L14 -6 M-12 -4 L18 -2 M-18 -6 L10 -10" stroke="#7a4e2c" stroke-width="3" stroke-linecap="round"/>`,
  logpile: () => `<rect x="-26" y="-10" width="52" height="10" rx="5" fill="#8a5a33"/><rect x="-22" y="-20" width="44" height="10" rx="5" fill="#9a6a40"/><rect x="-14" y="-30" width="28" height="10" rx="5" fill="#8a5a33"/>`,
  cloud: () => `<ellipse cx="0" cy="-10" rx="22" ry="10" fill="#fff"/><ellipse cx="-12" cy="-14" rx="12" ry="9" fill="#fff"/><ellipse cx="10" cy="-18" rx="14" ry="11" fill="#fff"/>`,
  cave: () => `<path d="M-50 0 Q-46 -60 0 -64 Q46 -60 50 0 Z" fill="#8a8478"/><path d="M-22 0 Q-20 -34 0 -36 Q20 -34 22 0 Z" fill="#2e2a26"/>`,
  window: () => `<rect x="-24" y="-40" width="48" height="40" fill="#bfe3f2" stroke="#7a4e2c" stroke-width="4"/><path d="M0 -40 V0 M-24 -20 H24" stroke="#7a4e2c" stroke-width="3"/><rect x="-30" y="-2" width="60" height="6" fill="#7a4e2c"/>`,
  sign: (txt = '') => `<rect x="-2" y="-30" width="4" height="30" fill="#7a4e2c"/><rect x="-22" y="-44" width="44" height="18" rx="3" fill="#d9a35b" stroke="#7a4e2c" stroke-width="2"/>`,
};

export const PROPS = Object.keys(P);

export function prop(name, x, y, s = 1, flip = false, extra = '') {
  const fn = P[name];
  if (!fn) return '';
  const body = fn(extra);
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">${body}</g>`;
}

const SKIES = {
  day: { top: '#bfe3f2', bottom: '#eaf5ef', ground: '#93c06d', ground2: '#82b05e', hill: '#b4d695', water: '#6fb3d9' },
  dusk: { top: '#f0a46d', bottom: '#f5d6a3', ground: '#7c9a5a', ground2: '#6b8a4c', hill: '#9bb47a', water: '#5d8fb0' },
  night: { top: '#1c2646', bottom: '#33406b', ground: '#2f4a3a', ground2: '#263f31', hill: '#3a5646', water: '#2b5677' },
};

export function scene(spec, inner = '') {
  const sk = SKIES[spec.bg || 'day'];
  const id = 'g' + Math.random().toString(36).slice(2, 8);
  let s = `<svg class="scene" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sk.top}"/><stop offset="1" stop-color="${sk.bottom}"/></linearGradient></defs>
    <rect width="400" height="220" fill="url(#${id})"/>`;
  if (spec.bg === 'night') {
    for (let i = 0; i < 30; i++) {
      const h1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1, h2 = Math.abs(Math.sin(i * 78.233) * 12345.678) % 1;
      const x = h1 * 400, y = h2 * 110 + 6;
      s += `<circle cx="${x}" cy="${y}" r="${i % 3 ? 0.9 : 1.5}" fill="#fff" opacity="${i % 2 ? 0.6 : 0.9}"/>`;
    }
  }
  if (spec.hills !== false) {
    s += `<path d="M0 150 Q70 110 150 140 Q230 165 300 128 Q360 100 400 130 V220 H0 Z" fill="${sk.hill}"/>`;
  }
  s += `<path d="M0 160 Q100 150 200 158 Q300 166 400 156 V220 H0 Z" fill="${sk.ground}"/>`;
  s += `<path d="M0 196 Q120 188 220 196 Q320 204 400 194 V220 H0 Z" fill="${sk.ground2}"/>`;
  if (spec.creek) {
    s += `<path d="M0 176 Q100 168 200 176 Q300 184 400 174 V194 Q300 204 200 194 Q100 186 0 196 Z" fill="${sk.water}"/>
      <path d="M40 184 h18 M150 188 h24 M270 186 h16 M340 182 h20" stroke="#fff" stroke-width="2" opacity=".5" stroke-linecap="round"/>`;
  }
  (spec.props || []).forEach(p => {
    const [name, x, y, sc = 1, flip = false, extra] = p;
    if (name === 'moon') s += `<g style="--sky-moon:${sk.top}">${prop(name, x, y, sc, flip, extra)}</g>`;
    else s += prop(name, x, y, sc, flip, extra);
  });
  s += inner;
  s += '</svg>';
  return s;
}

// Small standalone icon of a prop for answer buttons.
export function propIcon(name, extra) {
  const boxes = {
    hollowlog: '-38 -30 76 34', bush: '-32 -38 64 40', oak: '-40 -86 80 88', pine: '-32 -82 64 84', henhouse: '-28 -46 56 58',
    barn: '-44 -74 88 76', cave: '-54 -68 108 70', rock: '-26 -30 52 32', fox: '-38 -44 78 46', owl: '-18 -48 36 50',
    beaver: '-28 -44 64 46', mole: '-24 -26 48 28', hen: '-26 -40 50 42', goat: '-32 -56 56 58', frog: '-14 -18 28 20',
    stump: '-24 -26 48 28', nest: '-20 -14 40 20', fish: '-16 -16 38 20', acorn: '-9 -23 18 25', sapling: '-14 -30 28 32',
    pie: '-24 -24 48 26', lantern: '-24 -40 48 42',
  };
  const vb = boxes[name] || '-40 -60 80 62';
  return `<svg viewBox="${vb}">${P[name] ? P[name](extra) : ''}</svg>`;
}

export function stoneIcon(kind) {
  const shapes = {
    round: '<circle cx="0" cy="0" r="14" fill="#9a9488"/><circle cx="-4" cy="-5" r="4" fill="#b5afa3"/>',
    flat: '<ellipse cx="0" cy="0" rx="18" ry="8" fill="#b38b5d"/><ellipse cx="-5" cy="-3" rx="6" ry="2" fill="#cfa877"/>',
    pebble: '<circle cx="0" cy="0" r="7" fill="#6f6a62"/>',
    leaf: '<path d="M-12 8 C-12 -4 -2 -12 12 -12 C12 2 2 10 -12 8 Z" fill="#5f8f3e"/>',
  };
  return `<svg viewBox="-20 -20 40 40">${shapes[kind]}</svg>`;
}

export function seasonIcon(season) {
  const s = {
    spring: '<path d="M0 14 V-2" stroke="#4f8a3d" stroke-width="2.5"/><circle cx="0" cy="-8" r="5" fill="#f2c14e"/>' + [0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-15" rx="4" ry="6" fill="#f4a3b8" transform="rotate(${a} 0 -8)"/>`).join('') + '<circle cx="0" cy="-8" r="4" fill="#f2c14e"/>',
    summer: '<circle cx="0" cy="0" r="9" fill="#f2b33d"/>' + [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="0" y1="-13" x2="0" y2="-17" stroke="#f2b33d" stroke-width="3" stroke-linecap="round" transform="rotate(${a})"/>`).join(''),
    fall: '<path d="M0 -16 L4 -6 L14 -8 L8 0 L14 8 L4 6 L0 16 L-4 6 L-14 8 L-8 0 L-14 -8 L-4 -6 Z" fill="#d9792f"/><path d="M0 -10 V16" stroke="#8e4a1c" stroke-width="1.5"/>',
    winter: [0, 60, 120].map(a => `<line x1="0" y1="-15" x2="0" y2="15" stroke="#6aa8d8" stroke-width="3" stroke-linecap="round" transform="rotate(${a})"/>`).join('') + '<circle r="3" fill="#6aa8d8"/>',
  };
  return `<svg viewBox="-20 -20 40 40">${s[season]}</svg>`;
}
