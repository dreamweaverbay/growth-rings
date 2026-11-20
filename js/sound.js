// Sound effects made in code. No voices, no recordings.
import * as store from './store.js';

let ctx = null;
let master = null;

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function on() { return store.get().settings.sound; }

function tone(freq, start, dur, { type = 'sine', vol = 0.3, attack = 0.005, glideTo = null } = {}) {
  const c = ac(); if (!c) return;
  const t0 = c.currentTime + start;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(master);
  o.start(t0); o.stop(t0 + dur + 0.05);
}

function noise(start, dur, { vol = 0.2, filter = 1200, q = 1, type = 'bandpass' } = {}) {
  const c = ac(); if (!c) return null;
  const t0 = c.currentTime + start;
  const len = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = type; f.frequency.value = filter; f.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f); f.connect(g); g.connect(master);
  src.start(t0); src.stop(t0 + dur + 0.02);
  return src;
}

export const sfx = {
  tap() { if (!on()) return; tone(660, 0, 0.06, { type: 'triangle', vol: 0.15 }); },
  pick() { if (!on()) return; tone(520, 0, 0.08, { type: 'triangle', vol: 0.18 }); tone(780, 0.04, 0.08, { type: 'triangle', vol: 0.12 }); },
  good() { if (!on()) return; tone(523, 0, 0.12, { type: 'triangle', vol: 0.22 }); tone(784, 0.09, 0.18, { type: 'triangle', vol: 0.22 }); },
  nope() { if (!on()) return; tone(220, 0, 0.18, { type: 'sine', vol: 0.2, glideTo: 170 }); },
  knock() { if (!on()) return; noise(0, 0.08, { vol: 0.5, filter: 700, q: 3 }); tone(180, 0, 0.1, { vol: 0.25 }); },
  ring() {
    if (!on()) return;
    noise(0, 0.07, { vol: 0.4, filter: 900, q: 4 });
    [392, 494, 587, 784].forEach((f, i) => tone(f, 0.08 + i * 0.09, 0.5, { type: 'sine', vol: 0.16 }));
  },
  finish() {
    if (!on()) return;
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.1, 0.35, { type: 'triangle', vol: 0.2 }));
    tone(1047, 0.42, 0.6, { type: 'sine', vol: 0.12 });
  },
  spark() { if (!on()) return; [1200, 1600, 2100].forEach((f, i) => tone(f, i * 0.05, 0.12, { type: 'sine', vol: 0.08 })); },
  drumroll(seconds = 2) {
    if (!on()) return;
    const hits = Math.floor(seconds * 22);
    for (let i = 0; i < hits; i++) noise(i / 22, 0.05, { vol: 0.15 + (i / hits) * 0.25, filter: 300, q: 1.5 });
  },
  tada() {
    if (!on()) return;
    noise(0, 0.25, { vol: 0.35, filter: 5000, q: 0.7, type: 'highpass' });
    [[392, 494, 587], [523, 659, 784]].forEach((chord, ci) =>
      chord.forEach(f => tone(f, ci * 0.18, ci ? 0.9 : 0.16, { type: 'sawtooth', vol: 0.07 })));
  },
  applause(seconds = 2.5) {
    if (!on()) return;
    const n = Math.floor(seconds * 40);
    for (let i = 0; i < n; i++) {
      const t = Math.random() * seconds;
      noise(t, 0.03, { vol: 0.12 * (1 - t / (seconds * 1.2)), filter: 1800 + Math.random() * 1500, q: 2 });
    }
  },
  onAir() { if (!on()) return; tone(880, 0, 0.15, { type: 'square', vol: 0.06 }); tone(1320, 0.16, 0.3, { type: 'square', vol: 0.06 }); },
  whoosh() { if (!on()) return; noise(0, 0.35, { vol: 0.25, filter: 600, q: 0.8 }); },
};

// Browsers need a tap before audio can start; unlock on first touch.
export function unlockAudio() {
  const go = () => { ac(); window.removeEventListener('pointerdown', go); };
  window.addEventListener('pointerdown', go, { once: true });
}
