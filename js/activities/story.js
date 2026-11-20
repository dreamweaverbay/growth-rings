// Trail Tales: read your way through an adventure. Obstacles are solved with math and logic.
import { el, svg, icons, shake, shuffle, randInt } from '../ui.js';
import { scene, prop, propIcon, stoneIcon, seasonIcon } from '../art.js';
import { STORIES, SUSPECTS, CLUE_TEXT } from '../data/stories.js';

const MAX_BY_LEVEL = [0, 6, 10, 14, 20, 30];

export function start(ctx) {
  const { body, store, sfx } = ctx;
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  showList();

  function showList() {
    body.innerHTML = '';
    const s = store.get();
    body.append(
      el('p', { class: 'act-lead' }, 'Pick a trail. Read the words, solve the problems, and see where it goes.'),
      el('div', { class: 'tale-list' }, STORIES.map(st =>
        el('button', { class: 'tale-card', onclick: () => { sfx.pick(); play(st); } },
          svg(scene(st.cover), 'tale-cover'),
          el('div', { class: 'tale-card-foot' },
            el('span', { class: 'tale-card-title' }, st.title),
            s.story.finished[st.id] ? el('span', { class: 'tale-done' }, svg(icons.check), `Done ${s.story.finished[st.id]}×`) : null)))),
    );
  }

  function play(story) {
    const vars = {};
    let pageId = 'start';
    let pageNo = 0;
    render();

    function go(next) {
      pageId = next; pageNo++;
      sfx.whoosh();
      render();
    }

    function render() {
      timers.forEach(clearTimeout); timers = [];
      const page = story.pages[pageId];
      if (page.set) Object.assign(vars, page.set);
      body.innerHTML = '';
      const sceneBox = el('div', { class: 'tale-scene' });
      const panel = el('div', { class: 'tale-panel' });
      body.append(el('div', { class: 'tale' },
        el('div', { class: 'tale-head' }, el('span', { class: 'tale-title' }, story.title), el('span', { class: 'tale-page' }, `Page ${pageNo + 1}`)),
        sceneBox, panel));

      const textOf = t => (typeof t === 'function' ? t(vars) : t);
      let extra = '';
      if (page.culpritProp && vars.culpritProp) {
        const [x, y, sc] = page.culpritProp;
        extra = prop(vars.culpritProp, x, y, sc, true);
      }
      if (page.scene) sceneBox.innerHTML = scene(page.scene, extra);

      if (page.math) return mathPage(page, sceneBox, panel);
      if (page.count) return countPage(page, sceneBox, panel);
      if (page.rings) return ringsPage(page, sceneBox, panel);
      if (page.logic) return logicPage(page, sceneBox, panel);
      if (page.mystery) return mysteryPage(page, sceneBox, panel);

      panel.append(el('p', { class: 'tale-text' }, textOf(page.text)));
      if (page.choices) {
        panel.append(el('div', { class: 'tale-choices' }, page.choices.map(c =>
          el('button', { class: 'choice', onclick: () => { sfx.pick(); go(c.to); } },
            svg(propIcon(c.icon), 'choice-icon'), el('span', {}, c.label)))));
      } else if (page.end) {
        panel.append(el('div', { class: 'tale-actions' }, el('button', { class: 'bigbtn', onclick: () => {
          store.update(s => { s.story.finished[story.id] = (s.story.finished[story.id] || 0) + 1; });
          ctx.finish({ title: 'The End!', line: `You finished “${story.title}.”`, grownPrompt: story.grown, note: story.id, againLabel: 'Another trail', onAgain: showList });
        } }, 'The End')));
      } else {
        panel.append(nextButton(page.button || 'Next', () => go(page.next)));
      }
    }

    function nextButton(label, fn) {
      return el('div', { class: 'tale-actions' }, el('button', { class: 'bigbtn', onclick: () => { sfx.tap(); fn(); } }, label, svg(icons.next)));
    }

    /* ---------- math ---------- */
    function genNumbers(type) {
      const lvl = store.get().story.level;
      const max = MAX_BY_LEVEL[lvl];
      if (type === 'join') { const a = randInt(1, max - 1); const b = randInt(1, max - a); return { a, b, ans: a + b }; }
      if (type === 'leave') { const a = randInt(Math.min(3, max), max); const b = randInt(1, a - 1); return { a, b, ans: a - b }; }
      const c = randInt(Math.min(4, max), max); const a = randInt(1, c - 1); return { c, a, ans: c - a };
    }

    function options(ans) {
      const pool = new Set();
      const cands = [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3, ans + 10, ans - 10].filter(n => n >= 0 && n !== ans);
      for (const n of shuffle(cands.slice(0, 5))) { if (pool.size < 3) pool.add(n); }
      return shuffle([ans, ...pool]);
    }

    function counters(type, n) {
      const cells = [];
      if (type === 'join') {
        for (let i = 0; i < n.a; i++) cells.push('a');
        for (let i = 0; i < n.b; i++) cells.push('b');
      } else if (type === 'leave') {
        for (let i = 0; i < n.a - n.b; i++) cells.push('a');
        for (let i = 0; i < n.b; i++) cells.push('x');
      } else {
        for (let i = 0; i < n.a; i++) cells.push('a');
        for (let i = 0; i < n.c - n.a; i++) cells.push('e');
      }
      const frames = [];
      for (let i = 0; i < cells.length; i += 10) {
        const chunk = cells.slice(i, i + 10);
        while (chunk.length < 10) chunk.push('none');
        frames.push(el('div', { class: 'tenframe' }, chunk.map(k => el('span', { class: 'cell ' + k }))));
      }
      return el('div', { class: 'counters' }, frames);
    }

    function mathPage(page, sceneBox, panel) {
      const m = page.math;
      const n = genNumbers(m.type);
      let tries = 0;
      if (m.show && n.a <= 20) {
        const { prop: pr, x1, x2, y, s: sc, perRow, dy } = m.show;
        let items = '';
        for (let i = 0; i < n.a; i++) {
          const row = Math.floor(i / perRow);
          const inRow = Math.min(perRow, n.a - row * perRow);
          const k = i % perRow;
          const x = inRow === 1 ? (x1 + x2) / 2 : x1 + (x2 - x1) * (k / (inRow - 1));
          items += prop(pr, x.toFixed(1), y + row * dy + (k % 2 ? 3 : 0), sc, k % 2 === 1);
        }
        sceneBox.innerHTML = scene(page.scene, items);
      }
      panel.append(el('p', { class: 'tale-text' }, m.text(n, vars)));
      const helpBox = el('div', { class: 'help-box' });
      const opts = el('div', { class: 'answers' });
      const helpBtn = el('button', { class: 'helpbtn', onclick: () => { sfx.tap(); showHelp(); } }, svg(icons.bulb), 'Show me');
      const showHelp = () => { if (!helpBox.firstChild) helpBox.append(counters(m.type, n)); helpBtn.remove(); };
      options(n.ans).forEach(v => {
        const b = el('button', { class: 'answer', onclick: () => {
          if (v === n.ans) {
            sfx.good();
            b.classList.add('right');
            opts.querySelectorAll('button').forEach(x => { x.disabled = true; });
            adjustLevel(tries);
            helpBtn.remove();
            panel.append(nextButton(page.button || 'Next', () => go(page.next)));
          } else {
            tries++;
            sfx.nope();
            b.classList.add('wrong'); b.disabled = true;
            shake(opts);
            if (tries === 1) showHelp();
          }
        } }, String(v));
        opts.append(b);
      });
      panel.append(el('div', { class: 'answer-row' }, opts, helpBtn), helpBox);
    }

    function adjustLevel(tries) {
      store.update(s => {
        const st = s.story;
        if (tries === 0) {
          st.streak = (st.streak || 0) + 1;
          if (st.streak >= 3 && st.level < 5) { st.level++; st.streak = 0; }
        } else if (tries >= 2) {
          st.streak = 0;
          if (st.level > 1) st.level--;
        } else {
          st.streak = 0;
        }
      });
    }

    /* ---------- counting fireflies ---------- */
    function countPage(page, sceneBox, panel) {
      const lvl = store.get().story.level;
      const ranges = [null, [3, 5], [4, 7], [5, 9], [6, 11], [7, 12]];
      const total = randInt(...ranges[lvl]);
      const spots = [];
      while (spots.length < total) {
        const x = randInt(30, 370), y = randInt(30, 140);
        if (spots.every(([sx, sy]) => Math.hypot(sx - x, sy - y) > 34)) spots.push([x, y]);
      }
      const flies = spots.map(([x, y], i) => `<g class="fly" data-i="${i}" transform="translate(${x} ${y})"><circle r="16" fill="transparent"/><circle class="fly-glow" r="9" fill="#ffe27a" opacity=".25"/><circle class="fly-dot" r="3.5" fill="#d9d29a"/></g>`).join('');
      sceneBox.innerHTML = scene(page.scene, flies);
      const counter = el('div', { class: 'count-badge' }, '0');
      panel.append(el('p', { class: 'tale-text' }, page.count.text), counter);
      let lit = 0;
      sceneBox.querySelectorAll('.fly').forEach(g => {
        g.addEventListener('pointerdown', () => {
          if (g.classList.contains('lit')) return;
          g.classList.add('lit');
          lit++;
          counter.textContent = String(lit);
          counter.classList.remove('bump'); void counter.offsetWidth; counter.classList.add('bump');
          sfx.spark();
          if (lit === total) later(() => afterCount(), 400);
        });
      });
      function afterCount() {
        sfx.good();
        panel.append(el('p', { class: 'tale-text strong' }, `You counted ${total} fireflies!`));
        if (lvl >= 3) {
          const k = randInt(1, total - 1);
          const q = el('p', { class: 'tale-text' }, `Then ${k} fireflies fly away. How many are still here?`);
          const opts = el('div', { class: 'answers' });
          options(total - k).forEach(v => {
            const b = el('button', { class: 'answer', onclick: () => {
              if (v === total - k) { sfx.good(); b.classList.add('right'); opts.querySelectorAll('button').forEach(x => { x.disabled = true; }); panel.append(nextButton('Next', () => go(page.next))); }
              else { sfx.nope(); b.classList.add('wrong'); b.disabled = true; shake(opts); }
            } }, String(v));
            opts.append(b);
          });
          panel.append(q, opts);
        } else {
          panel.append(nextButton('Next', () => go(page.next)));
        }
      }
    }

    /* ---------- counting tree rings ---------- */
    function ringsPage(page, sceneBox, panel) {
      const lvl = store.get().story.level;
      const ranges = [null, [4, 6], [5, 8], [6, 10], [7, 12], [8, 14]];
      const total = randInt(...ranges[lvl]);
      const cx = 200, cy = 108, maxR = 84;
      let shapes = `<rect width="400" height="220" fill="#93c06d"/><ellipse cx="${cx}" cy="${cy + 6}" rx="${maxR + 22}" ry="${maxR + 18}" fill="#5b3a22"/>`;
      shapes += `<circle cx="${cx}" cy="${cy}" r="${maxR + 4}" fill="#8a5a33"/>`;
      // rings from outermost to innermost so inner ones sit on top
      const step = maxR / total;
      for (let i = total; i >= 1; i--) {
        const r = i * step;
        shapes += `<circle class="tree-ring" data-i="${i}" cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="${i % 2 ? '#ecd3a4' : '#e2c08c'}" stroke="#a8743f" stroke-width="2"/>`;
      }
      shapes += `<circle cx="${cx}" cy="${cy}" r="3" fill="#7a4a24"/>`;
      sceneBox.innerHTML = `<svg class="scene" viewBox="0 0 400 220">${shapes}</svg>`;
      const counter = el('div', { class: 'count-badge' }, '0');
      panel.append(el('p', { class: 'tale-text' }, page.rings.text), counter);
      let count = 0;
      const tapped = new Set();
      sceneBox.querySelectorAll('.tree-ring').forEach(c => {
        c.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          const i = c.dataset.i;
          if (tapped.has(i)) return;
          tapped.add(i);
          c.classList.add('lit');
          count++;
          counter.textContent = String(count);
          counter.classList.remove('bump'); void counter.offsetWidth; counter.classList.add('bump');
          sfx.knock();
          if (count === total) later(() => {
            vars.age = total;
            sfx.good();
            panel.append(el('p', { class: 'tale-text strong' }, `${total} rings! The oak was ${total} years old.`), nextButton('Next', () => go(page.next)));
          }, 350);
        });
      });
    }

    /* ---------- logic ---------- */
    function logicPage(page, sceneBox, panel) {
      const kind = page.logic.kind;
      let q, choices, correct, onRight;
      if (kind === 'notHere') {
        const places = shuffle([
          { p: 'hollowlog', name: 'log', prep: 'in' },
          { p: 'bush', name: 'bush', prep: 'in' },
          { p: 'rock', name: 'rock', prep: 'by' },
          { p: 'stump', name: 'stump', prep: 'by' },
        ]).slice(0, 3);
        const ans = places[2];
        const [A, B] = places;
        q = `Hoot saw the lantern. “It is not ${A.prep} the ${A.name},” says Hoot. “It is not ${B.prep} the ${B.name}.” Where is the lantern?`;
        choices = shuffle(places).map(pl => ({ key: pl.p, icon: propIcon(pl.p), label: `The ${pl.name}` }));
        correct = ans.p;
      } else if (kind === 'pattern') {
        const lvl = store.get().story.level;
        const kinds = shuffle(['round', 'flat', 'pebble']);
        const patterns = lvl >= 3 ? [[0, 1], [0, 0, 1], [0, 1, 1], [0, 1, 2]] : [[0, 1], [0, 0, 1], [0, 1, 1]];
        const pat = patterns[randInt(0, patterns.length - 1)];
        const len = pat.length === 2 ? 5 : pat.length === 3 ? 6 : 6;
        const seq = Array.from({ length: len }, (_, i) => kinds[pat[i % pat.length]]);
        const ans = kinds[pat[len % pat.length]];
        q = 'Bev sets stones in a row to hold up the bridge. Which stone comes next?';
        const row = el('div', { class: 'pattern-row' }, seq.map(k => svg(stoneIcon(k), 'stone')), el('span', { class: 'stone q' }, '?'));
        panel.append(el('p', { class: 'tale-text' }, q), row);
        q = null;
        choices = kinds.map(k => ({ key: k, icon: stoneIcon(k), label: '' }));
        correct = ans;
        onRight = () => { row.querySelector('.q').replaceWith(svg(stoneIcon(ans), 'stone pop')); };
      } else if (kind === 'lightest') {
        const lvl = store.get().story.level;
        const hi = lvl <= 2 ? 10 : 25;
        const nums = shuffle(Array.from({ length: hi }, (_, i) => i + 1)).slice(0, 3);
        const animals = [['mole', 'Mo'], ['fox', 'Pip'], ['goat', 'Gus']];
        q = 'The bridge is brand new. The lightest friend should cross first. Who is the lightest?';
        choices = animals.map(([p, name], i) => ({ key: p, icon: propIcon(p), label: `${name} weighs ${nums[i]}` }));
        correct = animals[nums.indexOf(Math.min(...nums))][0];
      } else if (kind === 'season') {
        const seasons = ['spring', 'summer', 'fall', 'winter'];
        const i = randInt(0, 3);
        const ans = seasons[(i + 1) % 4];
        const others = seasons.filter((s, j) => j !== i && s !== ans);
        q = `Hoot must build her nest before the cold comes. What season comes after ${seasons[i]}?`;
        choices = shuffle([ans, ...shuffle(others).slice(0, 2)]).map(s => ({ key: s, icon: seasonIcon(s), label: s[0].toUpperCase() + s.slice(1) }));
        correct = ans;
      }
      if (q) panel.append(el('p', { class: 'tale-text' }, q));
      const grid = el('div', { class: 'pick-grid' });
      choices.forEach(c => {
        const b = el('button', { class: 'pick', onclick: () => {
          if (c.key === correct) {
            sfx.good(); b.classList.add('right');
            grid.querySelectorAll('button').forEach(x => { x.disabled = true; });
            if (onRight) onRight();
            if (kind === 'notHere') b.append(svg(propIcon('lantern', true), 'pick-badge pop'));
            panel.append(nextButton('Next', () => go(page.next)));
          } else {
            sfx.nope(); b.classList.add('wrong'); b.disabled = true; shake(grid);
          }
        } }, svg(c.icon, 'pick-icon'), c.label ? el('span', {}, c.label) : null);
        grid.append(b);
      });
      panel.append(grid);
    }

    /* ---------- mystery ---------- */
    function mysteryPage(page, sceneBox, panel) {
      const culprit = SUSPECTS[randInt(0, SUSPECTS.length - 1)];
      // Build clues that narrow the four down to one.
      let remaining = SUSPECTS.slice();
      const clues = [];
      const traits = shuffle(Object.keys(CLUE_TEXT));
      for (const t of traits) {
        if (remaining.length === 1) break;
        const v = culprit.traits[t];
        const out = remaining.filter(s => s.traits[t] !== v);
        if (!out.length) continue;
        clues.push({ text: CLUE_TEXT[t][v ? 0 : 1], out: out.map(s => s.id) });
        remaining = remaining.filter(s => s.traits[t] === v);
      }
      sceneBox.innerHTML = '';
      sceneBox.classList.add('mystery-board');
      const crossed = new Set();
      const cards = {};
      const board = el('div', { class: 'suspects' }, SUSPECTS.map(s => {
        const c = el('button', { class: 'suspect', onclick: () => tap(s) }, svg(propIcon(s.prop), 'suspect-icon'), el('span', {}, s.name));
        cards[s.id] = c;
        return c;
      }));
      sceneBox.append(board);
      const clueBox = el('div', { class: 'clue-box' });
      const hint = el('p', { class: 'tale-hint' }, 'Read the clue. Tap each friend it can NOT be.');
      panel.append(clueBox, hint);
      let ci = 0;
      showClue();
      function showClue() {
        clueBox.append(el('p', { class: 'clue pop' }, el('strong', {}, `Clue ${ci + 1}: `), clues[ci].text));
      }
      function tap(s) {
        if (crossed.has(s.id) || ci >= clues.length) return;
        if (clues[ci].out.includes(s.id)) {
          crossed.add(s.id);
          cards[s.id].classList.add('out');
          sfx.knock();
          if (clues[ci].out.every(id => crossed.has(id))) {
            ci++;
            if (ci < clues.length) { sfx.good(); later(showClue, 300); }
            else later(reveal, 400);
          }
        } else {
          sfx.nope();
          shake(cards[s.id]);
          hint.textContent = `It could still be ${s.name}. Read the clue again.`;
        }
      }
      function reveal() {
        sfx.tada();
        cards[culprit.id].classList.add('caught');
        hint.remove();
        vars.culprit = culprit.name;
        vars.culpritProp = culprit.prop;
        panel.append(el('p', { class: 'tale-text strong' }, `It was ${culprit.name}! You solved it.`), nextButton('Next', () => go(page.next)));
      }
    }
  }

  return () => { timers.forEach(clearTimeout); };
}
