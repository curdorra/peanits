import { makeNote, type Alter, type Note, type Step } from "./notes";

export type Mode = "major" | "minor";
export type KeyDef = {
  id: string; // VexFlow key spec, e.g. "Bb", "F#m"
  name: string; // "B♭ major"
  tonic: Step;
  tonicAlter: Alter;
  mode: Mode;
  acc: number; // number of sharps (+) or flats (−) in the signature
};

const STEPS: Step[] = ["c", "d", "e", "f", "g", "a", "b"];
const PC: Record<Step, number> = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
const SHARP_ORDER: Step[] = ["f", "c", "g", "d", "a", "e", "b"];
const FLAT_ORDER: Step[] = ["b", "e", "a", "d", "g", "c", "f"];
const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const MINOR = [0, 2, 3, 5, 7, 8, 10];

function k(id: string, tonic: Step, tonicAlter: Alter, mode: Mode, acc: number): KeyDef {
  const t = tonic.toUpperCase() + (tonicAlter === 1 ? "♯" : tonicAlter === -1 ? "♭" : "");
  return { id, name: `${t} ${mode}`, tonic, tonicAlter, mode, acc };
}

export const KEYS: Record<string, KeyDef> = Object.fromEntries(
  [
    k("C", "c", 0, "major", 0), k("G", "g", 0, "major", 1), k("D", "d", 0, "major", 2), k("A", "a", 0, "major", 3),
    k("E", "e", 0, "major", 4), k("B", "b", 0, "major", 5), k("F#", "f", 1, "major", 6), k("C#", "c", 1, "major", 7),
    k("F", "f", 0, "major", -1), k("Bb", "b", -1, "major", -2), k("Eb", "e", -1, "major", -3), k("Ab", "a", -1, "major", -4),
    k("Db", "d", -1, "major", -5), k("Gb", "g", -1, "major", -6), k("Cb", "c", -1, "major", -7),
    k("Am", "a", 0, "minor", 0), k("Em", "e", 0, "minor", 1), k("Bm", "b", 0, "minor", 2), k("F#m", "f", 1, "minor", 3),
    k("C#m", "c", 1, "minor", 4), k("G#m", "g", 1, "minor", 5), k("D#m", "d", 1, "minor", 6),
    k("Dm", "d", 0, "minor", -1), k("Gm", "g", 0, "minor", -2), k("Cm", "c", 0, "minor", -3), k("Fm", "f", 0, "minor", -4),
    k("Bbm", "b", -1, "minor", -5), k("Ebm", "e", -1, "minor", -6),
  ].map((d) => [d.id, d]),
);

/** The alteration the key signature gives to each letter. */
export function signatureAlters(key: KeyDef): Record<Step, Alter> {
  const out = { c: 0, d: 0, e: 0, f: 0, g: 0, a: 0, b: 0 } as Record<Step, Alter>;
  const n = Math.abs(key.acc);
  const order = key.acc > 0 ? SHARP_ORDER : FLAT_ORDER;
  for (let i = 0; i < n; i++) out[order[i]] = (key.acc > 0 ? 1 : -1) as Alter;
  return out;
}

export function signatureSteps(key: KeyDef): Step[] {
  const n = Math.abs(key.acc);
  return (key.acc > 0 ? SHARP_ORDER : FLAT_ORDER).slice(0, n);
}

/**
 * The note on a scale degree (0 = tonic, 7 = tonic an octave up, negative = below).
 * `tonicOctave` is the octave of the tonic for degree 0. `raise7` sharpens the 7th in minor (harmonic minor).
 */
export function degreeNote(key: KeyDef, degree: number, tonicOctave: number, raise7 = false): Note {
  const pattern = key.mode === "major" ? MAJOR : MINOR;
  const oct = Math.floor(degree / 7);
  const d = ((degree % 7) + 7) % 7;
  const tonicIdx = STEPS.indexOf(key.tonic);
  const letterIdx = tonicIdx + d;
  const step = STEPS[letterIdx % 7];
  const octave = tonicOctave + oct + Math.floor(letterIdx / 7);
  const tonicPc = PC[key.tonic] + key.tonicAlter;
  let target = tonicPc + pattern[d] + (raise7 && key.mode === "minor" && d === 6 ? 1 : 0);
  // semitone distance from the plain letter, kept in −2..2
  let alter = target - (PC[step] + 12 * Math.floor(letterIdx / 7));
  while (alter > 6) alter -= 12;
  while (alter < -6) alter += 12;
  target = alter;
  return makeNote(step, target as Alter, octave);
}

/** Choose an octave so the tonic falls in [lo, hi] (MIDI). */
export function tonicOctaveIn(key: KeyDef, lo: number, hi: number): number {
  for (let o = 1; o <= 7; o++) {
    const m = makeNote(key.tonic, key.tonicAlter, o).midi;
    if (m >= lo && m <= hi) return o;
  }
  return 4;
}

export function scaleMidis(key: KeyDef, tonicOctave: number, harmonic = false): number[] {
  return Array.from({ length: 8 }, (_, i) => degreeNote(key, i, tonicOctave, harmonic && i === 6).midi);
}

export const MAJOR_KEYS = ["C", "G", "D", "A", "E", "B", "F#", "C#", "F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"];
export const MINOR_KEYS = ["Am", "Em", "Bm", "F#m", "C#m", "G#m", "D#m", "Dm", "Gm", "Cm", "Fm", "Bbm", "Ebm"];
