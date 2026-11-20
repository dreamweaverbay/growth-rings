// Small drawings for the Field Guide: life-cycle steps, tracks, and leaves.
import { prop } from './art.js';
import { fishSVG } from './fishart.js';
import { FISH } from './data/fish.js';

const I = (inner) => `<svg viewBox="0 0 80 80">${inner}</svg>`;
const soil = '<ellipse cx="40" cy="68" rx="30" ry="7" fill="#8a6a48"/>';
const bass = FISH.find(f => f.id === 'largemouth');

function tree(crown) {
  return `<path d="M35 72 L37 40 H43 L45 72 Z" fill="#6b4426"/><path d="M39 46 L24 30 M40 44 L40 24 M41 46 L56 30 M30 36 L20 34 M50 36 L60 34" stroke="#6b4426" stroke-width="4" fill="none" stroke-linecap="round"/>${crown}`;
}
const crownCircles = (c1, c2) => `<circle cx="24" cy="30" r="15" fill="${c1}"/><circle cx="56" cy="30" r="15" fill="${c2}"/><circle cx="40" cy="20" r="16" fill="${c1}"/><circle cx="40" cy="36" r="12" fill="${c2}"/>`;

export const ICONS = {
  frogEggs: I('<rect y="50" width="80" height="30" fill="#bfe0ee"/>' + [[28, 34], [44, 30], [58, 38], [36, 46], [50, 50], [22, 48], [42, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#eef7fb" stroke="#9fc3d6" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="3" fill="#2b2b2b"/>`).join('')),
  tadpole: I('<ellipse cx="28" cy="40" rx="15" ry="11" fill="#3d4a3a"/><path d="M40 38 Q54 26 70 40 Q56 44 42 46 Z" fill="#55634f"/><circle cx="21" cy="37" r="2.4" fill="#fff"/>'),
  froglet: I('<path d="M52 50 Q66 40 76 46 Q66 54 54 56 Z" fill="#6aa85a"/><ellipse cx="36" cy="50" rx="20" ry="13" fill="#5aa04a"/><circle cx="26" cy="37" r="6" fill="#5aa04a"/><circle cx="42" cy="37" r="6" fill="#5aa04a"/><circle cx="26" cy="36" r="2.4" fill="#1e2a1a"/><circle cx="42" cy="36" r="2.4" fill="#1e2a1a"/><path d="M20 60 l-6 6 M50 60 l6 6" stroke="#4a8a3c" stroke-width="4" stroke-linecap="round"/>'),
  frog: I('<ellipse cx="18" cy="58" rx="11" ry="6" fill="#4a8a3c"/><ellipse cx="62" cy="58" rx="11" ry="6" fill="#4a8a3c"/><ellipse cx="40" cy="50" rx="22" ry="15" fill="#5aa04a"/><circle cx="29" cy="34" r="7.5" fill="#5aa04a"/><circle cx="51" cy="34" r="7.5" fill="#5aa04a"/><circle cx="29" cy="33" r="3" fill="#1e2a1a"/><circle cx="51" cy="33" r="3" fill="#1e2a1a"/><path d="M30 52 Q40 58 50 52" stroke="#2f5a26" stroke-width="2" fill="none" stroke-linecap="round"/>'),
  leafEgg: I('<path d="M10 64 C10 34 34 14 70 14 C70 46 46 66 10 64 Z" fill="#6fae55"/><path d="M10 64 L52 30" stroke="#4f8a3d" stroke-width="2"/><ellipse cx="44" cy="40" rx="5" ry="6" fill="#fffbe8" stroke="#d9cf9a" stroke-width="1.5"/>'),
  caterpillar: I([16, 28, 40, 52].map((x, i) => `<circle cx="${x}" cy="${48 - (i % 2) * 4}" r="9" fill="#7ab648" stroke="#4f8a2c" stroke-width="1.5"/><line x1="${x}" y1="${56 - (i % 2) * 4}" x2="${x}" y2="${62 - (i % 2) * 4}" stroke="#2b2b2b" stroke-width="2"/>`).join('') + '<circle cx="64" cy="46" r="10" fill="#5f9a38" stroke="#4f8a2c" stroke-width="1.5"/><circle cx="67" cy="44" r="2" fill="#111"/><path d="M66 36 l3 -7 M61 36 l-2 -7" stroke="#2b2b2b" stroke-width="1.6"/>'),
  chrysalis: I('<line x1="8" y1="14" x2="72" y2="14" stroke="#7a4e2c" stroke-width="5" stroke-linecap="round"/><line x1="40" y1="14" x2="40" y2="24" stroke="#4f8a3d" stroke-width="2.5"/><path d="M40 22 C54 26 54 52 40 68 C26 52 26 26 40 22 Z" fill="#7fae5a" stroke="#4f8a3d" stroke-width="1.5"/><path d="M31 34 h18" stroke="#e3ad25" stroke-width="2.5" stroke-linecap="round"/>'),
  butterfly: I(`<g id="w"><path d="M38 38 C22 6 0 18 12 40 Z" fill="#e8872b" stroke="#2b2b2b" stroke-width="3" stroke-linejoin="round"/><path d="M38 44 C16 44 12 68 30 64 Z" fill="#f0a23c" stroke="#2b2b2b" stroke-width="3" stroke-linejoin="round"/></g><g transform="translate(80 0) scale(-1 1)"><path d="M38 38 C22 6 0 18 12 40 Z" fill="#e8872b" stroke="#2b2b2b" stroke-width="3" stroke-linejoin="round"/><path d="M38 44 C16 44 12 68 30 64 Z" fill="#f0a23c" stroke="#2b2b2b" stroke-width="3" stroke-linejoin="round"/></g><ellipse cx="40" cy="42" rx="3.5" ry="17" fill="#2b2b2b"/><path d="M39 26 q-6 -10 -10 -10 M41 26 q6 -10 10 -10" stroke="#2b2b2b" stroke-width="1.6" fill="none"/>`),
  acorn: I('<ellipse cx="40" cy="48" rx="15" ry="19" fill="#a8672e"/><path d="M22 42 Q40 16 58 42 Z" fill="#6b3f1a"/><path d="M40 24 l2 -8" stroke="#6b3f1a" stroke-width="4" stroke-linecap="round"/>'),
  sprout: I(soil + '<ellipse cx="40" cy="64" rx="9" ry="7" fill="#a8672e"/><path d="M40 60 V36" stroke="#5f9a3e" stroke-width="3.5" stroke-linecap="round"/><path d="M40 42 Q26 40 24 28 Q38 28 40 42 Z" fill="#6fae55"/><path d="M40 38 Q54 36 56 24 Q42 24 40 38 Z" fill="#5e9a48"/>'),
  sapling: I(soil + '<path d="M40 68 V30" stroke="#7a4e2c" stroke-width="4" stroke-linecap="round"/><circle cx="31" cy="30" r="10" fill="#6fae55"/><circle cx="49" cy="30" r="10" fill="#5e9a48"/><circle cx="40" cy="20" r="11" fill="#6fae55"/>'),
  oak: I(soil + '<path d="M34 68 L36 40 H44 L46 68 Z" fill="#7a4e2c"/><circle cx="22" cy="36" r="16" fill="#5e9a48"/><circle cx="58" cy="36" r="16" fill="#5e9a48"/><circle cx="40" cy="22" r="18" fill="#6fae55"/><circle cx="40" cy="40" r="12" fill="#4f8a3d"/>'),
  egg: I('<ellipse cx="40" cy="42" rx="18" ry="24" fill="#f5ead6" stroke="#d9c7a3" stroke-width="2"/><ellipse cx="33" cy="32" rx="5" ry="8" fill="#fff" opacity=".6"/>'),
  chick: I('<path d="M34 62 v8 M46 62 v8" stroke="#e8872b" stroke-width="3" stroke-linecap="round"/><circle cx="40" cy="50" r="17" fill="#f6d24a"/><circle cx="42" cy="28" r="12" fill="#f6d24a"/><path d="M53 27 l9 3 l-9 4 Z" fill="#e8872b"/><circle cx="46" cy="25" r="2.2" fill="#111"/><path d="M26 48 q8 6 12 -2" stroke="#d9b02a" stroke-width="2" fill="none"/>'),
  hen: I(`<g transform="translate(42 68) scale(1.35)">${prop('hen', 0, 0, 1)}</g>`),
  sunWater: I('<circle cx="40" cy="24" r="12" fill="#f2b33d"/>' + [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="40" y1="6" x2="40" y2="2" stroke="#f2b33d" stroke-width="3" stroke-linecap="round" transform="rotate(${a} 40 24)"/>`).join('') + '<rect y="54" width="80" height="26" fill="#6fb3d9"/><path d="M10 62 h14 M40 68 h16 M58 60 h12" stroke="#fff" stroke-width="2" opacity=".6" stroke-linecap="round"/>'),
  vapor: I('<rect y="58" width="80" height="22" fill="#6fb3d9"/>' + [20, 40, 60].map(x => `<path d="M${x} 54 q-6 -8 0 -16 q6 -8 0 -16" stroke="#8fb9d0" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${x - 5} 26 l5 -7 l5 7" stroke="#8fb9d0" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('')),
  cloud: I('<path d="M22 56a13 13 0 010-26 17 17 0 0133 3 11 11 0 012 23z" fill="#fff" stroke="#8aa4bd" stroke-width="2.5"/>'),
  rain: I('<path d="M22 42a12 12 0 010-24 16 16 0 0131 3 10 10 0 012 21z" fill="#dfe6ee" stroke="#6f8aa6" stroke-width="2.5"/><g stroke="#3a86c8" stroke-width="3.5" stroke-linecap="round"><line x1="24" y1="50" x2="20" y2="62"/><line x1="38" y1="50" x2="34" y2="62"/><line x1="52" y1="50" x2="48" y2="62"/></g><rect y="72" width="80" height="8" fill="#82b05e"/>'),
  treeSpring: I(soil + tree([[24, 30], [40, 26], [56, 30], [18, 24], [30, 22], [48, 20], [62, 24], [40, 16]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#a8d67a"/>`).join(''))),
  treeSummer: I(soil + tree(crownCircles('#5e9a48', '#6fae55'))),
  treeFall: I(soil + tree(crownCircles('#e08a2e', '#d9642c')) + '<ellipse cx="66" cy="58" rx="5" ry="3" fill="#e08a2e" transform="rotate(30 66 58)"/><ellipse cx="14" cy="62" rx="5" ry="3" fill="#d9642c" transform="rotate(-20 14 62)"/>'),
  treeWinter: I('<ellipse cx="40" cy="68" rx="32" ry="7" fill="#fff" stroke="#cfdbe6" stroke-width="1.5"/>' + tree('') + [[14, 20], [66, 16], [30, 10], [54, 44], [10, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#fff" stroke="#bcd0e0" stroke-width="1"/>`).join('')),
  bassEggs: I('<rect width="80" height="80" fill="#bfe0ee"/><ellipse cx="40" cy="56" rx="30" ry="13" fill="#cbb994" stroke="#a8946a" stroke-width="2"/>' + [[30, 52], [38, 56], [46, 52], [52, 58], [34, 60], [44, 62], [40, 48]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#f2d86a" stroke="#c9a640" stroke-width="1"/>`).join('')),
  bassFry: I('<rect width="80" height="80" fill="#bfe0ee"/>' + [[26, 28], [50, 42], [30, 58]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="3.5" fill="#5d7337"/><path d="M${x + 8} ${y} l7 -4 v8 Z" fill="#5d7337"/><circle cx="${x - 5}" cy="${y - 0.5}" r="1.2" fill="#111"/>`).join('')),
  bassYoung: `<div class="fish-step small">${fishSVG(bass)}</div>`,
  bassAdult: `<div class="fish-step">${fishSVG(bass)}</div>`,
};

const ink = '#5b4636';
export const TRACKS = {
  deer: I(`<path d="M37 12 C24 30 24 56 34 66 C39 56 39 30 37 12 Z" fill="${ink}"/><path d="M43 12 C56 30 56 56 46 66 C41 56 41 30 43 12 Z" fill="${ink}"/>`),
  dog: I(`<path d="M40 40 C54 40 62 56 53 65 C46 69 34 69 27 65 C18 56 26 40 40 40 Z" fill="${ink}"/>` + [[20, 36, -20], [33, 24, -6], [47, 24, 6], [60, 36, 20]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="6.5" ry="9" fill="${ink}" transform="rotate(${r} ${x} ${y})"/><circle cx="${x + r / 5}" cy="${y - 13}" r="1.8" fill="${ink}"/>`).join('')),
  raccoon: I(`<ellipse cx="40" cy="56" rx="15" ry="13" fill="${ink}"/>` + [[18, 40, -38], [28, 28, -16], [40, 24, 0], [52, 28, 16], [62, 40, 38]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="4.2" ry="12" fill="${ink}" transform="rotate(${r} ${x} ${y})"/>`).join('')),
  turkey: I(`<g stroke="${ink}" stroke-width="6" stroke-linecap="round"><line x1="40" y1="52" x2="40" y2="12"/><line x1="40" y1="52" x2="16" y2="24"/><line x1="40" y1="52" x2="64" y2="24"/><line x1="40" y1="52" x2="40" y2="68"/></g>`),
  duck: I(`<path d="M40 60 L14 24 Q26 30 40 12 Q54 30 66 24 Z" fill="#a08a72"/><g stroke="${ink}" stroke-width="5" stroke-linecap="round"><line x1="40" y1="60" x2="40" y2="12"/><line x1="40" y1="60" x2="14" y2="24"/><line x1="40" y1="60" x2="66" y2="24"/></g>`),
};

export const LEAVES = {
  oak: I('<path d="M40 76 L40 62 C30 64 22 60 26 52 C16 52 14 42 22 38 C14 32 18 22 28 24 C26 14 34 8 40 12 C46 8 54 14 52 24 C62 22 66 32 58 38 C66 42 64 52 54 52 C58 60 50 64 40 62 Z" fill="#5f8f3e" stroke="#3d6b25" stroke-width="1.5" stroke-linejoin="round"/><path d="M40 62 V16" stroke="#3d6b25" stroke-width="1.6"/>'),
  maple: I('<path d="M40 76 L40 60 L24 64 L28 52 L10 48 L20 40 L12 26 L26 30 L28 16 L36 24 L40 8 L44 24 L52 16 L54 30 L68 26 L60 40 L70 48 L52 52 L56 64 L40 60 Z" fill="#d9642c" stroke="#a8431a" stroke-width="1.5" stroke-linejoin="round"/><path d="M40 60 V14 M40 44 L20 40 M40 44 L60 40 M40 36 L28 20 M40 36 L52 20" stroke="#a8431a" stroke-width="1.3" fill="none"/>'),
  pine: I('<path d="M40 76 V40" stroke="#7a4e2c" stroke-width="4" stroke-linecap="round"/>' + [-60, -40, -20, 0, 20, 40, 60].map(a => `<line x1="40" y1="42" x2="40" y2="6" stroke="#3f7a46" stroke-width="2.6" stroke-linecap="round" transform="rotate(${a} 40 42)"/>`).join('') + [-70, -50, 50, 70].map(a => `<line x1="40" y1="58" x2="40" y2="30" stroke="#4f8a52" stroke-width="2.4" stroke-linecap="round" transform="rotate(${a} 40 58)"/>`).join('')),
};
