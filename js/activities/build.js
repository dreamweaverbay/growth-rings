// Build Lab: step-by-step 3D blueprints for magnetic tiles.
import * as THREE from 'three';
import { el, svg, icons } from '../ui.js';

const H = Math.SQRT1_2;          // pyramid height for a square base with equilateral sides (side 1)
const FIN = Math.sqrt(3) / 2;    // height of an equilateral triangle (side 1)
const PALETTE = [0xe0574c, 0xf2a03d, 0xf2cf4e, 0x6cbf6a, 0x4f9fdc, 0x8f6bd1];

/* ---------- tile helpers ---------- */
const S = (...v) => ({ shape: 'sq', v });
const T = (...v) => ({ shape: 'tri', v });

function ring(x, z, y) {
  return [
    S([x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]),
    S([x + 1, y, z], [x, y, z], [x, y + 1, z], [x + 1, y + 1, z]),
    S([x, y, z], [x, y, z + 1], [x, y + 1, z + 1], [x, y + 1, z]),
    S([x + 1, y, z + 1], [x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1]),
  ];
}
function pyramid(x, z, y) {
  const a = [x + 0.5, y + H, z + 0.5];
  return [
    T([x, y, z + 1], [x + 1, y, z + 1], a),
    T([x + 1, y, z], [x, y, z], a),
    T([x, y, z], [x, y, z + 1], a),
    T([x + 1, y, z + 1], [x + 1, y, z], a),
  ];
}
function flat(x, z, y) { return S([x, y, z], [x + 1, y, z], [x + 1, y, z + 1], [x, y, z + 1]); }
function wallX(x, z, y) { return S([x, y, z], [x + 1, y, z], [x + 1, y + 1, z], [x, y + 1, z]); } // runs along x at depth z
function wallZ(x, z, y) { return S([x, y, z], [x, y, z + 1], [x, y + 1, z + 1], [x, y + 1, z]); } // runs along z at x

function rocketFins() {
  const corners = [[0, 0, -1, -1], [1, 0, 1, -1], [1, 1, 1, 1], [0, 1, -1, 1]];
  return corners.map(([cx, cz, dx, dz]) => {
    const k = FIN / Math.SQRT2;
    return T([cx, 0, cz], [cx, 1, cz], [cx + dx * k, 0.5, cz + dz * k]);
  });
}

function gemHalf(top) {
  const y0 = H;              // equator height so the bottom point sits on the floor
  const tip = top ? [0.5, 2 * H, 0.5] : [0.5, 0, 0.5];
  const sq = [[0, y0, 0], [1, y0, 0], [1, y0, 1], [0, y0, 1]];
  return [0, 1, 2, 3].map(i => T(sq[i], sq[(i + 1) % 4], tip));
}

export const BUILDS = [
  {
    id: 'rocket', name: 'Rocket', challenge: 'Can you make your rocket even taller?',
    steps: [
      { say: 'Make a square tube with 4 squares. This is the bottom of the rocket.', tiles: ring(0, 0, 0) },
      { say: 'Stack 4 more squares on top to make it taller.', tiles: ring(0, 0, 1) },
      { say: 'Lean 4 triangles together on top to make the nose.', tiles: pyramid(0, 0, 2) },
      { say: 'Stick a triangle on each corner at the bottom. These are the fins.', tiles: rocketFins() },
    ],
  },
  {
    id: 'gem', name: 'Giant Gem', challenge: 'Can you build a second gem in a different color?',
    steps: [
      { say: 'Hold 4 triangles so their points meet at the bottom, like a bowl.', tiles: gemHalf(false) },
      { say: 'Add 4 more triangles on top so their points meet. Your gem has 8 sides!', tiles: gemHalf(true) },
    ],
  },
  {
    id: 'garage', name: 'Truck Garage', challenge: 'Park a toy truck inside. Can you add a second garage next door?',
    steps: [
      { say: 'Stand up 2 squares side by side for the back wall.', tiles: [wallX(0, 0, 0), wallX(1, 0, 0)] },
      { say: 'Add a square on each side. Leave the front open for the trucks.', tiles: [wallZ(0, 0, 0), wallZ(2, 0, 0)] },
      { say: 'Lay 2 squares flat on top for the roof.', tiles: [flat(0, 0, 1), flat(1, 0, 1)] },
      { say: 'Build a little tower on the left side of the roof with 4 squares.', tiles: ring(0, 0, 1) },
      { say: 'Top the tower with 4 triangles.', tiles: pyramid(0, 0, 2) },
    ],
  },
  {
    id: 'castle', name: 'Castle', challenge: 'Can you add a third tower or a gate?',
    steps: [
      { say: 'Make a square tube with 4 squares. This is the left tower.', tiles: ring(0, 0, 0) },
      { say: 'Make another one with a gap of one square between them. This is the right tower.', tiles: ring(2, 0, 0) },
      { say: 'Fill the gap with 2 squares, one in front and one in back.', tiles: [wallX(1, 1, 0), wallX(1, 0, 0)] },
      { say: 'Stack 4 more squares on each tower.', tiles: [...ring(0, 0, 1), ...ring(2, 0, 1)] },
      { say: 'Put a pointy roof on each tower with 4 triangles.', tiles: [...pyramid(0, 0, 2), ...pyramid(2, 0, 2)] },
      { say: 'Stand one triangle on top of the front wall, like a flag.', tiles: [T([1, 1, 1], [2, 1, 1], [1.5, 1 + FIN, 1])] },
    ],
  },
  {
    id: 'robot', name: 'Robot Buddy', challenge: 'Give your robot arms. What else can you add?',
    steps: [
      { say: 'Make a square tube with 4 squares. This is the left leg.', tiles: ring(0, 0, 0) },
      { say: 'Make the right leg with a gap of one square between the legs.', tiles: ring(2, 0, 0) },
      { say: 'Build the body on top of the legs: 3 squares in front, 3 in back, and 1 on each side.', tiles: [wallX(0, 1, 1), wallX(1, 1, 1), wallX(2, 1, 1), wallX(0, 0, 1), wallX(1, 0, 1), wallX(2, 0, 1), wallZ(0, 0, 1), wallZ(3, 0, 1)] },
      { say: 'Lay 3 squares flat on top of the body.', tiles: [flat(0, 0, 2), flat(1, 0, 2), flat(2, 0, 2)] },
      { say: 'Make the head in the middle with 4 squares.', tiles: ring(1, 0, 2) },
      { say: 'Give your robot a pointy hat with 4 triangles.', tiles: pyramid(1, 0, 3) },
    ],
  },
];

function counts(tiles) {
  return { sq: tiles.filter(t => t.shape === 'sq').length, tri: tiles.filter(t => t.shape === 'tri').length };
}

const SQ_ICON = '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" fill="#4f9fdc" fill-opacity=".55" stroke="#1f5a8a" stroke-width="2"/></svg>';
const TRI_ICON = '<svg viewBox="0 0 24 24"><path d="M12 3L22 20H2z" fill="#f2a03d" fill-opacity=".6" stroke="#9a5a12" stroke-width="2" stroke-linejoin="round"/></svg>';

function pieceChips(c) {
  return el('span', { class: 'pieces' },
    c.sq ? el('span', { class: 'piece' }, svg(SQ_ICON, 'piece-icon'), `× ${c.sq}`) : null,
    c.tri ? el('span', { class: 'piece' }, svg(TRI_ICON, 'piece-icon'), `× ${c.tri}`) : null);
}

/* ---------- three.js scene ---------- */

function tileMesh(tile, color) {
  const g = new THREE.Group();
  const pts = tile.v.map(p => new THREE.Vector3(...p));
  const geo = new THREE.BufferGeometry();
  const idx = tile.shape === 'sq' ? [0, 1, 2, 0, 2, 3] : [0, 1, 2];
  const pos = [];
  idx.forEach(i => pos.push(pts[i].x, pts[i].y, pts[i].z));
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.62, side: THREE.DoubleSide, roughness: 0.35, metalness: 0.05, depthWrite: false, emissive: 0x000000 });
  const mesh = new THREE.Mesh(geo, mat);
  g.add(mesh);
  // a frame like the plastic rim of a real tile
  const center = pts.reduce((a, p) => a.add(p.clone()), new THREE.Vector3()).multiplyScalar(1 / pts.length);
  const inner = pts.map(p => p.clone().lerp(center, 0.12));
  const linePts = [];
  for (const ring of [pts, inner]) for (let i = 0; i < ring.length; i++) { const a = ring[i], b = ring[(i + 1) % ring.length]; linePts.push(a.x, a.y, a.z, b.x, b.y, b.z); }
  const lg = new THREE.BufferGeometry();
  lg.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3));
  const lineColor = new THREE.Color(color).multiplyScalar(0.55);
  const lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: lineColor }));
  g.add(lines);
  g.userData = { mat, base: new THREE.Color(color) };
  return g;
}

function ringTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const x = c.getContext('2d');
  const grd = x.createRadialGradient(256, 256, 10, 256, 256, 256);
  grd.addColorStop(0, '#d9ad74'); grd.addColorStop(1, '#ecd2a2');
  x.fillStyle = grd; x.fillRect(0, 0, 512, 512);
  x.strokeStyle = 'rgba(150, 100, 50, .35)';
  for (let r = 14; r < 256; r += 13 + Math.sin(r) * 4) {
    x.lineWidth = 1.5 + (r % 3);
    x.beginPath(); x.arc(256, 256, r, 0, Math.PI * 2); x.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeStage(canvas, w, h, preserve = false) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: preserve });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xfff6e6, 0xb08a60, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 1.4);
  sun.position.set(4, 8, 6);
  scene.add(sun);
  const board = new THREE.Mesh(new THREE.CircleGeometry(3.6, 64), new THREE.MeshStandardMaterial({ map: ringTexture(), roughness: 0.9 }));
  board.rotation.x = -Math.PI / 2;
  board.position.y = -0.005;
  scene.add(board);
  return { renderer, scene, camera, board };
}

function frameCamera(camera, tiles, controls) {
  const box = new THREE.Box3();
  tiles.forEach(t => t.v.forEach(p => box.expandByPoint(new THREE.Vector3(...p))));
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();
  const dist = Math.max(3.2, size * 1.55);
  camera.position.set(center.x + dist * 0.75, center.y + dist * 0.55, center.z + dist * 0.95);
  camera.lookAt(center);
  if (controls) { controls.target.copy(center); controls.update(); }
  return center;
}

function webglOK() {
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); }
  catch (e) { return false; }
}

/* ---------- activity ---------- */

export function start(ctx) {
  const { body, store, sfx } = ctx;
  let live = null;
  if (!webglOK()) {
    body.append(el('p', { class: 'error' }, 'This tablet’s browser can’t show 3D right now. Try updating Chrome.'));
    return;
  }
  showList();

  function center(b) {
    // Shift each build so it sits in the middle of the board.
    const all = b.steps.flatMap(s => s.tiles);
    const box = new THREE.Box3();
    all.forEach(t => t.v.forEach(p => box.expandByPoint(new THREE.Vector3(...p))));
    const c = box.getCenter(new THREE.Vector3());
    return all.length ? [c.x, c.z] : [0, 0];
  }

  function shifted(b) {
    const [cx, cz] = center(b);
    return b.steps.map(s => ({ ...s, tiles: s.tiles.map(t => ({ ...t, v: t.v.map(([x, y, z]) => [x - cx, y, z - cz]) })) }));
  }

  function thumbnails(list) {
    const canvas = document.createElement('canvas');
    const st = makeStage(canvas, 360, 300, true);
    const urls = {};
    list.forEach(b => {
      const steps = shifted(b);
      const group = new THREE.Group();
      let n = 0;
      steps.forEach(s => s.tiles.forEach(t => group.add(tileMesh(t, PALETTE[n++ % PALETTE.length]))));
      st.scene.add(group);
      frameCamera(st.camera, steps.flatMap(s => s.tiles));
      st.renderer.render(st.scene, st.camera);
      urls[b.id] = canvas.toDataURL('image/png');
      st.scene.remove(group);
      group.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    });
    st.renderer.dispose();
    st.renderer.forceContextLoss();
    return urls;
  }

  function showList() {
    stopLive();
    body.innerHTML = '';
    const s = store.get();
    let thumbs = {};
    try { thumbs = thumbnails(BUILDS); } catch (e) { console.warn(e); }
    body.append(
      el('p', { class: 'act-lead' }, 'Pick a build. Spin it with your finger, then build it for real with your tiles.'),
      el('div', { class: 'build-grid' }, BUILDS.map(b => {
        const c = counts(b.steps.flatMap(st => st.tiles));
        return el('button', { class: 'build-card', onclick: () => { sfx.pick(); openBuild(b); } },
          thumbs[b.id] ? el('img', { class: 'build-thumb', src: thumbs[b.id], alt: '' }) : el('div', { class: 'build-thumb' }),
          el('div', { class: 'build-card-foot' },
            el('span', { class: 'build-name' }, b.name),
            pieceChips(c),
            s.build.done[b.id] ? el('span', { class: 'tale-done' }, svg(icons.check), 'Built') : null));
      })),
      el('p', { class: 'muted small center' }, 'Check that you have enough squares and triangles before you start.'),
    );
  }

  function stopLive() {
    if (!live) return;
    cancelAnimationFrame(live.raf);
    live.ro.disconnect();
    live.controls.dispose();
    live.scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } });
    live.renderer.dispose();
    live.renderer.forceContextLoss();
    live = null;
  }

  function openBuild(b) {
    stopLive();
    body.innerHTML = '';
    const steps = shifted(b);
    const allTiles = steps.flatMap(s => s.tiles);
    const canvas = el('canvas', { class: 'build-canvas' });
    const view = el('div', { class: 'build-view' }, canvas,
      el('div', { class: 'build-hint' }, 'Drag to spin · Pinch to zoom'));
    const stepLabel = el('div', { class: 'build-steplabel' });
    const say = el('p', { class: 'build-say' });
    const chips = el('div', { class: 'build-chips' });
    const prev = el('button', { class: 'bigbtn ghost', onclick: () => { sfx.tap(); setStep(cur - 1); } }, svg(icons.back), 'Back');
    const next = el('button', { class: 'bigbtn', onclick: () => { sfx.tap(); if (cur < steps.length - 1) setStep(cur + 1); else done(); } });
    const spinBtn = el('button', { class: 'smallbtn', onclick: () => { live.controls.autoRotate = !live.controls.autoRotate; spinBtn.classList.toggle('on', live.controls.autoRotate); } }, 'Auto-spin');
    body.append(el('div', { class: 'build-play' },
      el('div', { class: 'build-top' }, el('button', { class: 'smallbtn', onclick: () => { sfx.tap(); showList(); } }, '← All builds'), el('h2', {}, b.name), spinBtn),
      view,
      el('div', { class: 'build-panel' }, el('div', { class: 'build-panel-text' }, stepLabel, say, chips), el('div', { class: 'row gap' }, prev, next))));

    const rect = view.getBoundingClientRect();
    const st = makeStage(canvas, rect.width || 600, rect.height || 400);
    const controls = new THREE.OrbitControls(st.camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 2;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.addEventListener('start', () => { controls.autoRotate = false; spinBtn.classList.remove('on'); });
    spinBtn.classList.add('on');
    frameCamera(st.camera, allTiles, controls);

    const groups = [];
    let n = 0;
    steps.forEach(s => {
      const g = new THREE.Group();
      s.tiles.forEach(t => g.add(tileMesh(t, PALETTE[n++ % PALETTE.length])));
      g.visible = false;
      st.scene.add(g);
      groups.push(g);
    });

    const ro = new ResizeObserver(() => {
      const r = view.getBoundingClientRect();
      if (!r.width || !r.height) return;
      st.renderer.setSize(r.width, r.height, false);
      st.camera.aspect = r.width / r.height;
      st.camera.updateProjectionMatrix();
    });
    ro.observe(view);

    let cur = -1;
    let anim = null;
    live = { ...st, controls, ro, raf: 0 };

    const loop = (t) => {
      live.raf = requestAnimationFrame(loop);
      if (anim) {
        const p = Math.min(1, (t - anim.t0) / 650);
        const e = 1 - Math.pow(1 - p, 3);
        anim.group.position.y = (1 - e) * 1.6;
        if (p >= 1) anim = null;
      }
      const glow = 0.18 + 0.14 * Math.sin(t / 260);
      groups.forEach((g, i) => g.children.forEach(m => {
        m.userData.mat.emissive.setRGB(i === cur ? glow : 0, i === cur ? glow : 0, i === cur ? glow * 0.8 : 0);
        m.userData.mat.opacity = i === cur ? 0.78 : 0.55;
      }));
      controls.update();
      st.renderer.render(st.scene, st.camera);
    };
    live.raf = requestAnimationFrame(loop);

    function setStep(i) {
      if (i < 0 || i >= steps.length) return;
      const forward = i > cur;
      cur = i;
      groups.forEach((g, k) => { g.visible = k <= i; });
      if (forward) { anim = { group: groups[i], t0: performance.now() }; sfx.knock(); }
      stepLabel.textContent = `Step ${i + 1} of ${steps.length}`;
      say.textContent = steps[i].say;
      chips.innerHTML = '';
      chips.append(el('span', { class: 'muted' }, 'Add:'), pieceChips(counts(steps[i].tiles)));
      prev.disabled = i === 0;
      next.innerHTML = '';
      if (i < steps.length - 1) next.append('Next step', svg(icons.next));
      else next.append('I built it!');
    }
    setStep(0);

    function done() {
      store.update(s => { s.build.done[b.id] = (s.build.done[b.id] || 0) + 1; });
      controls.autoRotate = true;
      ctx.finish({
        title: 'Master builder!',
        line: `You built the ${b.name}.`,
        grownPrompt: `Show your ${b.name.toLowerCase()} to a grown-up. Then try this together: ${b.challenge}`,
        note: b.id,
        againLabel: 'Another build',
        onAgain: showList,
      });
    }
  }

  return stopLive;
}
