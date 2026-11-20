// Field Guide: questions, picture puzzles, put-in-order, and sorting. Every fact he finds is kept in his guide.
import { el, svg, icons, shake, shuffle } from '../ui.js';
import { CHOICE, ORDER, SORT, IDENT, TOPICS } from '../data/facts.js';
import { FISH } from '../data/fish.js';
import { fishSVG } from '../fishart.js';

const fishIdent = FISH.map(f => ({ id: 'fish-' + f.id, t: 'fish', fish: f, f: `${f.name}: ${f.fact}` }));
const TOTAL = CHOICE.length + ORDER.length + SORT.length + IDENT.length + fishIdent.length;

export function start(ctx) {
  const { body, store, sfx } = ctx;
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const learned = () => store.get().facts.learned;

  menu();

  function clear() { timers.forEach(clearTimeout); timers = []; body.innerHTML = ''; }

  // New things first, then things he has already found.
  function pickFrom(list, n) {
    const L = learned();
    const fresh = shuffle(list.filter(x => !L[x.id]));
    const seen = shuffle(list.filter(x => L[x.id]));
    return [...fresh, ...seen].slice(0, n);
  }

  /* ---------------- menu ---------------- */
  function menu() {
    clear();
    const n = Object.keys(learned()).length;
    body.append(el('div', { class: 'fg-menu' },
      el('button', { class: 'fg-big', onclick: () => { sfx.pick(); round(); } },
        el('span', { class: 'fg-big-title' }, 'Explore'),
        el('span', { class: 'muted' }, '6 things to figure out')),
      el('button', { class: 'fg-big book', onclick: () => { sfx.pick(); book(); } },
        el('span', { class: 'fg-big-title' }, 'My Field Guide'),
        el('span', { class: 'muted' }, n ? `${n} of ${TOTAL} facts found` : 'Facts you find are kept here'))));
  }

  /* ---------------- a round ---------------- */
  function round() {
    const c = pickFrom(CHOICE, 3).map(q => ({ kind: 'choice', item: q }));
    const i = pickFrom([...IDENT, ...fishIdent], 1).map(q => ({ kind: q.fish ? 'fish' : 'ident', item: q }));
    const o = pickFrom(ORDER, 1).map(q => ({ kind: 'order', item: q }));
    const s = pickFrom(SORT, 1).map(q => ({ kind: 'sort', item: q }));
    const steps = [c[0], i[0], c[1], o[0], c[2], s[0]];
    let at = 0;
    show();

    function show() {
      clear();
      if (at >= steps.length) return stump(steps.filter(x => x.kind === 'choice').map(x => x.item));
      const { kind, item } = steps[at];
      const stage = el('div', { class: 'fg-stage' });
      body.append(el('div', { class: 'fg' },
        el('div', { class: 'fg-head' },
          el('div', { class: 'fg-dots' }, steps.map((_, k) => el('span', { class: 'fg-dot' + (k < at ? ' done' : k === at ? ' on' : '') }))),
          el('span', { class: 'fg-topic' }, TOPICS[item.t])),
        stage));
      const done = () => {
        store.update(st => { st.facts.learned[item.id] = true; });
        sfx.good();
        stage.append(el('div', { class: 'fg-fact pop' },
          el('span', { class: 'fg-fact-tag' }, 'Fact found!'),
          el('p', {}, item.f || item.fact),
          el('div', { class: 'tale-actions' }, el('button', { class: 'bigbtn', onclick: () => { sfx.tap(); at++; show(); } }, at === steps.length - 1 ? 'Finish' : 'Next', svg(icons.next)))));
        stage.lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      };
      ({ choice, ident, fish, order, sort })[kind](item, stage, done);
    }
  }

  function answerButtons(options, correct, done, cls = '') {
    const box = el('div', { class: 'fg-answers ' + cls });
    shuffle(options).forEach(opt => {
      const b = el('button', { class: 'fg-answer', onclick: () => {
        if (opt.key === correct) {
          b.classList.add('right');
          box.querySelectorAll('button').forEach(x => { x.disabled = true; });
          done();
        } else { sfx.nope(); b.classList.add('wrong'); b.disabled = true; shake(box); }
      } }, opt.node);
      box.append(b);
    });
    return box;
  }

  function choice(q, stage, done) {
    stage.append(el('p', { class: 'fg-q' }, q.q),
      answerButtons(q.a.map((t, i) => ({ key: i, node: t })), 0, done));
  }

  function ident(q, stage, done) {
    stage.append(el('p', { class: 'fg-q' }, q.q),
      el('div', { class: 'fg-row' }, svg(q.img, 'fg-img'), answerButtons(q.a.map((t, i) => ({ key: i, node: t })), 0, done)));
  }

  function fish(q, stage, done) {
    const others = shuffle(FISH.filter(f => f.id !== q.fish.id)).slice(0, 2);
    if (Math.random() < 0.5) {
      stage.append(el('p', { class: 'fg-q' }, 'Which fish is this?'),
        el('div', { class: 'fg-row' }, svg(fishSVG(q.fish), 'fg-img fishpic'),
          answerButtons([q.fish, ...others].map(f => ({ key: f.id, node: f.name })), q.fish.id, done)));
    } else {
      stage.append(el('p', { class: 'fg-q' }, `Tap the ${q.fish.name}.`),
        answerButtons([q.fish, ...others].map(f => ({ key: f.id, node: svg(fishSVG(f), 'fg-fishbtn') })), q.fish.id, done, 'pics'));
    }
  }

  function order(q, stage, done) {
    const n = q.steps.length;
    let next = 0;
    const slots = el('div', { class: 'fg-slots' }, q.steps.map((_, k) => el('div', { class: 'fg-slot' }, el('span', { class: 'fg-slot-num' }, String(k + 1)))));
    const cards = el('div', { class: 'fg-cards' });
    shuffle(q.steps.map((st, k) => ({ st, k }))).forEach(({ st, k }) => {
      const card = el('button', { class: 'fg-card', onclick: () => {
        if (k !== next) { sfx.nope(); shake(card); hint.textContent = next === 0 ? 'Not that one. What comes first?' : 'Not yet. What comes next?'; return; }
        sfx.pick();
        card.disabled = true;
        card.classList.add('used');
        const slot = slots.children[next];
        slot.classList.add('filled');
        slot.append(el('div', { class: 'fg-card-pic', html: st[1] }), el('span', { class: 'fg-card-label' }, st[0]));
        next++;
        hint.textContent = next < n ? 'Good. What comes next?' : '';
        if (next === n) later(done, 300);
      } }, el('div', { class: 'fg-card-pic', html: st[1] }), el('span', { class: 'fg-card-label' }, st[0]));
      cards.append(card);
    });
    const hint = el('p', { class: 'fg-hint' }, 'What comes first?');
    stage.append(el('p', { class: 'fg-q' }, q.prompt), slots, hint, cards);
  }

  function sort(q, stage, done) {
    const groups = [0, 1].map(b => shuffle(q.items.filter(it => it.bin === b)).slice(0, 3));
    const queue = shuffle([...groups[0], ...groups[1]]);
    let at = 0;
    const piles = [0, 1].map(() => el('div', { class: 'fg-pile' }));
    const bins = [0, 1].map(b => el('button', { class: 'fg-bin', onclick: () => drop(b) }, el('span', { class: 'fg-bin-name' }, q.bins[b]), piles[b]));
    const holder = el('div', { class: 'fg-holder' });
    const hint = el('p', { class: 'fg-hint' }, 'Tap the box where it belongs.');
    const face = (it, small) => (it.fish
      ? el('div', { class: 'fg-item' + (small ? ' small' : '') }, svg(fishSVG(FISH.find(f => f.id === it.fish)), 'fg-item-fish'), el('span', {}, FISH.find(f => f.id === it.fish).name))
      : el('div', { class: 'fg-item' + (small ? ' small' : '') }, el('span', { class: 'emoji fg-item-emoji' }, it.emoji), el('span', {}, it.label)));
    const showItem = () => { holder.innerHTML = ''; if (at < queue.length) holder.append(face(queue[at])); };
    function drop(b) {
      if (at >= queue.length) return;
      const it = queue[at];
      if (it.bin !== b) { sfx.nope(); shake(holder); hint.textContent = 'Not that box. Try the other one.'; return; }
      sfx.pick();
      piles[b].append(face(it, true));
      at++;
      hint.textContent = at < queue.length ? 'Tap the box where it belongs.' : '';
      showItem();
      if (at === queue.length) { bins.forEach(x => { x.disabled = true; }); later(done, 300); }
    }
    showItem();
    stage.append(el('p', { class: 'fg-q' }, q.prompt), el('div', { class: 'fg-sort' }, bins[0], el('div', { class: 'fg-mid' }, holder, hint), bins[1]));
  }

  /* ---------------- stump a grown-up ---------------- */
  function stump(questions) {
    clear();
    const q = questions[Math.floor(Math.random() * questions.length)];
    const answer = el('p', { class: 'fg-stump-a' });
    const reveal = el('button', { class: 'smallbtn', onclick: () => { sfx.tap(); answer.textContent = `Answer: ${q.a[0]}. ${q.f}`; reveal.remove(); } }, 'Show the answer');
    store.update(st => { st.facts.rounds = (st.facts.rounds || 0) + 1; });
    body.append(el('div', { class: 'fg fg-stump' },
      el('span', { class: 'fg-fact-tag' }, 'Stump a grown-up!'),
      el('p', { class: 'fg-hint' }, 'Find a grown-up and ask this question. Do they know?'),
      el('p', { class: 'fg-q' }, q.q),
      reveal, answer,
      el('div', { class: 'tale-actions' }, el('button', { class: 'bigbtn', onclick: () => {
        const n = Object.keys(learned()).length;
        ctx.finish({ title: 'Nice exploring!', line: `Your Field Guide has ${n} of ${TOTAL} facts.`, grownPrompt: `Grown-up: did you get asked “${q.q}”? Tell the explorer one fact you know, too.`, note: 'round', againLabel: 'Field Guide', onAgain: menu });
      } }, 'Done'))));
  }

  /* ---------------- the book ---------------- */
  function book() {
    clear();
    const L = learned();
    const all = [...CHOICE, ...ORDER, ...SORT, ...IDENT, ...fishIdent];
    const sections = Object.entries(TOPICS).map(([key, name]) => {
      const items = all.filter(x => x.t === key);
      const found = items.filter(x => L[x.id]);
      return el('section', { class: 'fg-topicbox' },
        el('h3', {}, name, el('span', { class: 'fg-count' }, `${found.length} of ${items.length}`)),
        found.length
          ? el('ul', { class: 'fg-list' }, found.map(x => el('li', {}, x.fish ? svg(fishSVG(x.fish), 'fg-list-fish') : null, el('span', {}, x.f || x.fact))))
          : el('p', { class: 'muted' }, 'Nothing found here yet.'));
    });
    body.append(el('div', { class: 'fg fg-book' },
      el('div', { class: 'fh-top' }, el('button', { class: 'smallbtn', onclick: () => { sfx.tap(); menu(); } }, '← Back'), el('h2', {}, 'My Field Guide')),
      ...sections));
  }

  return () => { timers.forEach(clearTimeout); };
}
