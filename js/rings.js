// Draws the tree cross-section. One ring per week; marks show what happened.
import { weekStart, WEEK } from './store.js';

const TAU = Math.PI * 2;

function wobblePath(cx, cy, r, phase, rough = 1, steps = 96) {
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const th = (i / steps) * TAU;
    const k = 1
      + 0.022 * rough * Math.sin(3 * th + phase[0])
      + 0.014 * rough * Math.sin(5 * th + phase[1])
      + 0.008 * rough * Math.sin(9 * th + phase[2]);
    const x = cx + r * k * Math.cos(th);
    const y = cy + r * k * Math.sin(th);
    d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2);
  }
  return d + 'Z';
}

function radiusAt(r, th, phase, rough = 1) {
  return r * (1
    + 0.022 * rough * Math.sin(3 * th + phase[0])
    + 0.014 * rough * Math.sin(5 * th + phase[1])
    + 0.008 * rough * Math.sin(9 * th + phase[2]));
}

export function buildRingModel(events, created, now = Date.now()) {
  const startW = weekStart(created);
  const curW = weekStart(now);
  let n = Math.round((curW - startW) / WEEK) + 1;
  const firstShown = Math.max(0, n - 104); // show up to two years
  const weeks = [];
  for (let i = firstShown; i < n; i++) {
    const ws = startW + i * WEEK;
    const evs = events.filter(e => e.t >= ws && e.t < ws + WEEK);
    weeks.push({
      start: ws,
      done: evs.filter(e => e.k === 'done'),
      grown: evs.filter(e => e.k === 'grown'),
      current: i === n - 1,
    });
  }
  return weeks;
}

export function renderRings(events, created, colors, opts = {}) {
  const size = 400, cx = 200, cy = 200;
  const maxR = opts.maxR || 150;
  const weeks = buildRingModel(events, created);
  const pith = 9;
  const widths = weeks.map(w => 8 + 3.2 * Math.min(w.done.length, 12));
  const total = pith + widths.reduce((a, b) => a + b, 0);
  // Young trees are drawn larger so the first weeks are easy to see.
  const minOuter = maxR * (opts.minFrac || 0.55);
  const scale = total > maxR ? maxR / total : Math.max(Math.min(2.6, maxR / total), minOuter / total);
  const phase = [0.7, 2.1, 4.4];

  const parts = [];
  parts.push(`<defs>
    <radialGradient id="wood" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c8925a"/>
      <stop offset="55%" stop-color="#e2bd86"/>
      <stop offset="100%" stop-color="#f1dcb0"/>
    </radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="0.4"/></filter>
  </defs>`);

  // ring boundaries (outer radius of each week)
  const radii = [];
  let r = pith * scale;
  for (const w of widths) { r += w * scale; radii.push(r); }
  const outer = r;
  const barkW = Math.max(10, outer * 0.09);

  // bark
  parts.push(`<path d="${wobblePath(cx, cy, outer + barkW, phase, 1.6)}" fill="#5b3a22"/>`);
  for (let i = 0; i < 28; i++) {
    const th = (i / 28) * TAU + 0.11 * Math.sin(i * 7.3);
    const r1 = radiusAt(outer + barkW * 0.25, th, phase, 1.3);
    const r2 = radiusAt(outer + barkW * (0.75 + 0.2 * Math.sin(i * 3.1)), th, phase, 1.5);
    parts.push(`<line x1="${(cx + r1 * Math.cos(th)).toFixed(1)}" y1="${(cy + r1 * Math.sin(th)).toFixed(1)}" x2="${(cx + r2 * Math.cos(th)).toFixed(1)}" y2="${(cy + r2 * Math.sin(th)).toFixed(1)}" stroke="#3e2615" stroke-width="2" stroke-linecap="round"/>`);
  }
  parts.push(`<path d="${wobblePath(cx, cy, outer + 1.5, phase, 1.1)}" fill="#8a5a33"/>`);
  parts.push(`<path d="${wobblePath(cx, cy, outer, phase)}" fill="url(#wood)"/>`);

  // ring lines (latewood)
  radii.forEach((rr, i) => {
    const isCur = weeks[i].current;
    const sw = Math.max(1.2, Math.min(3, 1.6 * scale));
    parts.push(`<path d="${wobblePath(cx, cy, rr, phase)}" fill="none" stroke="${isCur ? '#9b6a3a' : '#a8743f'}" stroke-width="${sw}" opacity="${isCur ? 0.9 : 0.75}" filter="url(#soft)"/>`);
  });
  parts.push(`<circle cx="${cx}" cy="${cy}" r="${Math.min(6, Math.max(2.5, pith * scale * 0.3))}" fill="#7a4a24"/>`);

  // current week: a soft growing edge
  if (weeks.length) {
    const rr = radii[radii.length - 1];
    parts.push(`<path class="ring-growing" d="${wobblePath(cx, cy, rr, phase)}" fill="none" stroke="#fff6e0" stroke-width="2" stroke-dasharray="3 6"/>`);
  }

  // marks
  const newest = Math.max(0, ...events.filter(e => e.k === 'done').map(e => e.t));
  const dotR = Math.max(3.4, Math.min(6.5, 2.4 * scale));
  weeks.forEach((w, i) => {
    const rIn = i === 0 ? pith * scale : radii[i - 1];
    const rOut = radii[i];
    // Spread marks from the same day so they don't sit on top of each other.
    const perDay = {};
    [...w.done, ...w.grown].forEach(e => { const k = (new Date(e.t).getDay() + 6) % 7; perDay[k] = (perDay[k] || 0) + 1; });
    const seen = {};
    const place = (e, idx, count, offset) => {
      const d = new Date(e.t);
      const dow = (d.getDay() + 6) % 7;
      const k = (seen[dow] = (seen[dow] || 0) + 1) - 1;
      const n = perDay[dow];
      const spread = (k - (n - 1) / 2) * Math.min(0.13, 0.8 / n);
      const th = ((dow + 0.5) / 7) * TAU - Math.PI / 2 + spread + offset * 0;
      const band = n > 1 ? (k % 2 ? 0.68 : 0.34) : 0.5;
      const rr = radiusAt(rIn + (rOut - rIn) * band, th, phase);
      return [cx + rr * Math.cos(th), cy + rr * Math.sin(th)];
    };
    w.done.forEach((e, idx) => {
      const [x, y] = place(e, idx, w.done.length, 0);
      const isNew = opts.highlight && e.t === newest;
      if (isNew) parts.push(`<circle class="mark-halo" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(dotR * 2.4).toFixed(1)}" fill="${colors[e.a] || '#7a5a3a'}" opacity=".3"/>`);
      parts.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(isNew ? dotR * 1.5 : dotR).toFixed(1)}" fill="${colors[e.a] || '#7a5a3a'}" stroke="#fff8ea" stroke-width="${isNew ? 2 : 1.2}"/>`);
    });
    w.grown.forEach((e, idx) => {
      const [x, y] = place(e, idx, w.grown.length, 0.09);
      const s = dotR * 1.25;
      parts.push(`<path d="M${x} ${y - s}L${x + s * 0.6} ${y}L${x} ${y + s}L${x - s * 0.6} ${y}Z" fill="#e3ad25" stroke="#fff8ea" stroke-width="1"/>`);
    });
  });

  const label = opts.label || 'Growth rings';
  return `<svg class="rings" viewBox="0 0 ${size} ${size}" role="img" aria-label="${label}">${parts.join('')}</svg>`;
}

export function weekSummary(events, created) {
  const weeks = buildRingModel(events, created);
  const cur = weeks[weeks.length - 1];
  return { weeks: weeks.length, done: cur ? cur.done.length : 0, grown: cur ? cur.grown.length : 0 };
}
