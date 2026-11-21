// Grove Grid: four picture pattern puzzles a day (grid, what comes next, missing piece, pattern path),
// plus a pattern maker he builds for a grown-up to solve.
import { el, svg, icons, shake, shuffle, seededRandom } from '../ui.js';

export const SYMBOLS = {
  acorn: '<svg viewBox="-20 -20 40 40"><ellipse cx="0" cy="4" rx="9" ry="11" fill="#b06d2f"/><path d="M-11 -2 Q0 -15 11 -2 Z" fill="#6b3f1a"/><path d="M0 -10 L2 -16" stroke="#6b3f1a" stroke-width="3" stroke-linecap="round"/></svg>',
  leaf: '<svg viewBox="-20 -20 40 40"><path d="M-13 13 C-13 -3 -2 -14 14 -14 C14 3 3 13 -13 13 Z" fill="#5f9a3e"/><path d="M-13 13 L7 -7" stroke="#3d6b25" stroke-width="2" stroke-linecap="round"/></svg>',
  mushroom: '<svg viewBox="-20 -20 40 40"><rect x="-5" y="-4" width="10" height="17" rx="4" fill="#fffdf8" stroke="#b9a07a" stroke-width="1.5"/><path d="M-15 0 Q-15 -15 0 -15 Q15 -15 15 0 Z" fill="#cf4a3c"/><circle cx="-6" cy="-7" r="2.6" fill="#fff4e6"/><circle cx="5" cy="-9" r="2.2" fill="#fff4e6"/></svg>',
  pinecone: '<svg viewBox="-20 -20 40 40"><path d="M0 -16 C10 -10 12 4 0 16 C-12 4 -10 -10 0 -16 Z" fill="#8a5a33"/><path d="M-7 -5 L0 0 L7 -5 M-8 3 L0 8 L8 3 M-5 -11 L0 -7 L5 -11" fill="none" stroke="#5b3a22" stroke-width="2"/></svg>',
  berry: '<svg viewBox="-20 -20 40 40"><circle cx="-6" cy="4" r="7" fill="#5a4fb0"/><circle cx="6" cy="4" r="7" fill="#6a5fc4"/><circle cx="0" cy="-5" r="7" fill="#5a4fb0"/><path d="M0 -12 L-3 -17 M0 -12 L4 -16" stroke="#3d6b25" stroke-width="2.5" stroke-linecap="round"/></svg>',
  feather: '<svg viewBox="-20 -20 40 40"><path d="M10 -16 C-6 -12 -12 2 -10 14 C2 12 12 -2 10 -16 Z" fill="#3a86c8"/><path d="M-12 17 L8 -12" stroke="#1f5a8a" stroke-width="2" stroke-linecap="round"/></svg>',
};
const ORDER = ['acorn', 'leaf', 'mushroom', 'pinecone', 'berry', 'feather'];

/* ---------- puzzle generation ---------- */

export function makeSolution(n, br, bc, rnd) {
  const base = (r, c) => (bc * (r % br) + Math.floor(r / br) + c) % n;
  const bands = shuffle([...Array(n / br).keys()], rnd);
  const rows = bands.flatMap(b => shuffle([...Array(br).keys()], rnd).map(i => b * br + i));
  const stacks = shuffle([...Array(n / bc).keys()], rnd);
  const cols = stacks.flatMap(s => shuffle([...Array(bc).keys()], rnd).map(i => s * bc + i));
  const syms = shuffle([...Array(n).keys()], rnd);
  return rows.map(r => cols.map(c => syms[base(r, c)]));
}

export function countSolutions(grid, n, br, bc, limit = 2) {
  const g = grid.map(r => r.slice());
  let count = 0;
  const ok = (r, c, v) => {
    for (let i = 0; i < n; i++) if (g[r][i] === v || g[i][c] === v) return false;
    const r0 = r - (r % br), c0 = c - (c % bc);
    for (let i = 0; i < br; i++) for (let j = 0; j < bc; j++) if (g[r0 + i][c0 + j] === v) return false;
    return true;
  };
  const solve = () => {
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (g[r][c] === null) {
        for (let v = 0; v < n; v++) {
          if (ok(r, c, v)) { g[r][c] = v; solve(); g[r][c] = null; if (count >= limit) return; }
        }
        return;
      }
    }
    count++;
  };
  solve();
  return count;
}

export function makePuzzle(n, br, bc, targetGivens, rnd) {
  const sol = makeSolution(n, br, bc, rnd);
  const puzzle = sol.map(r => r.slice());
  const cells = shuffle([...Array(n * n).keys()], rnd);
  let givens = n * n;
  for (const idx of cells) {
    if (givens <= targetGivens) break;
    const r = Math.floor(idx / n), c = idx % n;
    const keep = puzzle[r][c];
    puzzle[r][c] = null;
    if (countSolutions(puzzle, n, br, bc) !== 1) puzzle[r][c] = keep;
    else givens--;
  }
  return { sol, puzzle };
}

/* ---------- pattern puzzle generators ---------- */

const ri = (rnd, a, b) => a + Math.floor(rnd() * (b - a + 1));
const pick = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];

// Three strips: an easy repeat, a harder repeat with two blanks, and a number pattern.
export function makeStrips(rnd) {
  const easy = [[0, 1], [0, 0, 1], [0, 1, 1]];
  const hard = [[0, 1, 2], [0, 0, 1, 1], [0, 1, 0, 2], [0, 1, 2, 2]];
  const picStrip = (unit, blanks) => {
    const syms = shuffle(ORDER, rnd);
    const n = unit.length === 3 ? 9 : 8;
    const hide = blanks(n, unit.length);
    const cells = Array.from({ length: n }, (_, i) => ({ v: syms[unit[i % unit.length]], blank: hide.includes(i) }));
    const used = [...new Set(unit)].map(i => syms[i]);
    const extra = syms.find(k => !used.includes(k));
    return { kind: 'pic', cells, choices: shuffle([...used, extra], rnd) };
  };
  const numStrip = () => {
    const rule = pick(rnd, ['+1', '+2', '+2', '+5', '+10', '-1', '-2', '+3']);
    const d = parseInt(rule, 10);
    const start = d === 5 ? pick(rnd, [5, 10, 15]) : d === 10 ? pick(rnd, [10, 20, 30]) : d < 0 ? ri(rnd, 12, 20) : ri(rnd, 1, 9);
    const vals = Array.from({ length: 5 }, (_, i) => start + i * d);
    const b = ri(rnd, 2, 4);
    const right = vals[b];
    const wrong = [...new Set([right + d, right - d, right + 1, right - 1, right + 2 * d, right + 2].filter(x => x !== right && x >= 0))];
    return { kind: 'num', cells: vals.map((v, i) => ({ v, blank: i === b })), choices: shuffle([right, ...shuffle(wrong, rnd).slice(0, 3)], rnd) };
  };
  return [
    picStrip(pick(rnd, easy), (n) => [n - 1]),
    picStrip(pick(rnd, hard), (n, u) => [ri(rnd, u, n - 3), n - 1]),
    numStrip(),
  ];
}

// A 3 x 3 square with one piece missing. Each piece is a picture shown one, two, or three times.
export function makeMatrix(rnd, level) {
  const syms = shuffle(ORDER, rnd).slice(0, 3);
  let cell, tip;
  if (level === 0) {
    const flipped = rnd() < 0.5; // same picture down each column instead of across each row
    cell = (r, c) => (flipped ? { sym: syms[c], n: r + 1 } : { sym: syms[r], n: c + 1 });
    tip = flipped ? 'Look down each column. What stays the same? What changes?' : 'Look across each row. What stays the same? What changes?';
  } else {
    const shift = shuffle([0, 1, 2], rnd);
    cell = (r, c) => ({ sym: syms[(shift[r] + c) % 3], n: r + 1 });
    tip = 'Each row has all three pictures. Count how many are in each square of the row.';
  }
  const cells = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) cells.push(cell(r, c));
  const miss = level === 0 ? ri(rnd, 2, 8) : ri(rnd, 3, 8);
  const right = cells[miss];
  const otherSym = pick(rnd, syms.filter(k => k !== right.sym));
  const otherN = pick(rnd, [1, 2, 3].filter(n => n !== right.n));
  const choices = shuffle([right, { sym: right.sym, n: otherN }, { sym: otherSym, n: right.n }, { sym: otherSym, n: otherN }], rnd);
  return { cells, miss, choices, tip };
}

// A grid with exactly one path from the top-left to the bottom-right that follows a repeating pattern.
export function makePath(rnd, W = 5, H = 5) {
  const idx = (x, y) => y * W + x;
  const nbrs = (i) => {
    const x = i % W, y = Math.floor(i / W), out = [];
    if (x > 0) out.push(i - 1); if (x < W - 1) out.push(i + 1); if (y > 0) out.push(i - W); if (y < H - 1) out.push(i + W);
    return out;
  };
  const start = 0, end = idx(W - 1, H - 1);
  const pattern = shuffle(ORDER, rnd).slice(0, 3);
  for (let attempt = 0; attempt < 400; attempt++) {
    // random self-avoiding walk from start to end
    const path = [start], seen = new Set([start]);
    let guard = 0;
    while (path[path.length - 1] !== end && guard++ < 200) {
      const opts = shuffle(nbrs(path[path.length - 1]).filter(n => !seen.has(n)), rnd);
      if (!opts.length) break;
      path.push(opts[0]); seen.add(opts[0]);
    }
    if (path[path.length - 1] !== end || path.length < 9 || path.length > 15) continue;
    for (let fill = 0; fill < 60; fill++) {
      const grid = Array.from({ length: W * H }, () => pattern[Math.floor(rnd() * 3)]);
      path.forEach((cellI, k) => { grid[cellI] = pattern[k % 3]; });
      // count pattern-following paths from start to end
      let count = 0;
      const used = new Set([start]);
      const walk = (i, k) => {
        if (count > 1) return;
        if (i === end) { count++; return; }
        for (const n of nbrs(i)) {
          if (used.has(n) || grid[n] !== pattern[(k + 1) % 3]) continue;
          used.add(n); walk(n, k + 1); used.delete(n);
        }
      };
      walk(start, 0);
      if (count === 1) return { W, H, grid, path, pattern, start, end };
    }
  }
  return null;
}

/* ---------- activity ---------- */

const TYPES = [
  { id: 'grid', name: 'Grid', blurb: 'Each picture one time in every row, column, and box' },
  { id: 'next', name: 'What Comes Next', blurb: 'Fill in what is missing from each pattern' },
  { id: 'piece', name: 'Missing Piece', blurb: 'Find the piece that finishes the square' },
  { id: 'path', name: 'Pattern Path', blurb: 'Follow the pattern across the grove' },
];
const sym = (k, cls) => svg(SYMBOLS[k], cls);
const NAMES = { acorn: 'acorn', leaf: 'leaf', mushroom: 'mushroom', pinecone: 'pinecone', berry: 'berries', feather: 'feather' };

export function start(ctx) {
  const { body, store, sfx } = ctx;
  const today = store.todayKey();
  const key = (type) => (type === 'grid' ? today : `${today}:${type}`);
  const isSolved = (type) => !!store.get().grove.solved[key(type)];
  const solvedCount = () => TYPES.filter(t => isSolved(t.id)).length;
  const players = { grid: playGrid, next: playNext, piece: playPiece, path: playPath };
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clear = () => { timers.forEach(clearTimeout); timers = []; body.innerHTML = ''; };
  showMenu();

  function miniArt(type) {
    if (type === 'grid') return el('div', { class: 'grove-mini' }, ORDER.slice(0, 4).map(k => sym(k, 'mini-sym')));
    if (type === 'next') return el('div', { class: 'grove-mini strip' }, sym('leaf', 'mini-sym'), sym('acorn', 'mini-sym'), sym('leaf', 'mini-sym'), el('span', { class: 'mini-q' }, '?'));
    if (type === 'piece') return el('div', { class: 'grove-mini' }, sym('berry', 'mini-sym'), sym('feather', 'mini-sym'), sym('feather', 'mini-sym'), el('span', { class: 'mini-q' }, '?'));
    return el('div', { class: 'grove-mini' }, sym('leaf', 'mini-sym on'), sym('acorn', 'mini-sym on'), sym('pinecone', 'mini-sym'), sym('mushroom', 'mini-sym on'));
  }

  function showMenu() {
    clear();
    const n = solvedCount();
    body.append(
      el('div', { class: 'gv-head' },
        el('h2', {}, 'Today’s puzzles'),
        el('p', { class: 'muted' }, n === 4 ? 'All four solved. Tap any puzzle for a brand-new one.' : `${n} of 4 solved`)),
      el('div', { class: 'grove-menu' }, TYPES.map(t => {
        const done = isSolved(t.id);
        return el('button', { class: 'grove-card', onclick: () => { sfx.pick(); players[t.id](done); } },
          miniArt(t.id),
          el('div', { class: 'grove-card-text' },
            el('span', { class: 'grove-card-title' }, t.name),
            el('span', { class: 'muted' }, t.blurb),
            done ? el('span', { class: 'tale-done' }, svg(icons.check), 'Solved today') : null));
      })),
      el('div', { class: 'center-row' },
        el('button', { class: 'smallbtn gv-maker-btn', onclick: () => { sfx.pick(); maker(); } }, 'Make a pattern for a grown-up')),
    );
  }

  function header(title, sub) {
    return el('div', { class: 'gv-top' },
      el('button', { class: 'smallbtn', onclick: () => { sfx.tap(); showMenu(); } }, '← Puzzles'),
      el('h2', {}, title),
      sub ? el('span', { class: 'gv-count' }, sub) : null);
  }

  // Called when any puzzle is solved.
  function solved(type, practice, host) {
    sfx.good();
    if (practice) {
      host.append(el('div', { class: 'gv-done' }, el('strong', {}, 'Solved!'),
        el('div', { class: 'row gap center' },
          el('button', { class: 'bigbtn', onclick: () => { sfx.tap(); players[type](true); } }, 'Another'),
          el('button', { class: 'bigbtn ghost', onclick: () => { sfx.tap(); showMenu(); } }, 'Puzzles'))));
      return;
    }
    store.update(s => { s.grove.solved[key(type)] = true; });
    const n = solvedCount();
    if (n === 4) {
      later(() => ctx.finish({
        title: 'All four puzzles solved!',
        line: 'You found every pattern in the grove today.',
        grownPrompt: 'Now make a pattern for a grown-up. Hide one piece and see if they can find it.',
        note: 'set',
        againLabel: 'Make a pattern',
        onAgain: maker,
      }), 800);
      return;
    }
    const nextType = TYPES.find(t => !isSolved(t.id));
    host.append(el('div', { class: 'gv-done' }, el('strong', {}, `Solved! ${n} of 4 done today.`),
      el('div', { class: 'row gap center' },
        el('button', { class: 'bigbtn', onclick: () => { sfx.tap(); players[nextType.id](false); } }, `Next: ${nextType.name}`),
        el('button', { class: 'bigbtn ghost', onclick: () => { sfx.tap(); showMenu(); } }, 'Puzzles'))));
  }

  const seedFor = (type, practice) => seededRandom(practice ? `practice-${type}-${Date.now()}` : `grove-${type}-${today}`);

  /* ===== What Comes Next ===== */
  function playNext(practice) {
    const strips = makeStrips(seedFor('next', practice));
    let at = 0;
    show();
    function show() {
      clear();
      const st = strips[at];
      const blanks = st.cells.map((c, i) => (c.blank ? i : -1)).filter(i => i >= 0);
      let filled = 0;
      const msg = el('p', { class: 'grove-msg' }, st.kind === 'num' ? 'Which number is missing?' : 'What goes in the empty spot?');
      const cellEls = st.cells.map((c) => el('div', { class: 'gv-cell' + (c.blank ? ' blank' : '') + (st.kind === 'num' ? ' num' : '') },
        c.blank ? '?' : (st.kind === 'num' ? String(c.v) : sym(c.v, 'gv-sym'))));
      const mark = () => cellEls.forEach((n, i) => n.classList.toggle('sel', i === blanks[filled]));
      const row = el('div', { class: 'gv-strip', style: { '--n': st.cells.length } }, cellEls);
      const choices = el('div', { class: 'gv-choices' }, st.choices.map(ch => {
        const b = el('button', { class: 'pal' + (st.kind === 'num' ? ' num' : ''), 'aria-label': String(ch), onclick: () => {
          const i = blanks[filled];
          if (i === undefined) return;
          if (ch !== st.cells[i].v) { sfx.nope(); shake(b); msg.textContent = st.kind === 'num' ? 'Look at how the numbers change each time.' : 'Find the part that repeats. Then look again.'; return; }
          sfx.pick();
          cellEls[i].classList.remove('blank'); cellEls[i].classList.add('fixed');
          cellEls[i].innerHTML = '';
          cellEls[i].append(st.kind === 'num' ? String(ch) : sym(ch, 'gv-sym'));
          filled++;
          mark();
          if (filled === blanks.length) {
            choices.classList.add('off');
            at++;
            if (at < strips.length) { msg.textContent = 'Yes!'; later(show, 900); }
            else { msg.textContent = 'All three patterns are done.'; solved('next', practice, wrap); }
          } else msg.textContent = 'Yes! Now the next empty spot.';
        } }, st.kind === 'num' ? String(ch) : sym(ch, 'pal-sym'));
        return b;
      }));
      const wrap = el('div', { class: 'gv-stage' }, row, msg, choices);
      body.append(header('What Comes Next', `Pattern ${at + 1} of ${strips.length}`), wrap);
      mark();
    }
  }

  /* ===== Missing Piece ===== */
  const piece = (c) => el('div', { class: 'gv-piece' }, Array.from({ length: c.n }, () => sym(c.sym, 'gv-piece-sym')));
  function playPiece(practice) {
    const rnd = seedFor('piece', practice);
    const rounds = [makeMatrix(rnd, 0), makeMatrix(rnd, 1)];
    let at = 0;
    show();
    function show() {
      clear();
      const m = rounds[at];
      const msg = el('p', { class: 'grove-msg' }, 'Which piece goes in the empty square?');
      const cells = m.cells.map((c, i) => el('div', { class: 'gv-mcell' + (i === m.miss ? ' miss' : '') }, i === m.miss ? '?' : piece(c)));
      const board = el('div', { class: 'gv-matrix' }, cells);
      const right = m.cells[m.miss];
      const choices = el('div', { class: 'gv-pieces' }, m.choices.map(ch => {
        const b = el('button', { class: 'gv-piece-btn', 'aria-label': `${ch.n} ${NAMES[ch.sym]}`, onclick: () => {
          if (ch.sym !== right.sym || ch.n !== right.n) { sfx.nope(); shake(b); msg.textContent = m.tip; return; }
          sfx.pick();
          cells[m.miss].classList.remove('miss'); cells[m.miss].classList.add('fixed');
          cells[m.miss].innerHTML = ''; cells[m.miss].append(piece(right));
          choices.classList.add('off');
          at++;
          if (at < rounds.length) { msg.textContent = 'Yes! One more square.'; later(show, 1100); }
          else { msg.textContent = 'Both squares are done.'; solved('piece', practice, side); }
        } }, piece(ch));
        return b;
      }));
      const side = el('div', { class: 'grove-side' }, msg, choices);
      body.append(header('Missing Piece', `Square ${at + 1} of ${rounds.length}`), el('div', { class: 'grove-play' }, board, side));
    }
  }

  /* ===== Pattern Path ===== */
  function playPath(practice) {
    const rnd = seedFor('path', practice);
    const P = makePath(rnd) || makePath(seededRandom('fallback-' + Date.now()));
    clear();
    let trail = [P.start];
    let finished = false;
    const msg = el('p', { class: 'grove-msg' }, 'Start at the flag. Tap the next square in the pattern until you reach the star.');
    const cells = P.grid.map((k, i) => el('button', { class: 'gv-pcell' + (i === P.start ? ' start' : '') + (i === P.end ? ' end' : ''), 'aria-label': NAMES[k], onclick: () => tap(i) },
      sym(k, 'gv-psym'), i === P.start ? el('span', { class: 'gv-tag' }, '⚑') : null, i === P.end ? el('span', { class: 'gv-tag' }, '★') : null));
    const board = el('div', { class: 'gv-path', style: { '--n': P.W } }, cells);
    const legend = el('div', { class: 'gv-legend' }, el('span', { class: 'muted' }, 'The pattern:'),
      [0, 1, 2, 0, 1, 2].flatMap((j, n) => [n ? el('span', { class: 'gv-arrow' }, '→') : null, sym(P.pattern[j], 'gv-leg-sym')]), el('span', { class: 'gv-arrow' }, '…'));
    const hintBtn = el('button', { class: 'helpbtn', onclick: hint }, svg(icons.bulb), 'Hint');
    const side = el('div', { class: 'grove-side' }, legend, msg, el('div', { class: 'row gap center' }, hintBtn));
    body.append(header('Pattern Path'), el('div', { class: 'grove-play' }, board, side));
    draw();

    function draw() {
      cells.forEach((c, i) => {
        const at = trail.indexOf(i);
        c.classList.toggle('on', at >= 0);
        c.classList.toggle('head', at === trail.length - 1);
      });
    }
    const touching = (a, b) => { const ax = a % P.W, ay = Math.floor(a / P.W), bx = b % P.W, by = Math.floor(b / P.W); return Math.abs(ax - bx) + Math.abs(ay - by) === 1; };
    function tap(i) {
      if (finished) return;
      const at = trail.indexOf(i);
      if (at >= 0) { if (at < trail.length - 1) { trail = trail.slice(0, at + 1); sfx.tap(); msg.textContent = 'Backed up. Try another way.'; draw(); } return; }
      const head = trail[trail.length - 1];
      const want = P.pattern[trail.length % 3];
      if (!touching(head, i)) { sfx.nope(); shake(cells[i]); msg.textContent = 'Pick a square that touches the end of your path.'; return; }
      if (P.grid[i] !== want) { sfx.nope(); shake(cells[i]); msg.textContent = `Look at the pattern. What comes after the ${NAMES[P.grid[head]]}?`; return; }
      trail.push(i); sfx.pick(); draw();
      if (i === P.end) { finished = true; board.classList.add('solved'); msg.textContent = 'You made it across the grove!'; solved('path', practice, side); }
      else msg.textContent = 'Keep going.';
    }
    function hint() {
      if (finished) return;
      sfx.tap();
      let good = 0;
      while (good < trail.length && trail[good] === P.path[good]) good++;
      const flash = (i) => { cells[i].classList.remove('flash'); void cells[i].offsetWidth; cells[i].classList.add('flash'); };
      if (good < trail.length) { flash(trail[good - 1]); msg.textContent = 'This way hits a dead end. Tap the flashing square to back up.'; }
      else { flash(P.path[good]); msg.textContent = 'Try this square next.'; }
    }
  }

  /* ===== Make a pattern for a grown-up ===== */
  function maker() {
    clear();
    const SLOTS = 8;
    const pal = ORDER.slice(0, 4);
    let row = [];
    const msg = el('p', { class: 'grove-msg' }, 'Build a pattern that repeats. Tap pictures to fill all 8 spots.');
    const strip = el('div', { class: 'gv-strip', style: { '--n': SLOTS } });
    const palette = el('div', { class: 'gv-choices' }, pal.map(k => el('button', { class: 'pal', 'aria-label': NAMES[k], onclick: () => { if (row.length < SLOTS) { row.push(k); sfx.pick(); draw(); } } }, sym(k, 'pal-sym'))),
      el('button', { class: 'pal erase', 'aria-label': 'Undo', onclick: () => { row.pop(); sfx.tap(); draw(); } }, '⌫'));
    const stage = el('div', { class: 'gv-stage' }, strip, msg, palette);
    body.append(header('Make a Pattern'), stage);
    draw();
    function draw() {
      strip.innerHTML = '';
      for (let i = 0; i < SLOTS; i++) {
        const full = i < row.length;
        strip.append(el('button', { class: 'gv-cell' + (full ? '' : ' empty'), onclick: () => { if (row.length === SLOTS) hide(i); } }, full ? sym(row[i], 'gv-sym') : ''));
      }
      msg.textContent = row.length === SLOTS ? 'Now tap the one picture you want to hide.' : 'Build a pattern that repeats. Tap pictures to fill all 8 spots.';
    }
    function hide(hidden) {
      clear();
      const answer = row[hidden];
      const cellEls = row.map((k, i) => el('div', { class: 'gv-cell' + (i === hidden ? ' blank sel' : '') }, i === hidden ? '?' : sym(k, 'gv-sym')));
      const msg2 = el('p', { class: 'grove-msg' }, 'Grown-up: which picture is hiding?');
      const choices = el('div', { class: 'gv-choices' }, pal.map(k => {
        const b = el('button', { class: 'pal', 'aria-label': NAMES[k], onclick: () => {
          if (k !== answer) { sfx.nope(); shake(b); msg2.textContent = 'That is not the one. Look at the pattern again.'; return; }
          sfx.good();
          cellEls[hidden].classList.remove('blank', 'sel'); cellEls[hidden].classList.add('fixed');
          cellEls[hidden].innerHTML = ''; cellEls[hidden].append(sym(k, 'gv-sym'));
          choices.classList.add('off');
          msg2.textContent = 'Found it! Ask the pattern maker to explain the rule.';
          stage2.append(el('div', { class: 'row gap center' },
            el('button', { class: 'bigbtn', onclick: () => { sfx.tap(); maker(); } }, 'Make another'),
            el('button', { class: 'bigbtn ghost', onclick: () => { sfx.tap(); showMenu(); } }, 'Puzzles')));
        } }, sym(k, 'pal-sym'));
        return b;
      }));
      const stage2 = el('div', { class: 'gv-stage' },
        el('div', { class: 'gv-handoff' }, 'Hand the tablet to a grown-up'),
        el('div', { class: 'gv-strip', style: { '--n': SLOTS } }, cellEls), msg2, choices);
      body.append(header('Make a Pattern'), stage2);
    }
  }

  /* ===== Grid ===== */
  function playGrid(practice) {
    const m = { n: 4, br: 2, bc: 2, givens: 6 };
    const { sol, puzzle } = makePuzzle(m.n, m.br, m.bc, m.givens, seedFor('sprout', practice));
    const symbols = ORDER.slice(0, m.n);
    const grid = puzzle.map(r => r.slice());
    const given = puzzle.map(r => r.map(v => v !== null));
    let sel = null;
    let finished = false;

    clear();
    const board = el('div', { class: `grove-board n${m.n}`, style: { '--n': m.n } });
    const cells = [];
    for (let r = 0; r < m.n; r++) for (let c = 0; c < m.n; c++) {
      const cell = el('button', {
        class: 'gcell' + (given[r][c] ? ' given' : '') + ((c + 1) % m.bc === 0 && c < m.n - 1 ? ' bR' : '') + ((r + 1) % m.br === 0 && r < m.n - 1 ? ' bB' : ''),
        'aria-label': `Row ${r + 1}, column ${c + 1}`,
        onclick: () => select(r, c),
      });
      cells.push(cell);
      board.append(cell);
    }
    const palette = el('div', { class: 'palette' }, symbols.map((k, v) =>
      el('button', { class: 'pal', 'aria-label': k, onclick: () => place(v) }, svg(SYMBOLS[k], 'pal-sym'))),
      el('button', { class: 'pal erase', 'aria-label': 'Erase', onclick: () => place(null) }, '✕'));
    const msg = el('p', { class: 'grove-msg' }, 'Every row, column, and thick box gets each picture one time. Tap a square, then tap a picture.');
    const hintBtn = el('button', { class: 'helpbtn', onclick: hint }, svg(icons.bulb), 'Hint');
    const side = el('div', { class: 'grove-side' }, msg, palette, el('div', { class: 'row gap center' }, hintBtn));
    body.append(header('Grid'), el('div', { class: 'grove-play' }, board, side));
    draw();

    function draw() {
      const conflicts = findConflicts();
      cells.forEach((cell, i) => {
        const r = Math.floor(i / m.n), c = i % m.n;
        const v = grid[r][c];
        cell.innerHTML = v === null ? '' : SYMBOLS[symbols[v]];
        cell.classList.toggle('sel', !!sel && sel[0] === r && sel[1] === c);
        cell.classList.toggle('peer', !!sel && !(sel[0] === r && sel[1] === c) && (sel[0] === r || sel[1] === c || (Math.floor(sel[0] / m.br) === Math.floor(r / m.br) && Math.floor(sel[1] / m.bc) === Math.floor(c / m.bc))));
        cell.classList.toggle('clash', conflicts.has(i));
      });
    }

    function findConflicts() {
      const bad = new Set();
      const groups = [];
      for (let i = 0; i < m.n; i++) {
        groups.push([...Array(m.n).keys()].map(j => [i, j]));
        groups.push([...Array(m.n).keys()].map(j => [j, i]));
      }
      for (let br = 0; br < m.n; br += m.br) for (let bc = 0; bc < m.n; bc += m.bc) {
        const g = [];
        for (let i = 0; i < m.br; i++) for (let j = 0; j < m.bc; j++) g.push([br + i, bc + j]);
        groups.push(g);
      }
      for (const g of groups) {
        const seen = {};
        for (const [r, c] of g) {
          const v = grid[r][c];
          if (v === null) continue;
          (seen[v] = seen[v] || []).push(r * m.n + c);
        }
        Object.values(seen).forEach(list => { if (list.length > 1) list.forEach(i => bad.add(i)); });
      }
      return bad;
    }

    function select(r, c) {
      if (finished) return;
      if (given[r][c]) { sfx.nope(); shake(cells[r * m.n + c]); return; }
      sfx.tap();
      sel = [r, c];
      draw();
    }

    function place(v) {
      if (finished) return;
      if (!sel) { msg.textContent = 'First tap an empty square.'; shake(board); return; }
      const [r, c] = sel;
      grid[r][c] = v;
      v === null ? sfx.tap() : sfx.pick();
      draw();
      if (v !== null && findConflicts().has(r * m.n + c)) msg.textContent = 'Two of the same in one line or box. Look again.';
      else msg.textContent = 'Nice. Keep going.';
      checkDone();
    }

    function checkDone() {
      for (let r = 0; r < m.n; r++) for (let c = 0; c < m.n; c++) if (grid[r][c] !== sol[r][c]) return;
      finished = true;
      sel = null;
      draw();
      board.classList.add('solved');
      msg.textContent = 'Every row, column, and box is right.';
      palette.classList.add('off');
      solved('grid', practice, side);
    }

    function hint() {
      if (finished) return;
      sfx.tap();
      for (let r = 0; r < m.n; r++) for (let c = 0; c < m.n; c++) {
        if (!given[r][c] && grid[r][c] !== null && grid[r][c] !== sol[r][c]) {
          flash(r, c); msg.textContent = 'Check this square again.'; return;
        }
      }
      let best = null;
      for (let r = 0; r < m.n && !best; r++) for (let c = 0; c < m.n && !best; c++) {
        if (grid[r][c] !== null) continue;
        if (candidates(r, c).length === 1) best = [r, c];
      }
      if (best) { flash(...best); sel = best; draw(); msg.textContent = 'Only one picture fits here. Which one?'; return; }
      for (let r = 0; r < m.n; r++) for (let c = 0; c < m.n; c++) {
        if (grid[r][c] === null) { grid[r][c] = sol[r][c]; draw(); flash(r, c); msg.textContent = 'Here’s one to get you going.'; checkDone(); return; }
      }
    }

    function candidates(r, c) {
      const used = new Set();
      for (let i = 0; i < m.n; i++) { used.add(grid[r][i]); used.add(grid[i][c]); }
      const r0 = r - (r % m.br), c0 = c - (c % m.bc);
      for (let i = 0; i < m.br; i++) for (let j = 0; j < m.bc; j++) used.add(grid[r0 + i][c0 + j]);
      return [...Array(m.n).keys()].filter(v => !used.has(v));
    }

    function flash(r, c) {
      const cell = cells[r * m.n + c];
      cell.classList.remove('flash'); void cell.offsetWidth; cell.classList.add('flash');
    }
  }
}
