// Grove Grid: a daily picture logic puzzle. Each row, column, and box holds each picture once.
import { el, svg, icons, shake, shuffle, seededRandom, toast } from '../ui.js';

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

/* ---------- activity ---------- */

const MODES = {
  sprout: { n: 4, br: 2, bc: 2, givens: 6, label: 'Sprout', size: '4 × 4', blurb: 'Today’s puzzle' },
  oak: { n: 6, br: 2, bc: 3, givens: 14, label: 'Oak', size: '6 × 6', blurb: 'Solve it together with a grown-up' },
};

export function start(ctx) {
  const { body, store, sfx } = ctx;
  const today = store.todayKey();
  showMenu();

  function solvedKey(mode) { return mode === 'sprout' ? today : today + ':oak'; }

  function showMenu() {
    body.innerHTML = '';
    const s = store.get();
    const card = (mode) => {
      const m = MODES[mode];
      const done = s.grove.solved[solvedKey(mode)];
      return el('button', { class: 'grove-card ' + mode, onclick: () => { sfx.pick(); play(mode, false); } },
        el('div', { class: 'grove-mini' }, ORDER.slice(0, m.n === 4 ? 4 : 6).map(k => svg(SYMBOLS[k], 'mini-sym'))),
        el('div', { class: 'grove-card-text' },
          el('span', { class: 'grove-card-title' }, `${m.label} `, el('small', {}, m.size)),
          el('span', { class: 'muted' }, m.blurb),
          done ? el('span', { class: 'tale-done' }, svg(icons.check), 'Solved today') : null));
    };
    body.append(
      el('div', { class: 'grove-rule' },
        el('div', { class: 'rule-demo' }, ORDER.slice(0, 4).map(k => svg(SYMBOLS[k], 'rule-sym'))),
        el('p', {}, 'Every row, every column, and every thick box gets each picture one time.')),
      el('div', { class: 'grove-menu' }, card('sprout'), card('oak')),
    );
    if (s.grove.solved[today]) body.append(el('div', { class: 'center-row' }, el('button', { class: 'smallbtn', onclick: () => { sfx.tap(); play('sprout', true); } }, 'Extra practice puzzle')));
  }

  function play(mode, practice) {
    const m = MODES[mode];
    const seed = practice ? 'practice-' + Date.now() : 'grove-' + mode + '-' + today;
    const rnd = seededRandom(seed);
    const { sol, puzzle } = makePuzzle(m.n, m.br, m.bc, m.givens, rnd);
    const symbols = ORDER.slice(0, m.n);
    const grid = puzzle.map(r => r.slice());
    const given = puzzle.map(r => r.map(v => v !== null));
    let sel = null;
    let finished = false;

    body.innerHTML = '';
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
    const msg = el('p', { class: 'grove-msg' }, practice ? 'Practice puzzle' : (mode === 'oak' ? 'Grown-up and kid: take turns placing pictures.' : 'Tap a square, then tap a picture.'));
    const hintBtn = el('button', { class: 'helpbtn', onclick: hint }, svg(icons.bulb), 'Hint');
    body.append(el('div', { class: 'grove-play' }, board, el('div', { class: 'grove-side' }, msg, palette, el('div', { class: 'row gap center' }, hintBtn))));
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
      if (v !== null && findConflicts().has(r * m.n + c)) { msg.textContent = 'Two of the same in one line or box. Look again.'; }
      else msg.textContent = mode === 'oak' ? 'Grown-up and kid: take turns placing pictures.' : 'Nice. Keep going.';
      checkDone();
    }

    function checkDone() {
      for (let r = 0; r < m.n; r++) for (let c = 0; c < m.n; c++) if (grid[r][c] !== sol[r][c]) return;
      finished = true;
      sel = null;
      draw();
      board.classList.add('solved');
      if (practice) {
        sfx.good();
        msg.textContent = 'Solved! Practice puzzles don’t add to your ring, but they make you sharper.';
        body.querySelector('.grove-side').append(el('div', { class: 'row gap center' },
          el('button', { class: 'bigbtn', onclick: () => play('sprout', true) }, 'Another'),
          el('button', { class: 'bigbtn ghost', onclick: showMenu }, 'Done')));
        return;
      }
      const already = store.get().grove.solved[solvedKey(mode)];
      store.update(s => { s.grove.solved[solvedKey(mode)] = true; });
      if (already) {
        sfx.good();
        toast('Solved again!');
        setTimeout(showMenu, 1200);
        return;
      }
      setTimeout(() => ctx.finish({
        title: 'Puzzle solved!',
        line: mode === 'oak' ? 'You cracked the big 6 × 6 grid.' : 'Every row, column, and box is right.',
        grownPrompt: mode === 'oak' ? 'Tell each other one smart move you made.' : 'Show a grown-up how you figured out one square.',
        note: mode,
        againLabel: 'Puzzle menu',
        onAgain: showMenu,
      }), 700);
    }

    function hint() {
      if (finished) return;
      sfx.tap();
      // First, point out a wrong picture if there is one.
      for (let r = 0; r < m.n; r++) for (let c = 0; c < m.n; c++) {
        if (!given[r][c] && grid[r][c] !== null && grid[r][c] !== sol[r][c]) {
          flash(r, c); msg.textContent = 'Check this square again.'; return;
        }
      }
      // Then find a square where only one picture can fit.
      let best = null;
      for (let r = 0; r < m.n && !best; r++) for (let c = 0; c < m.n && !best; c++) {
        if (grid[r][c] !== null) continue;
        const cands = candidates(r, c);
        if (cands.length === 1) best = [r, c];
      }
      if (best) { flash(...best); sel = best; draw(); msg.textContent = 'Only one picture fits here. Which one?'; return; }
      // Otherwise, fill one square in.
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
