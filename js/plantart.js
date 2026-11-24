// Plant drawings for Leaf Lab. Every plant is drawn from the same few numbers the words use
// (leaf size, root depth, how much it has grown), so the picture always matches the result.
//
// A plant is drawn around its own origin: (0, 0) is where the stem meets the ground,
// up is negative y. Scenes place it with a translate.

const r1 = (n) => Math.round(n * 10) / 10;
const LEAF_LEN = [0, 15, 23, 33]; // small, medium, big

// One leaf attached at (x, y). side: 1 points right, -1 points left. up: degrees above flat.
function leafAt(x, y, side, len, o = {}) {
  const tilt = o.wilt ? -55 : (o.up == null ? 22 : o.up);
  const ang = side > 0 ? -tilt : 180 + tilt;
  const w = len * (o.round ? 0.5 : 0.33);
  const fill = o.wilt ? '#bdb856' : o.glow ? '#8ddc63' : (o.fill || '#5fae45');
  const edge = o.wilt ? '#8f8a35' : '#3f8a32';
  return `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(ang)})"><path class="${o.cls || ''}" d="M0 0 C ${r1(len * 0.2)} ${r1(-w)}, ${r1(len * 0.75)} ${r1(-w)}, ${r1(len)} 0 C ${r1(len * 0.75)} ${r1(w)}, ${r1(len * 0.2)} ${r1(w)}, 0 0 Z" fill="${fill}" stroke="${edge}" stroke-width="1.2"/><path d="M1 0 L ${r1(len * 0.9)} 0" stroke="${edge}" stroke-width="1" opacity=".65"/></g>`;
}

// Roots: shallow ones spread wide near the top, deep ones go far down.
export function rootsSVG(kind, g = 1) {
  const k = 0.55 + 0.45 * g;
  const st = 'fill="none" stroke="#b08450" stroke-linecap="round"';
  if (kind === 'deep') {
    const d = 82 * k;
    return `<g ${st}><path d="M0 0 Q 4 ${r1(d * 0.5)} 0 ${r1(d)}" stroke-width="3.2"/>
      <path d="M1 ${r1(d * 0.25)} q 12 4 20 12" stroke-width="2"/><path d="M1 ${r1(d * 0.3)} q -12 5 -18 14" stroke-width="2"/>
      <path d="M2 ${r1(d * 0.55)} q 10 5 16 13" stroke-width="1.8"/><path d="M1 ${r1(d * 0.6)} q -10 5 -15 12" stroke-width="1.8"/>
      <path d="M1 ${r1(d * 0.82)} q 8 4 11 10" stroke-width="1.5"/><path d="M0 ${r1(d * 0.85)} q -8 4 -10 9" stroke-width="1.5"/></g>`;
  }
  const s = 58 * k;
  return `<g ${st}><path d="M0 0 Q ${r1(s * 0.4)} 6 ${r1(s)} 20" stroke-width="2.6"/><path d="M0 0 Q ${r1(-s * 0.4)} 6 ${r1(-s)} 21" stroke-width="2.6"/>
    <path d="M0 0 Q ${r1(s * 0.2)} 12 ${r1(s * 0.55)} 27" stroke-width="2.2"/><path d="M0 0 Q ${r1(-s * 0.2)} 12 ${r1(-s * 0.5)} 28" stroke-width="2.2"/>
    <path d="M0 0 Q 3 14 2 26" stroke-width="2"/></g>`;
}

const pumpkinParts = (R) => `<path d="M0 ${r1(-R * 0.8)} q 2 -8 8 -9" stroke="#5c7a2e" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  <ellipse rx="${r1(R * 1.2)}" ry="${r1(R * 0.88)}" fill="#ef8a22"/><ellipse rx="${r1(R * 0.72)}" ry="${r1(R * 0.88)}" fill="#f59a33"/><ellipse rx="${r1(R * 0.28)}" ry="${r1(R * 0.88)}" fill="#f7a94a"/>
  <ellipse rx="${r1(R * 1.2)}" ry="${r1(R * 0.88)}" fill="none" stroke="#c96a12" stroke-width="1.4"/>`;
// Just the pumpkin, in a box that never changes, so a heavier pumpkin looks bigger.
export const pumpkinSVG = (R) => `<svg viewBox="-38 -40 76 68">${pumpkinParts(R)}</svg>`;

const tomatoSpots = (() => {
  // 30 fixed places on the bush, low branches first, so "12 tomatoes" always draws the same 12.
  const out = [];
  let a = 0.6;
  for (let i = 0; i < 30; i++) {
    a += 2.39996;
    const ring = 0.35 + 0.65 * Math.sqrt((i + 0.5) / 30);
    out.push([Math.cos(a) * 34 * ring, -18 - (Math.sin(a) * 0.5 + 0.5) * 56 * ring - (i % 3) * 3]);
  }
  return out;
})();

// o: { kind, leaf: 1..3, roots: 'shallow' | 'deep', grow: 0..1, wilt, glow,
//      head: 0..1 (sunflower), pumpkin: radius in px, tomatoes: how many, showRoots }
export function plantSVG(o) {
  const g = Math.max(0.08, Math.min(1, o.grow == null ? 1 : o.grow));
  const L = LEAF_LEN[o.leaf || 2];
  const lo = { wilt: o.wilt, glow: o.glow };
  const stem = o.wilt ? '#8f9a45' : '#4f8f3a';
  let top = '';

  if (o.kind === 'sunflower') {
    const H = 154 * g;
    const n = 2 + Math.round(5 * g);
    // H is the full height, so the top of the flower sits right at H on the ruler.
    let head = `<circle cx="0" cy="${r1(-H)}" r="4" fill="#6fae45"/>`, stemTop = H;
    if (o.head > 0) {
      const R = Math.min(7 + 13 * o.head, H * 0.2 + 2);
      stemTop = H - R * 1.87;
      const petals = Array.from({ length: 16 }, (_, i) => `<ellipse cx="0" cy="${r1(-R * 1.25)}" rx="${r1(R * 0.3)}" ry="${r1(R * 0.62)}" fill="${o.wilt ? '#d9b84a' : '#f6c12e'}" transform="rotate(${i * 22.5})"/>`).join('');
      head = `<g transform="translate(0 ${r1(-stemTop)})">${petals}<circle r="${r1(R)}" fill="#7a4a22"/><circle r="${r1(R * 0.62)}" fill="#5f3716"/></g>`;
    }
    const leaves = Array.from({ length: n }, (_, i) => leafAt(0, -stemTop * (0.16 + 0.66 * (i / Math.max(1, n - 1))), i % 2 ? -1 : 1, L * (0.75 + 0.25 * g), lo)).join('');
    top = `<path d="M0 0 Q 5 ${r1(-stemTop / 2)} 0 ${r1(-stemTop)}" fill="none" stroke="${stem}" stroke-width="${r1(3 + 3 * g)}" stroke-linecap="round"/>${leaves}${head}`;
  } else if (o.kind === 'tomato') {
    const H = 86 * g + 8;
    const rows = 2 + Math.round(2 * g);
    let parts = `<path d="M0 0 Q 3 ${r1(-H / 2)} 0 ${r1(-H)}" fill="none" stroke="${stem}" stroke-width="${r1(2.5 + 2.5 * g)}" stroke-linecap="round"/>`;
    for (let i = 0; i < rows; i++) {
      const y = -H * (0.25 + 0.6 * (i / Math.max(1, rows - 1)));
      const reach = (30 - i * 4) * (0.5 + 0.5 * g);
      for (const s of [1, -1]) {
        parts += `<path d="M0 ${r1(y)} Q ${r1(s * reach * 0.5)} ${r1(y - 8)} ${r1(s * reach)} ${r1(y - 5)}" fill="none" stroke="${stem}" stroke-width="2.2" stroke-linecap="round"/>`;
        parts += leafAt(s * reach, y - 5, s, L * 0.8, lo) + leafAt(s * reach * 0.5, y - 6, s, L * 0.6, { ...lo, up: 55 });
      }
    }
    parts += leafAt(0, -H, 1, L * 0.7, { ...lo, up: 70 });
    const k = 0.5 + 0.5 * g;
    const fruit = tomatoSpots.slice(0, o.tomatoes || 0).map(([x, y]) => `<g transform="translate(${r1(x * k)} ${r1(y * k - 4)})"><circle r="4.6" fill="#e0452f"/><circle cx="-1.4" cy="-1.5" r="1.3" fill="#fff" opacity=".45"/><path d="M-2.6 -4 L0 -2.6 L2.6 -4" stroke="#3f8a32" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>`).join('');
    top = parts + fruit;
  } else if (o.kind === 'pumpkin') {
    const reach = 26 + 74 * g;
    const n = 3 + Math.round(4 * g);
    let parts = `<path d="M0 0 Q ${r1(reach * 0.3)} -16 ${r1(reach * 0.6)} -5 T ${r1(reach)} -4" fill="none" stroke="${stem}" stroke-width="3.2" stroke-linecap="round"/><path d="M0 0 Q ${r1(-reach * 0.25)} -12 ${r1(-reach * 0.55)} -4" fill="none" stroke="${stem}" stroke-width="3.2" stroke-linecap="round"/>`;
    for (let i = 0; i < n; i++) {
      const t = i / Math.max(1, n - 1);
      const x = -reach * 0.5 + reach * 1.35 * t;
      const stalk = 14 + 12 * g + (i % 2) * 6;
      parts += `<path d="M${r1(x)} -5 L ${r1(x)} ${r1(-stalk)}" stroke="${stem}" stroke-width="2"/>` + leafAt(x, -stalk, i % 2 ? -1 : 1, L * 0.95, { ...lo, round: true, up: 28 });
    }
    if (o.pumpkin > 0) {
      const R = o.pumpkin, px = reach * 0.62;
      parts += `<g transform="translate(${r1(px)} ${r1(-R * 0.82)})">${pumpkinParts(R)}</g>`;
    }
    top = parts;
  } else { // oak
    const H = 40 + 105 * g;
    const tw = 5 + 9 * g;
    let parts = `<path d="M${r1(-tw / 2)} 0 L ${r1(-tw / 5)} ${r1(-H)} L ${r1(tw / 5)} ${r1(-H)} L ${r1(tw / 2)} 0 Z" fill="${o.wilt ? '#8a6a48' : '#7a5230'}"/>`;
    const rows = 2 + Math.round(3 * g);
    for (let i = 0; i < rows; i++) {
      const y = -H * (0.42 + 0.5 * (i / Math.max(1, rows - 1)));
      const reach = (20 + 22 * g) * (1 - 0.14 * i);
      for (const s of [1, -1]) {
        const ex = s * reach, ey = y - reach * 0.45;
        parts += `<path d="M0 ${r1(y)} L ${r1(ex)} ${r1(ey)}" stroke="#7a5230" stroke-width="${r1(1.5 + 2 * g)}" stroke-linecap="round"/>`;
        parts += leafAt(ex, ey, s, L * 0.72, { ...lo, up: 10 }) + leafAt(ex, ey, s, L * 0.72, { ...lo, up: 60 }) + leafAt(ex * 0.6, y - reach * 0.27, s, L * 0.6, { ...lo, up: 75 }) + leafAt(ex, ey, -s, L * 0.55, { ...lo, up: 80 });
      }
    }
    parts += leafAt(0, -H, 1, L * 0.7, { ...lo, up: 65 }) + leafAt(0, -H, -1, L * 0.7, { ...lo, up: 65 });
    top = parts;
  }
  return (o.showRoots === false ? '' : rootsSVG(o.roots || 'shallow', g)) + top;
}

/* ---------- small pictures ---------- */

export const PICS = {
  sun: `<svg viewBox="0 0 64 64"><g stroke="#f2b33d" stroke-width="4" stroke-linecap="round"><path d="M32 4v8M32 52v8M4 32h8M52 32h8M12 12l6 6M46 46l6 6M52 12l-6 6M18 46l-6 6"/></g><circle cx="32" cy="32" r="14" fill="#f8c93e"/></svg>`,
  water: `<svg viewBox="0 0 64 64"><path d="M32 6C22 22 14 31 14 41a18 18 0 0 0 36 0C50 31 42 22 32 6z" fill="#4ea3d8"/><path d="M24 42a9 9 0 0 0 7 8" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".7"/></svg>`,
  air: `<svg viewBox="0 0 64 64"><g fill="none" stroke="#7f95a8" stroke-width="5" stroke-linecap="round"><path d="M6 22h30a8 8 0 1 0-8-8"/><path d="M6 34h44a8 8 0 1 1-8 8"/><path d="M6 46h22"/></g></svg>`,
  soil: `<svg viewBox="0 0 64 64"><path d="M6 36h52v14a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8z" fill="#8a5a34"/><path d="M6 36h52v6H6z" fill="#6f4526"/><circle cx="20" cy="50" r="2.5" fill="#b08450"/><circle cx="40" cy="47" r="2" fill="#b08450"/><circle cx="48" cy="53" r="2.5" fill="#5d3a1e"/><path d="M32 36V20" stroke="#4f8f3a" stroke-width="4" stroke-linecap="round"/><path d="M32 24c8-10 16-8 18-6-4 8-12 10-18 6z" fill="#5fae45"/></svg>`,
  rocks: `<svg viewBox="0 0 64 64"><path d="M6 50c0-12 8-20 18-20s16 8 16 20z" fill="#9aa0a6"/><path d="M30 50c0-9 6-16 14-16s14 7 14 16z" fill="#7d848b"/><path d="M14 40c2-3 6-5 9-5" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".5"/></svg>`,
  pizza: `<svg viewBox="0 0 64 64"><path d="M8 14c16-8 32-8 48 0L32 60z" fill="#f3c463"/><path d="M8 14c16-8 32-8 48 0l-3 6c-14-6-28-6-42 0z" fill="#c98a3c"/><circle cx="26" cy="26" r="4.5" fill="#c9412c"/><circle cx="38" cy="30" r="4.5" fill="#c9412c"/><circle cx="31" cy="42" r="4" fill="#c9412c"/></svg>`,
  sugar: `<svg viewBox="0 0 64 64"><path d="M32 6l22 13v26L32 58 10 45V19z" fill="#f2a53a"/><path d="M32 6l22 13-22 13-22-13z" fill="#f8c56a"/><path d="M32 32v26" stroke="#c97f1c" stroke-width="2"/></svg>`,
  oxygen: `<svg viewBox="0 0 64 64"><circle cx="24" cy="38" r="15" fill="#d8f0fb" stroke="#6bb6dc" stroke-width="3.5"/><circle cx="46" cy="20" r="9" fill="#d8f0fb" stroke="#6bb6dc" stroke-width="3"/><path d="M16 34a9 9 0 0 1 6-6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  jar: `<svg viewBox="0 0 40 48"><path d="M8 10h24v30a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6z" fill="#fff" stroke="#c9b592" stroke-width="2.5"/><rect x="6" y="3" width="28" height="8" rx="3" fill="#c9b592"/><path class="fill" d="M10 18h20v22a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4z" fill="#f2a53a"/></svg>`,
};

// The whole plant as a small picture (menus, pickers, garden).
export function plantIcon(o, opts = {}) {
  const view = o.kind === 'pumpkin' ? '-78 -78 190 100' : o.kind === 'sunflower' ? '-70 -190 140 212' : o.kind === 'tomato' ? '-62 -110 124 132' : '-72 -168 144 190';
  const soil = opts.soil === false ? '' : `<rect x="-200" y="0" width="400" height="40" fill="#8a5a34"/><rect x="-200" y="0" width="400" height="5" fill="#6f4526"/>`;
  return `<svg class="plant" viewBox="${view}">${soil}${plantSVG({ showRoots: false, ...o })}</svg>`;
}

// A slice of oak trunk. Earlier rings are drawn first; this year's ring is the outer, brighter one.
export function ringSVG(widths, thisYear) {
  const all = [...widths, thisYear];
  let r = 7, out = '';
  const radii = all.map(w => (r += w));
  const R = radii[radii.length - 1];
  for (let i = radii.length - 1; i >= 0; i--) {
    const last = i === radii.length - 1;
    out += `<circle r="${r1(radii[i])}" fill="${last ? '#f2d08a' : i % 2 ? '#e3bf85' : '#d6ad70'}" stroke="${last ? '#c0791f' : '#a9824f'}" stroke-width="${last ? 2.2 : 1.2}"/>`;
  }
  return `<svg viewBox="${r1(-R - 8)} ${r1(-R - 8)} ${r1(2 * R + 16)} ${r1(2 * R + 16)}"><circle r="${r1(R + 5)}" fill="#6b4526"/>${out}<circle r="7" fill="#b98d55"/><circle r="2" fill="#7a5230"/></svg>`;
}
