"use client";

// A small additive "piano-ish" synth and a metronome click, built on the Web Audio API.
// Never play sounds while the microphone is listening: the mic would hear them.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function audio(): { c: AudioContext; out: GainNode } {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { c: ctx, out: master! };
}

export const midiToHz = (m: number) => 440 * 2 ** ((m - 69) / 12);

const PARTIALS = [1, 2, 3, 4, 5, 6, 7];
const AMPS = [1, 0.45, 0.25, 0.12, 0.08, 0.05, 0.03];

/** Play one note. `when` is seconds from now. */
export function playNote(midi: number, { when = 0, dur = 1.4, vel = 0.7 } = {}) {
  const { c, out } = audio();
  const t = c.currentTime + when;
  const f = midiToHz(midi);
  const env = c.createGain();
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = Math.min(9000, f * 8);
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.32 * vel, t + 0.008);
  env.gain.exponentialRampToValueAtTime(0.12 * vel, t + 0.25);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  env.connect(lp).connect(out);
  PARTIALS.forEach((p, i) => {
    if (f * p > 12000) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.frequency.value = f * p * (1 + i * 0.0004); // slight inharmonicity
    g.gain.value = AMPS[i];
    // higher partials die away sooner
    g.gain.setValueAtTime(AMPS[i], t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, AMPS[i] * 0.05), t + dur / (1 + i * 0.6));
    o.connect(g).connect(env);
    o.start(t);
    o.stop(t + dur + 0.05);
  });
}

export function playChord(midis: number[], opts: { when?: number; dur?: number; vel?: number } = {}) {
  midis.forEach((m) => playNote(m, { ...opts, vel: (opts.vel ?? 0.7) * 0.8 }));
}

/** Play notes one after another. */
export function playSequence(midis: number[], gap = 0.5, opts: { dur?: number } = {}) {
  midis.forEach((m, i) => playNote(m, { when: i * gap, dur: opts.dur ?? gap * 2 }));
}

/** A short wooden metronome click. */
export function click(accent = false, when = 0) {
  const { c, out } = audio();
  const t = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "square";
  o.frequency.value = accent ? 1600 : 1100;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(accent ? 0.35 : 0.22, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + 0.06);
}

export const now = () => audio().c.currentTime;

/** Seconds between scheduling a sound and hearing it. */
export function latency() {
  const { c } = audio();
  return (c.outputLatency || 0) + (c.baseLatency || 0);
}
