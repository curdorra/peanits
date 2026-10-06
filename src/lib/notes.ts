export type Clef = "treble" | "bass";
export type Step = "c" | "d" | "e" | "f" | "g" | "a" | "b";
export type Alter = -1 | 0 | 1;

/** A spelled note: C♯4 and D♭4 share a MIDI number but are different notes on the page. */
export type Note = { midi: number; step: Step; alter: Alter; octave: number };
export type Target = { clef: Clef; note: Note };
export type Section = { clef: Clef; low: number; high: number };

const STEPS: Step[] = ["c", "d", "e", "f", "g", "a", "b"];
const STEP_PC: Record<Step, number> = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
const SHARP_NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

export function makeNote(step: Step, alter: Alter, octave: number): Note {
  return { step, alter, octave, midi: 12 * (octave + 1) + STEP_PC[step] + alter };
}

export function noteName(n: Note): string {
  return n.step.toUpperCase() + (n.alter === 1 ? "♯" : n.alter === -1 ? "♭" : "") + n.octave;
}

export function midiName(midi: number): string {
  return SHARP_NAMES[midi % 12] + (Math.floor(midi / 12) - 1);
}

export function vexKey(n: Note): string {
  return `${n.step}${n.alter === 1 ? "#" : n.alter === -1 ? "b" : ""}/${n.octave}`;
}

// Spellings we avoid in teaching material: E♯, B♯, F♭, C♭.
function isAwkward(step: Step, alter: Alter) {
  return (alter === 1 && (step === "e" || step === "b")) || (alter === -1 && (step === "f" || step === "c"));
}

export function notesInRange(low: number, high: number, alters: Alter[]): Note[] {
  const out: Note[] = [];
  for (let octave = 0; octave <= 8; octave++) {
    for (const step of STEPS) {
      for (const alter of alters) {
        if (isAwkward(step, alter)) continue;
        const n = makeNote(step, alter, octave);
        if (n.midi >= low && n.midi <= high) out.push(n);
      }
    }
  }
  return out;
}

export function poolFor(sections: Section[], alters: Alter[]): Target[] {
  return sections.flatMap((s) => notesInRange(s.low, s.high, alters).map((note) => ({ clef: s.clef, note })));
}

export function freqToMidiFloat(hz: number): number {
  return 69 + 12 * Math.log2(hz / 440);
}
