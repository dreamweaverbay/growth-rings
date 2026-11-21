// Fishing Hole: stock the right water with the right fish, and design baits in the Lure Lab.
import { el, svg, icons, shake, shuffle, randInt, overlay } from '../ui.js';
import { FISH, ANIMALS, WATERS, BAITS, COLORWAYS, NAME_WORDS, CLARITY } from '../data/fish.js';
import { fishSVG, animalSVG, lureSVG, waterSVG, ZONES } from '../fishart.js';

const WEIGHT = { largemouth: [1, 7], spotted: [1, 4], smallmouth: [1, 5], walleye: [1, 8], striper: [4, 25], catfish: [2, 15], trout: [1, 4] };
const DEPTH_Y = { top: 25, mid: 52, bottom: 76 };
const an = (name) => (/^[AEIOU]/.test(name) ? 'An' : 'A');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function start(ctx) {
  const { body, store, sfx } = ctx;
  let raf = 0;
  let timers = [];
  let finishedThisVisit = false;
  let cardOv = null;
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const fishById = Object.fromEntries(FISH.map(f => [f.id, f]));

  function reset() {
    cancelAnimationFrame(raf); raf = 0;
    timers.forEach(clearTimeout); timers = [];
    body.innerHTML = '';
  }

  menu();

  /* ================= Menu ================= */
  function menu() {
    reset();
    const s = store.get();
    const box = s.fishing.box;
    const stocked = Object.keys(s.fishing.stocked).length;
    const demo = [fishById.largemouth, fishById.redfish];
    body.append(
      el('div', { class: 'fh-menu' },
        el('button', { class: 'fh-mode', onclick: () => { sfx.pick(); chooseWater(); } },
          el('div', { class: 'fh-mode-art' }, svg(waterSVG('lake'), 'fh-mode-water'), svg(fishSVG(demo[0]), 'fh-mode-fish a'), svg(fishSVG(fishById.bluegill), 'fh-mode-fish b')),
          el('div', { class: 'fh-mode-text' },
            el('span', { class: 'fh-mode-title' }, 'Stock the Water'),
            el('span', { class: 'muted' }, 'Put each animal where it really lives'),
            stocked ? el('span', { class: 'tale-done' }, svg(icons.check), `${stocked} of 4 waters stocked`) : null)),
        el('button', { class: 'fh-mode', onclick: () => { sfx.pick(); lureLab(); } },
          el('div', { class: 'fh-mode-art lure-art' }, svg(lureSVG('crank', COLORWAYS[5], { flake: true }), 'fh-mode-lure')),
          el('div', { class: 'fh-mode-text' },
            el('span', { class: 'fh-mode-title' }, 'Lure Lab'),
            el('span', { class: 'muted' }, 'Design a bait, then test it'),
            box.length ? el('span', { class: 'tale-done' }, svg(icons.check), `${box.length} bait${box.length > 1 ? 's' : ''} in your box`) : null))),
    );
    if (box.length) {
      body.append(el('h3', { class: 'fh-box-title' }, 'My Bait Box'),
        el('div', { class: 'fh-box' }, box.slice().reverse().map(b => {
          const cw = COLORWAYS.find(c => c.id === b.color);
          return el('button', { class: 'fh-box-item', onclick: () => { sfx.pick(); baitCard(b); } }, svg(lureSVG(b.bait, cw, { flake: b.flake }), 'fh-box-lure'), el('span', {}, b.name));
        })));
    }
  }

  /* ================= Stock the Water ================= */
  function chooseWater() {
    reset();
    const s = store.get();
    body.append(
      el('div', { class: 'fh-top' }, el('button', { class: 'smallbtn', onclick: () => { sfx.tap(); menu(); } }, '← Fishing Hole'), el('h2', {}, 'Pick a body of water')),
      el('div', { class: 'fh-waters' }, WATERS.map(w =>
        el('button', { class: 'fh-water', onclick: () => { sfx.pick(); stock(w); } },
          svg(waterSVG(w.id), 'fh-water-art'),
          el('div', { class: 'fh-water-foot' },
            el('span', { class: 'fh-water-name' }, w.name, w.salt ? el('span', { class: 'salt-tag' }, 'salt water') : el('span', { class: 'fresh-tag' }, 'fresh water')),
            el('span', { class: 'muted small' }, w.blurb),
            s.fishing.stocked[w.id] ? el('span', { class: 'tale-done' }, svg(icons.check), 'Stocked') : null)))));
  }

  function stock(water) {
    reset();
    // Right answers come from this water's own list. Wrong answers always come from the
    // other kind of water (salt or fresh), so there is a clear reason each one does not fit.
    const all = [...FISH, ...ANIMALS];
    const byId = Object.fromEntries(all.map(f => [f.id, f]));
    const take = (ids, n) => shuffle(ids).slice(0, n).map(id => byId[id]);
    const goals = water.known ? [...take(water.known, 3), ...take(water.roster, 2)] : take(water.roster, 5);
    const other = all.filter(f => f.water === (water.salt ? 'fresh' : 'salt') && f.wrongIn !== false);
    const otherKnown = shuffle(other.filter(f => !f.look)), otherFish = shuffle(other.filter(f => f.look));
    const distract = water.salt ? [...otherFish.slice(0, 3), ...otherKnown.slice(0, 1)] : [...otherKnown.slice(0, 2), ...otherFish.slice(0, 2)];
    const tray = shuffle([...goals, ...distract]);
    let placed = 0;
    let selected = null;

    const counter = el('span', { class: 'fh-counter' }, `0 / ${goals.length}`);
    const bubble = el('div', { class: 'fh-bubble' });
    const layer = el('div', { class: 'fh-layer' });
    const scene = el('div', { class: 'fh-scene' }, svg(waterSVG(water.id, { wide: true }), 'fh-scene-bg'), layer, bubble);
    const trayEl = el('div', { class: 'fh-tray' });
    body.append(
      el('div', { class: 'fh-top' },
        el('button', { class: 'smallbtn', onclick: () => { sfx.tap(); chooseWater(); } }, '← Waters'),
        el('h2', {}, `Find the ${goals.length} animals that live in the ${water.name.toLowerCase()}`),
        counter),
      scene,
      el('p', { class: 'fh-hint' }, 'Drag an animal into the water, or tap one and then tap the water.'),
      trayEl);

    tray.forEach(f => {
      const card = el('button', { class: 'fh-card' }, svg(animalSVG(f), 'fh-card-fish'), el('span', {}, f.name));
      card.addEventListener('pointerdown', (e) => grab(e, f, card));
      trayEl.append(card);
    });

    scene.addEventListener('pointerdown', (e) => {
      if (!selected) return;
      const r = scene.getBoundingClientRect();
      drop(selected.f, selected.card, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    });

    function grab(e, f, card) {
      if (card.classList.contains('placed')) return;
      e.preventDefault();
      const sx = e.clientX, sy = e.clientY;
      let ghost = null;
      try { card.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      const move = (ev) => {
        if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 10) {
          ghost = el('div', { class: 'fh-ghost', html: animalSVG(f) });
          document.body.append(ghost);
          sfx.tap();
        }
        if (ghost) { ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px'; }
      };
      const up = (ev) => {
        card.removeEventListener('pointermove', move);
        card.removeEventListener('pointerup', up);
        card.removeEventListener('pointercancel', up);
        if (ghost) {
          ghost.remove();
          const r = scene.getBoundingClientRect();
          if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) {
            drop(f, card, (ev.clientX - r.left) / r.width, (ev.clientY - r.top) / r.height);
          }
        } else {
          trayEl.querySelectorAll('.fh-card').forEach(c => c.classList.remove('sel'));
          selected = { f, card };
          card.classList.add('sel');
          sfx.pick();
          say(`${f.name}. Now tap the water.`);
        }
      };
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerup', up);
      card.addEventListener('pointercancel', up);
    }

    let bubbleTimer = 0;
    function say(html, kind = '') {
      bubble.innerHTML = html;
      bubble.className = 'fh-bubble show ' + kind;
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => { bubble.className = 'fh-bubble'; }, 5000);
      timers.push(bubbleTimer);
    }

    function drop(f, card, fx, fy) {
      selected = null;
      card.classList.remove('sel');
      if (f.homes.includes(water.id)) {
        placed++;
        card.classList.add('placed');
        counter.textContent = `${placed} / ${goals.length}`;
        addSwimmer(f, fx, fy);
        sfx.good();
        say(`<strong>${f.name}!</strong> ${f.fact}`, 'good');
        if (placed === goals.length) later(done, 2200);
      } else {
        sfx.nope();
        shake(card);
        say(`<strong>Not here.</strong> ${an(f.name)} ${f.name} lives in ${water.salt ? 'fresh' : 'salt'} water. The ${water.name.toLowerCase()} is ${water.salt ? 'salt' : 'fresh'} water.`, 'bad');
      }
    }

    const swimmers = [];
    function addSwimmer(f, fx, fy) {
      const [z0, z1] = ZONES[f.zone];
      const flat = f.look && f.look.flat;
      const still = flat || f.move === 'still';
      const pace = f.move === 'slow' ? 0.4 : f.move === 'drift' ? 0.2 : 1;
      const w = f.w || (flat ? 15 : 17);
      const node = el('div', { class: 'swimmer', html: animalSVG(f) });
      node.style.width = `min(${w}%, ${Math.round(w * 11)}px)`;
      node.addEventListener('pointerdown', (e) => { if (selected) return; e.stopPropagation(); sfx.pick(); say(`<strong>${f.name}.</strong> ${f.fact}`, 'good'); });
      layer.append(node);
      swimmers.push({ node, f, still, w, x: clamp(fx * 100 - w / 2, 1, 99 - w), y: clamp(fy * 100, z0, z1), vx: (Math.random() < 0.5 ? -1 : 1) * (0.03 + Math.random() * 0.035) * pace, ph: Math.random() * 6 });
      node.animate([{ transform: 'translateY(-50%) scale(.4)', opacity: 0 }, { transform: 'translateY(-50%) scale(1)', opacity: 1 }], { duration: 400, easing: 'ease-out' });
      if (!raf) raf = requestAnimationFrame(loop);
    }
    function loop(t) {
      raf = requestAnimationFrame(loop);
      for (const s of swimmers) {
        if (!s.still) {
          s.x += s.vx;
          if (s.x < 1 || s.x > 99 - s.w) s.vx *= -1;
        }
        const bob = s.still ? 0 : Math.sin(t / (s.f.move === 'drift' ? 900 : 650) + s.ph) * (s.f.move === 'drift' ? 2.4 : s.f.zone === 'surface' || s.f.zone === 'floor' ? 0.3 : 1.1);
        s.node.style.left = s.x + '%';
        s.node.style.top = (s.y + bob) + '%';
        if (!s.f.sym) s.node.firstElementChild.style.transform = `scaleX(${s.vx > 0 ? -1 : 1})`;
      }
    }

    function done() {
      store.update(s => { s.fishing.stocked[water.id] = (s.fishing.stocked[water.id] || 0) + 1; });
      ctx.finish({
        title: `The ${water.name.toLowerCase()} is stocked!`,
        line: 'Every animal found the right home.',
        grownPrompt: 'Ask a grown-up: which of these animals have they seen or caught, and where?',
        note: water.id,
        againLabel: 'Another water',
        onAgain: chooseWater,
      });
    }
  }

  /* ================= Lure Lab ================= */
  const draft = { bait: 'crank', color: 'shad', flake: false, first: null, second: null };
  const draftName = () => (draft.first && draft.second ? `The ${draft.first} ${draft.second}` : 'Your new bait');

  function lureLab(stepNo = 0) {
    reset();
    const preview = el('div', { class: 'll-preview' });
    const title = el('div', { class: 'll-name' });
    const sub = el('div', { class: 'll-sub muted' });
    const panel = el('div', { class: 'll-panel' });
    const steps = ['Bait', 'Color', 'Name', 'Test'];
    const tabs = el('div', { class: 'wx-steps' }, steps.map((s, i) => el('button', { class: 'wx-step' + (i === stepNo ? ' on' : '') + (i < stepNo ? ' done' : ''), onclick: () => { if (i < 3 || (draft.first && draft.second)) lureLab(i); } }, s)));
    body.append(
      el('div', { class: 'fh-top' }, el('button', { class: 'smallbtn', onclick: () => { sfx.tap(); menu(); } }, '← Fishing Hole'), el('h2', {}, 'Lure Lab')),
      el('div', { class: 'll' },
        el('div', { class: 'll-left' }, preview, title, sub),
        el('div', { class: 'll-right' }, tabs, panel)));
    const refresh = () => {
      const cw = COLORWAYS.find(c => c.id === draft.color);
      const bait = BAITS.find(b => b.id === draft.bait);
      preview.innerHTML = '';
      preview.append(svg(lureSVG(draft.bait, cw, { flake: draft.flake }), 'll-lure'));
      title.textContent = draftName();
      sub.textContent = `${bait.name} · ${cw.name}${draft.flake ? ' with flake' : ''}`;
    };
    refresh();
    const next = (n) => el('div', { class: 'tale-actions' }, el('button', { class: 'bigbtn', onclick: () => { sfx.tap(); lureLab(n); } }, 'Next', svg(icons.next)));

    if (stepNo === 0) {
      const tip = el('p', { class: 'll-tip' });
      const showTip = () => { const b = BAITS.find(x => x.id === draft.bait); tip.innerHTML = `<strong>${b.name}</strong> looks like ${b.mimics}. ${b.tip}`; };
      const grid = el('div', { class: 'll-grid' });
      const draw = () => {
        grid.innerHTML = '';
        const cw = COLORWAYS.find(c => c.id === draft.color);
        BAITS.forEach(b => grid.append(el('button', { class: 'll-pick' + (draft.bait === b.id ? ' on' : ''), onclick: () => { sfx.pick(); draft.bait = b.id; draw(); refresh(); showTip(); } },
          svg(lureSVG(b.id, cw, {}), 'll-pick-lure'), el('span', {}, b.name))));
      };
      draw(); showTip();
      panel.append(el('p', { class: 'll-q' }, 'Pick a kind of bait.'), grid, tip, next(1));
    } else if (stepNo === 1) {
      const grid = el('div', { class: 'll-swatches' });
      const flakeBtn = el('button', { class: 'll-flake' + (draft.flake ? ' on' : ''), onclick: () => { sfx.pick(); draft.flake = !draft.flake; flakeBtn.classList.toggle('on', draft.flake); refresh(); } }, '✨ Add sparkly flake');
      const draw = () => {
        grid.innerHTML = '';
        COLORWAYS.forEach(c => grid.append(el('button', { class: 'll-swatch' + (draft.color === c.id ? ' on' : ''), onclick: () => { sfx.pick(); draft.color = c.id; draw(); refresh(); } },
          el('span', { class: 'chip', style: { background: `linear-gradient(180deg, ${c.back} 0 33%, ${c.base} 33% 70%, ${c.accent} 70%)` } }), el('span', {}, c.name))));
      };
      draw();
      panel.append(el('p', { class: 'll-q' }, 'Pick a color. Real anglers use these names!'), grid, flakeBtn, next(2));
    } else if (stepNo === 2) {
      const row = (key, words) => el('div', { class: 'll-words' }, words.map(w => el('button', { class: 'll-word' + (draft[key] === w ? ' on' : ''), onclick: () => { sfx.pick(); draft[key] = w; lureLab(2); } }, w)));
      const dice = el('button', { class: 'smallbtn', onclick: () => { sfx.pick(); draft.first = NAME_WORDS.first[randInt(0, NAME_WORDS.first.length - 1)]; draft.second = NAME_WORDS.second[randInt(0, NAME_WORDS.second.length - 1)]; lureLab(2); } }, '🎲 Surprise me');
      panel.append(el('p', { class: 'll-q' }, 'Name your bait. Pick one word from each row.'), row('first', NAME_WORDS.first), row('second', NAME_WORDS.second), el('div', { class: 'row gap' }, dice),
        draft.first && draft.second ? next(3) : el('p', { class: 'muted' }, 'Pick a word from both rows to keep going.'));
    } else {
      panel.append(el('p', { class: 'll-q' }, 'Time to test it at the Big Lake. How does the water look today?'),
        el('div', { class: 'll-clarity' }, CLARITY.map(c => el('button', { class: 'll-clear', onclick: () => { sfx.pick(); cast(c); } },
          el('span', { class: 'chip big', style: { background: c.water } }), el('span', { class: 'll-clear-name' }, c.name), el('span', { class: 'muted small' }, c.blurb)))));
    }
  }

  function cast(clarity) {
    reset();
    const bait = BAITS.find(b => b.id === draft.bait);
    const cw = COLORWAYS.find(c => c.id === draft.color);
    const target = fishById[bait.targets[randInt(0, bait.targets.length - 1)]];
    const colorOK = clarity.id === 'stained' || (clarity.id === 'clear' && cw.kind === 'natural') || (clarity.id === 'muddy' && cw.kind === 'bright');
    const y = DEPTH_Y[bait.depth];
    const lure = el('div', { class: 'cast-lure', html: lureSVG(draft.bait, cw, { flake: draft.flake }) });
    const fish = el('div', { class: 'cast-fish', html: fishSVG(target) });
    const line = el('div', { class: 'cast-line' });
    const shout = el('div', { class: 'cast-shout' });
    const scene = el('div', { class: 'cast-scene' }, svg(waterSVG('lake', { haze: clarity.haze, hazeColor: clarity.id === 'muddy' ? '#8a6436' : '#4f7a4a' }), 'fh-scene-bg'), line, fish, lure, shout);
    const result = el('div', { class: 'cast-result' });
    body.append(
      el('div', { class: 'fh-top' }, el('button', { class: 'smallbtn', onclick: () => { sfx.tap(); lureLab(3); } }, '← Lure Lab'), el('h2', {}, `${draftName()} at the Big Lake, in ${clarity.name.toLowerCase()} water`)),
      scene, result);

    lure.style.left = '4%'; lure.style.top = '4%';
    fish.style.left = '108%'; fish.style.top = y + '%';
    sfx.whoosh();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      lure.style.transition = 'left 1s cubic-bezier(.3,.6,.4,1), top 1.2s cubic-bezier(.5,0,.6,1)';
      lure.style.left = '40%'; lure.style.top = y + '%';
    }));
    later(() => { sfx.knock(); lure.classList.add('wiggle'); line.classList.add('show'); line.style.height = y + '%'; }, 1100);
    later(() => { fish.style.transition = 'left 1.6s ease-out'; fish.style.left = '62%'; }, 1500);
    if (colorOK) {
      later(() => { fish.style.transition = 'left .35s ease-in'; fish.style.left = '44%'; }, 3300);
      later(() => { sfx.tada(); shout.textContent = 'FISH ON!'; shout.classList.add('show'); scene.classList.add('hooked'); }, 3700);
      later(() => caught(target, clarity, bait, cw, result), 4600);
    } else {
      later(() => { fish.classList.add('look'); }, 3200);
      later(() => { fish.querySelector('svg').style.transform = 'scaleX(-1)'; fish.style.transition = 'left 1.3s ease-in'; fish.style.left = '112%'; sfx.whoosh(); }, 4300);
      later(() => missed(target, clarity, cw, result), 5200);
    }
  }

  function why(clarity, cw, ok) {
    if (clarity.id === 'stained') return 'Stained water is in-between, so lots of colors can work.';
    if (clarity.id === 'clear') return ok
      ? `In clear water fish see very well, so a natural color like ${cw.name} looks real.`
      : `In clear water fish can see a ${cw.name.toLowerCase()} bait too well. It doesn’t look real. Try a natural color like Shad or Green Pumpkin.`;
    return ok
      ? `In muddy water it is hard to see, so a bright or dark color like ${cw.name} is easy to find.`
      : `In muddy water fish can’t see a natural color like ${cw.name} very well. Try something bright like Chartreuse or dark like Black & Blue.`;
  }

  function caught(target, clarity, bait, cw, result) {
    const [lo, hi] = WEIGHT[target.id] || [1, 5];
    const lb = randInt(lo, hi);
    const s = store.get();
    let entry = s.fishing.box.find(b => b.name === draftName() && b.bait === draft.bait && b.color === draft.color && b.flake === draft.flake);
    store.update(st => {
      let e = st.fishing.box.find(b => b.name === draftName() && b.bait === draft.bait && b.color === draft.color && b.flake === draft.flake);
      if (!e) { e = { name: draftName(), bait: draft.bait, color: draft.color, flake: draft.flake, catches: [] }; st.fishing.box.push(e); }
      e.catches.push({ fish: target.id, lb, clarity: clarity.id });
      entry = e;
    });
    result.innerHTML = '';
    setTimeout(() => result.scrollIntoView({ behavior: 'smooth', block: 'end' }), 50);
    result.append(
      el('div', { class: 'catch-card pop' },
        svg(fishSVG(target), 'catch-fish'),
        el('div', { class: 'catch-text' },
          el('h3', {}, `${lb}-pound ${target.name}!`),
          el('p', { class: 'tale-text' }, why(clarity, cw, true)),
          el('p', { class: 'muted' }, `Saved to your Bait Box: ${draftName()}`))),
      el('div', { class: 'row gap center wrap' },
        el('button', { class: 'bigbtn ghost', onclick: () => { sfx.tap(); lureLab(3); } }, 'Cast again'),
        el('button', { class: 'bigbtn ghost', onclick: () => { sfx.tap(); baitCard(entry); } }, 'My bait card'),
        el('button', { class: 'bigbtn', onclick: () => {
          sfx.tap();
          if (finishedThisVisit) { menu(); return; }
          finishedThisVisit = true;
          ctx.finish({
            title: 'Fish on!',
            line: `${draftName()} caught a ${lb}-pound ${target.name.toLowerCase()}.`,
            grownPrompt: 'Show your bait card to a grown-up who fishes. Ask what fish they would try it on.',
            note: draft.bait,
            againLabel: 'Fishing Hole',
            onAgain: menu,
          });
        } }, 'Done fishing')));
  }

  function missed(target, clarity, cw, result) {
    result.innerHTML = '';
    setTimeout(() => result.scrollIntoView({ behavior: 'smooth', block: 'end' }), 50);
    result.append(
      el('div', { class: 'catch-card miss pop' },
        svg(fishSVG(target), 'catch-fish faded'),
        el('div', { class: 'catch-text' },
          el('h3', {}, `${an(target.name)} ${target.name} looked… then swam away.`),
          el('p', { class: 'tale-text' }, why(clarity, cw, false)))),
      el('div', { class: 'row gap center wrap' },
        el('button', { class: 'bigbtn', onclick: () => { sfx.tap(); lureLab(1); } }, 'Change the color'),
        el('button', { class: 'bigbtn ghost', onclick: () => { sfx.tap(); lureLab(3); } }, 'Try other water')));
  }

  /* ================= Bait card ================= */
  function baitCard(b) {
    const cw = COLORWAYS.find(c => c.id === b.color);
    const bait = BAITS.find(x => x.id === b.bait);
    const best = cw.kind === 'natural' ? 'clear water' : 'stained or muddy water';
    const catches = b.catches.slice(-5).reverse();
    const card = el('div', { class: 'bait-card print-card' },
      el('div', { class: 'bait-card-art' }, svg(lureSVG(b.bait, cw, { flake: b.flake }), 'bait-card-lure')),
      el('h2', {}, b.name),
      el('p', { class: 'muted' }, `${bait.name} · ${cw.name}${b.flake ? ' with flake' : ''}`),
      el('div', { class: 'bait-facts' },
        el('p', {}, el('strong', {}, 'Looks like: '), bait.mimics),
        el('p', {}, el('strong', {}, 'Best in: '), best),
        el('p', {}, el('strong', {}, 'Fish it: '), bait.depth === 'top' ? 'on top of the water' : bait.depth === 'mid' ? 'in the middle of the water' : 'slow, on the bottom')),
      catches.length ? el('div', { class: 'bait-catches' }, el('strong', {}, 'Caught: '),
        catches.map(c => el('span', { class: 'catch-chip' }, `${c.lb} lb ${fishById[c.fish].name}`))) : null,
      el('p', { class: 'bait-maker muted small' }, `Designed in the Lure Lab · ${new Date().toLocaleDateString()}`));
    cardOv = overlay(el('div', { class: 'bait-card-wrap' }, card,
      el('div', { class: 'row gap center' },
        el('button', { class: 'bigbtn ghost', onclick: () => { cardOv.close(); cardOv = null; } }, 'Close'),
        el('button', { class: 'bigbtn', onclick: () => { document.body.classList.add('printing'); window.print(); setTimeout(() => document.body.classList.remove('printing'), 500); } }, '🖨️ Print card'))), 'bait-overlay');
  }

  return () => { reset(); if (cardOv) cardOv.close(); };
}
