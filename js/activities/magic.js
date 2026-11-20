// Pocket Magic: tricks you can do anytime with things around the house.
import { el, svg, icons, overlay } from '../ui.js';

const TRICKS = [
  {
    id: 'rubber', name: 'Rubber Pencil', level: 1, kit: ['✏️ pencil'], tag: 'Eye trick',
    steps: [
      { t: 'Hold a pencil near one end. Hold it loose, between your thumb and pointer finger.' },
      { t: 'Move your hand up and down. Small and fast.' },
      { t: 'Keep your grip loose. Small, fast wiggles make the pencil look bendy.', secret: true },
      { t: 'Say: “Watch my pencil turn to rubber!”' },
    ],
  },
  {
    id: 'sausage', name: 'Floating Finger', level: 1, kit: ['✋ your hands'], tag: 'Eye trick',
    steps: [
      { t: 'Point your two pointer fingers at each other, in front of your eyes. Leave a small gap.' },
      { t: 'Now look past your fingers, at the wall far away.' },
      { t: 'A little floating finger shows up in the gap!' },
      { t: 'Your eyes each see a different picture, and your brain mixes them.', secret: true },
      { t: 'Teach your audience to try it. Who can see it first?' },
    ],
  },
  {
    id: 'sticky', name: 'Sticky Pencil', level: 1, kit: ['✏️ pencil'],
    steps: [
      { t: 'Hold a pencil in your fist. Grab your wrist with your other hand.' },
      { t: 'The hand on your wrist sneaks out one pointer finger and presses the pencil.', secret: true },
      { t: 'Keep the back of your hand toward the audience so they can’t see that finger.', secret: true },
      { t: 'Slowly open your fist. The pencil sticks to your hand!' },
    ],
  },
  {
    id: 'band', name: 'Jumping Band', level: 2, kit: ['🟤 rubber band'],
    steps: [
      { t: 'Put a rubber band around your pointer and middle fingers, near the bottom.' },
      { t: 'Show it to your audience. Then close your hand into a fist.' },
      { t: 'As you close your hand, pull the band back with your other hand and tuck all four fingertips inside it.', secret: true },
      { t: 'Say a magic word. Open your hand fast.' },
      { t: 'The band jumps to your other two fingers!' },
    ],
  },
  {
    id: 'mind', name: 'Mind-Reader Math', level: 2, kit: ['📝 paper', '✏️ pencil'], tag: 'Math magic',
    steps: [
      { t: 'Ask a grown-up to think of a number. Tell them not to say it!' },
      { t: 'Say: “Double it.” That means add the number to itself.' },
      { t: 'Say: “Add 6.”' },
      { t: 'Say: “Cut it in half.”' },
      { t: 'Say: “Take away the number you first picked.”' },
      { t: 'The answer is always 3. Every time!', secret: true },
      { t: 'Close your eyes. Think hard. Then say: “Your number is… 3!”' },
    ],
  },
  {
    id: 'clips', name: 'Linking Clips', level: 2, kit: ['📄 long paper strip', '📎 2 paper clips'],
    steps: [
      { t: 'Fold a long strip of paper into a Z shape, so it has 3 layers.' },
      { t: 'Clip the front layer to the middle layer, near the top.' },
      { t: 'Clip the middle layer to the back layer, near the top.' },
      { t: 'Each clip holds only two layers, not all three. Ask a grown-up to check it the first time.', secret: true },
      { t: 'Hold both ends and pull them apart fast.' },
      { t: 'The clips fly off and link together!' },
    ],
  },
  {
    id: 'pepper', name: 'Scaredy Pepper', level: 1, kit: ['🥣 bowl of water', '🧂 pepper', '🧴 dish soap'], tag: 'Science magic',
    steps: [
      { t: 'Ask a grown-up first. Fill a bowl with water. Shake pepper on top.' },
      { t: 'Before the show, put a tiny drop of dish soap on one fingertip.', secret: true },
      { t: 'Say: “Pepper is scared of my magic finger!”' },
      { t: 'Touch the middle of the water. The pepper zooms away!' },
      { t: 'It’s science. Soap pulls apart the skin on top of the water.', secret: true },
    ],
  },
  {
    id: 'cards', name: 'The 21-Card Trick', level: 3, kit: ['🃏 deck of cards'], tag: 'Math magic',
    steps: [
      { t: 'Count out 21 cards.' },
      { t: 'Deal them face up into 3 piles, one card at a time, left to right, until all 21 are out.' },
      { t: 'Ask a friend to pick a card in their head and point to the pile it is in.' },
      { t: 'Put that pile in the middle of the other two. Pick up all the cards.' },
      { t: 'Deal again into 3 piles. Ask which pile. Put that pile in the middle again.' },
      { t: 'Do it one more time. That makes 3 times in all.' },
      { t: 'Now their card is always the 11th card from the top.', secret: true },
      { t: 'Deal cards face down, slowly. Stop on card 11 and say: “This is your card!”' },
    ],
  },
];

export function start(ctx) {
  const { body, store, sfx } = ctx;
  let showOv = null;
  showList();

  function showList() {
    body.innerHTML = '';
    const s = store.get();
    const allKit = [...new Set(TRICKS.flatMap(t => t.kit))];
    body.append(
      el('p', { class: 'act-lead' }, 'Learn a trick. Practice it. Then put on a show.'),
      el('div', { class: 'magic-grid' }, TRICKS.map(t =>
        el('button', { class: 'trick-card', onclick: () => { sfx.pick(); openTrick(t); } },
          el('div', { class: 'trick-top' },
            el('span', { class: 'trick-name' }, t.name),
            el('span', { class: 'stars', 'aria-label': `Level ${t.level}` }, '★'.repeat(t.level) + '☆'.repeat(3 - t.level))),
          el('div', { class: 'trick-kit' }, t.kit.map(k => el('span', { class: 'kit-chip' }, k))),
          el('div', { class: 'trick-foot' },
            t.tag ? el('span', { class: 'trick-tag' }, t.tag) : el('span'),
            s.magic.performed[t.id] ? el('span', { class: 'tale-done' }, svg(icons.check), 'Performed')
              : s.magic.learned[t.id] ? el('span', { class: 'tale-done learned' }, 'Learned') : null)))),
      el('details', { class: 'kit-box' },
        el('summary', {}, 'Grown-ups: the whole magic kit'),
        el('p', {}, 'Keep these together in one box so every trick is ready: ' + allKit.map(k => k.replace(/^\S+\s/, '')).join(', ') + '.')),
    );
  }

  function openTrick(t) {
    body.innerHTML = '';
    let shown = 1;
    const list = el('ol', { class: 'steps' });
    const nextBtn = el('button', { class: 'bigbtn', onclick: () => { sfx.tap(); shown++; drawSteps(); } }, 'Next step', svg(icons.next));
    const actions = el('div', { class: 'tale-actions' }, nextBtn);
    body.append(
      el('div', { class: 'trick-head' },
        el('button', { class: 'smallbtn', onclick: () => { sfx.tap(); showList(); } }, '← All tricks'),
        el('h2', {}, t.name),
        el('div', { class: 'trick-kit' }, el('span', { class: 'muted' }, 'You need:'), t.kit.map(k => el('span', { class: 'kit-chip' }, k)))),
      list, actions);
    drawSteps();

    function drawSteps() {
      list.innerHTML = '';
      t.steps.slice(0, shown).forEach((st, i) => {
        list.append(el('li', { class: 'step' + (st.secret ? ' secret' : '') + (i === shown - 1 ? ' pop' : '') },
          st.secret ? el('span', { class: 'secret-tag' }, svg(icons.lock), 'Secret') : null,
          el('span', { class: 'step-text' }, st.t)));
      });
      if (t.steps[shown - 1] && t.steps[shown - 1].secret) sfx.spark();
      if (shown >= t.steps.length) { actions.innerHTML = ''; actions.append(practice()); }
      list.lastChild && list.lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function practice() {
      let done = 0;
      const dots = [0, 1, 2].map(i => el('button', { class: 'practice-dot', 'aria-label': `Practice ${i + 1}`, onclick: () => {
        if (i !== done) return;
        done++;
        dots[i].classList.add('on');
        sfx.pick();
        if (done === 3) {
          store.update(s => { s.magic.learned[t.id] = true; });
          sfx.good();
          showBtn.disabled = false;
          showBtn.classList.add('pulse');
        }
      } }, String(i + 1)));
      const showBtn = el('button', { class: 'bigbtn showtime', disabled: true, onclick: () => showtime(t) }, '🎪 Showtime');
      return el('div', { class: 'practice' },
        el('p', { class: 'tale-text' }, 'Practice it 3 times. Tap a circle each time.'),
        el('div', { class: 'row gap center' }, dots),
        showBtn);
    }
  }

  function showtime(t) {
    sfx.whoosh();
    const confetti = el('div', { class: 'confetti' });
    const stage = el('div', { class: 'stage' },
      el('div', { class: 'curtain left' }), el('div', { class: 'curtain right' }),
      el('div', { class: 'stage-inner' },
        el('p', { class: 'marquee' }, 'Now presenting'),
        el('h1', { class: 'stage-title' }, t.name),
        el('div', { class: 'stage-buttons' },
          el('button', { class: 'stage-btn', onclick: () => sfx.drumroll(2.2) }, '🥁', el('span', {}, 'Drumroll')),
          el('button', { class: 'stage-btn gold', onclick: () => { sfx.tada(); burst(); } }, '✨', el('span', {}, 'Ta-da!')),
          el('button', { class: 'stage-btn', onclick: () => sfx.applause() }, '👏', el('span', {}, 'Applause'))),
        el('button', { class: 'bigbtn ghost stage-done', onclick: () => {
          showOv.close(); showOv = null;
          store.update(s => { s.magic.performed[t.id] = (s.magic.performed[t.id] || 0) + 1; s.magic.learned[t.id] = true; });
          ctx.finish({ title: 'What a show!', line: `You performed “${t.name}.”`, grownPrompt: 'Grown-up: did you watch the show? Tell the magician your favorite part.', note: t.id, againLabel: 'More tricks', onAgain: showList });
        } }, 'The show is over')),
      confetti);
    showOv = overlay(stage, 'stage-overlay');
    function burst() {
      for (let i = 0; i < 26; i++) {
        const p = el('span', { class: 'conf', style: { left: Math.random() * 100 + '%', background: ['#f2c14e', '#e0574c', '#5aa0d8', '#6cbf6a', '#c97ad6'][i % 5], animationDelay: Math.random() * 0.3 + 's', transform: `rotate(${Math.random() * 360}deg)` } });
        confetti.append(p);
        setTimeout(() => p.remove(), 2200);
      }
    }
  }

  return () => { if (showOv) showOv.close(); };
}
