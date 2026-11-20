// Trail Tales: read your way through an adventure. Obstacles are solved with math and logic.
// Every picture is drawn from the same numbers as the sentence beside it.
import { el, svg, icons, shake, shuffle, randInt } from '../ui.js';
import { scene, propIcon } from '../art.js';
import { STORIES, SUSPECTS } from '../data/stories.js';

export function start(ctx) {
  const { body, store, sfx } = ctx;
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const level = () => store.get().story.level;

  showList();

  function showList() {
    timers.forEach(clearTimeout); timers = [];
    body.innerHTML = '';
    const st = store.get();
    body.append(
      el('p', { class: 'act-lead' }, 'Pick a trail. Read the words, solve the problems, and see where it goes.'),
      el('div', { class: 'tale-list' }, STORIES.map(story =>
        el('button', { class: 'tale-card', onclick: () => { sfx.pick(); play(story); } },
          svg(story.cover(), 'tale-cover'),
          el('div', { class: 'tale-card-foot' },
            el('span', { class: 'tale-card-title' }, story.title),
            st.story.finished[story.id] ? el('span', { class: 'tale-done' }, svg(icons.check), `Read ${st.story.finished[story.id]}×`) : null)))),
    );
  }

  function play(story) {
    const v = {};
    story.init(v, level());
    let pageId = 'start';
    let pageNo = 0;
    render();

    function go(next) { pageId = next; pageNo++; sfx.whoosh(); render(); }

    function nextButton(label, fn) {
      return el('div', { class: 'tale-actions' }, el('button', { class: 'bigbtn', onclick: () => { sfx.tap(); fn(); } }, label, svg(icons.next)));
    }

    function render() {
      timers.forEach(clearTimeout); timers = [];
      const page = story.pages[pageId];
      if (page.setup) page.setup(v, level());
      body.innerHTML = '';
      const sceneBox = el('div', { class: 'tale-scene' });
      const panel = el('div', { class: 'tale-panel' });
      body.append(el('div', { class: 'tale' },
        el('div', { class: 'tale-head' }, el('span', { class: 'tale-title' }, story.title), el('span', { class: 'tale-page' }, `Page ${pageNo + 1}`)),
        sceneBox, panel));
      const draw = (state) => { sceneBox.innerHTML = page.scene(v, state); };
      const finishPage = () => {
        if (page.doneText) panel.append(el('p', { class: 'tale-text strong' }, page.doneText(v)));
        panel.append(nextButton('Next', () => go(page.next)));
      };

      switch (page.type) {
        case 'math': return mathPage(page, draw, panel, finishPage);
        case 'count': return countPage(page, sceneBox, panel, finishPage);
        case 'rings': return ringsPage(page, sceneBox, panel, finishPage);
        case 'pick': return pickPage(page, draw, panel, finishPage);
        case 'place': return placePage(page, sceneBox, panel, finishPage);
        case 'mystery': return mysteryPage(page, sceneBox, panel);
        default: break;
      }

      draw(false);
      panel.append(el('p', { class: 'tale-text' }, page.text(v)));
      if (page.type === 'choices') {
        panel.append(el('div', { class: 'tale-choices' }, page.choices.map(c =>
          el('button', { class: 'choice', onclick: () => { sfx.pick(); go(c.to); } }, svg(propIcon(c.icon), 'choice-icon'), el('span', {}, c.label)))));
      } else if (page.end) {
        panel.append(el('div', { class: 'tale-actions' }, el('button', { class: 'bigbtn', onclick: () => {
          store.update(s => { s.story.finished[story.id] = (s.story.finished[story.id] || 0) + 1; });
          ctx.finish({ title: 'The End!', line: `You read “${story.title}.”`, grownPrompt: story.grown, note: story.id, againLabel: 'Another trail', onAgain: showList });
        } }, 'The End')));
      } else {
        panel.append(nextButton(page.button || 'Next', () => go(page.next)));
      }
    }

    /* ---------- math ---------- */
    function options(ans) {
      const cands = shuffle([ans + 1, ans - 1, ans + 2, ans - 2, ans + 3].filter(n => n >= 0));
      return shuffle([ans, ...cands.slice(0, 3)]);
    }

    function tenFrames({ type, a, b, c }) {
      const cells = [];
      if (type === 'join') { for (let i = 0; i < a; i++) cells.push('a'); for (let i = 0; i < b; i++) cells.push('b'); }
      else if (type === 'leave') { for (let i = 0; i < a - b; i++) cells.push('a'); for (let i = 0; i < b; i++) cells.push('x'); }
      else { for (let i = 0; i < a; i++) cells.push('a'); for (let i = 0; i < c - a; i++) cells.push('e'); }
      const frames = [];
      for (let i = 0; i < cells.length; i += 10) {
        const chunk = cells.slice(i, i + 10);
        while (chunk.length < 10) chunk.push('none');
        frames.push(el('div', { class: 'tenframe' }, chunk.map(k => el('span', { class: 'cell ' + k }))));
      }
      return el('div', { class: 'counters' }, frames);
    }

    function mathPage(page, draw, panel, finishPage) {
      draw(false);
      const ans = page.answer(v);
      let tries = 0;
      panel.append(el('p', { class: 'tale-text' }, page.text(v)));
      const helpBox = el('div', { class: 'help-box' });
      const opts = el('div', { class: 'answers' });
      const helpBtn = el('button', { class: 'helpbtn', onclick: () => { sfx.tap(); showHelp(); } }, svg(icons.bulb), 'Show me');
      const showHelp = () => { if (!helpBox.firstChild) helpBox.append(tenFrames(page.frames(v))); helpBtn.remove(); };
      options(ans).forEach(n => {
        const b = el('button', { class: 'answer', onclick: () => {
          if (n === ans) {
            sfx.good();
            b.classList.add('right');
            opts.querySelectorAll('button').forEach(x => { x.disabled = true; });
            adjustLevel(tries);
            helpBtn.remove();
            draw(true);
            finishPage();
          } else {
            tries++;
            sfx.nope();
            b.classList.add('wrong'); b.disabled = true;
            shake(opts);
            if (tries === 1) showHelp();
          }
        } }, String(n));
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
        } else st.streak = 0;
      });
    }

    function counterBadge() { return el('div', { class: 'count-badge' }, '0'); }
    function bump(counter, n) {
      counter.textContent = String(n);
      counter.classList.remove('bump'); void counter.offsetWidth; counter.classList.add('bump');
    }

    /* ---------- counting fireflies ---------- */
    function countPage(page, sceneBox, panel, finishPage) {
      const total = v.flies;
      const spots = [];
      let guard = 0;
      while (spots.length < total && guard++ < 2000) {
        const x = randInt(30, 300), y = randInt(26, 128);
        if (spots.every(([sx, sy]) => Math.hypot(sx - x, sy - y) > 36)) spots.push([x, y]);
      }
      const flies = spots.map(([x, y]) => `<g class="fly" transform="translate(${x} ${y})"><circle r="17" fill="transparent"/><circle class="fly-glow" r="9" fill="#ffe27a" opacity=".25"/><circle class="fly-dot" r="3.5" fill="#d9d29a"/></g>`).join('');
      sceneBox.innerHTML = scene(page.scene(v), flies);
      const counter = counterBadge();
      panel.append(el('p', { class: 'tale-text' }, page.text(v)), counter);
      let lit = 0;
      sceneBox.querySelectorAll('.fly').forEach(g => {
        g.addEventListener('pointerdown', () => {
          if (g.classList.contains('lit')) return;
          g.classList.add('lit');
          bump(counter, ++lit);
          sfx.spark();
          if (lit === total) later(() => { sfx.good(); finishPage(); }, 400);
        });
      });
    }

    /* ---------- counting tree rings ---------- */
    function ringsPage(page, sceneBox, panel, finishPage) {
      const total = v.age;
      const cx = 200, cy = 108, maxR = 84;
      let shapes = `<rect width="400" height="220" fill="#93c06d"/><ellipse cx="${cx}" cy="${cy + 5}" rx="${maxR + 18}" ry="${maxR + 15}" fill="#5b3a22"/><circle cx="${cx}" cy="${cy}" r="${maxR + 4}" fill="#8a5a33"/>`;
      const step = maxR / total;
      for (let i = total; i >= 1; i--) shapes += `<circle class="tree-ring" data-i="${i}" cx="${cx}" cy="${cy}" r="${(i * step).toFixed(1)}" fill="${i % 2 ? '#ecd3a4' : '#e2c08c'}" stroke="#a8743f" stroke-width="2"/>`;
      shapes += `<circle cx="${cx}" cy="${cy}" r="2.5" fill="#7a4a24" pointer-events="none"/>`;
      sceneBox.innerHTML = `<svg class="scene" viewBox="0 0 400 220">${shapes}</svg>`;
      const counter = counterBadge();
      panel.append(el('p', { class: 'tale-text' }, page.text(v)), counter);
      let count = 0;
      sceneBox.querySelectorAll('.tree-ring').forEach(c => {
        c.addEventListener('pointerdown', () => {
          if (c.classList.contains('lit')) return;
          c.classList.add('lit');
          bump(counter, ++count);
          sfx.knock();
          if (count === total) later(() => { sfx.good(); finishPage(); }, 350);
        });
      });
    }

    /* ---------- tap to place (bridge logs) ---------- */
    function placePage(page, sceneBox, panel, finishPage) {
      const counter = counterBadge();
      panel.append(el('p', { class: 'tale-text' }, page.text(v)), counter);
      const draw = () => {
        sceneBox.innerHTML = page.scene(v);
        sceneBox.querySelectorAll('.slot').forEach(slot => slot.addEventListener('pointerdown', () => {
          if (page.done(v)) return;
          v.placed++;
          bump(counter, v.placed);
          sfx.knock();
          draw();
          if (page.done(v)) later(() => { sfx.good(); finishPage(); }, 350);
        }));
      };
      draw();
    }

    /* ---------- pick one ---------- */
    function pickPage(page, draw, panel, finishPage) {
      draw(false);
      panel.append(el('p', { class: 'tale-text' }, page.text(v)));
      const correct = page.correct(v);
      const grid = el('div', { class: 'pick-grid' });
      page.options(v).forEach(c => {
        const b = el('button', { class: 'pick', onclick: () => {
          if (c.key === correct) {
            sfx.good(); b.classList.add('right');
            grid.querySelectorAll('button').forEach(x => { x.disabled = true; });
            draw(true);
            finishPage();
          } else { sfx.nope(); b.classList.add('wrong'); b.disabled = true; shake(grid); }
        } }, svg(c.icon, 'pick-icon'), el('span', {}, c.label));
        grid.append(b);
      });
      panel.append(grid);
    }

    /* ---------- mystery ---------- */
    function mysteryPage(page, sceneBox, panel) {
      const culprit = SUSPECTS[randInt(0, SUSPECTS.length - 1)];
      const clues = shuffle(SUSPECTS.filter(sp => sp !== culprit)).map(sp => ({ text: sp.clue, out: sp.id }));
      sceneBox.classList.add('mystery-board');
      const cards = {};
      sceneBox.append(el('div', { class: 'suspects' }, SUSPECTS.map(sp => {
        const c = el('button', { class: 'suspect', onclick: () => tap(sp) }, svg(propIcon(sp.prop), 'suspect-icon'), el('span', {}, sp.name));
        cards[sp.id] = c;
        return c;
      })));
      const clueBox = el('div', { class: 'clue-box' });
      const hint = el('p', { class: 'tale-hint' }, 'Read the clue. Tap the friend it can NOT be.');
      panel.append(clueBox, hint);
      let ci = 0;
      const crossed = new Set();
      const showClue = () => clueBox.append(el('p', { class: 'clue pop' }, el('strong', {}, `Clue ${ci + 1}: `), clues[ci].text));
      showClue();
      function tap(sp) {
        if (crossed.has(sp.id) || ci >= clues.length) return;
        if (clues[ci].out === sp.id) {
          crossed.add(sp.id);
          cards[sp.id].classList.add('out');
          sfx.knock();
          ci++;
          hint.textContent = 'Read the clue. Tap the friend it can NOT be.';
          if (ci < clues.length) later(showClue, 300); else later(reveal, 400);
        } else {
          sfx.nope();
          shake(cards[sp.id]);
          hint.textContent = `It could still be ${sp.name}. Read the clue again.`;
        }
      }
      function reveal() {
        sfx.tada();
        cards[culprit.id].classList.add('caught');
        hint.remove();
        v.culprit = culprit.name;
        v.culpritProp = culprit.prop;
        panel.append(el('p', { class: 'tale-text strong' }, `It was ${culprit.name}! You solved it.`), nextButton('Next', () => go(page.next)));
      }
    }
  }

  return () => { timers.forEach(clearTimeout); };
}
