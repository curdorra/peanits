import type { Alter, Section } from "./notes";

export type Unit = {
  id: string;
  grade: number;
  title: string;
  blurb: string;
  sections: Section[];
  alters: Alter[];
};

export const PASS_ACCURACY = 0.85; // first-try accuracy needed to complete a unit
export const ROUND_LENGTH = 20;

const T = (low: number, high: number): Section => ({ clef: "treble", low, high });
const B = (low: number, high: number): Section => ({ clef: "bass", low, high });

// MIDI: C4 = 60 (middle C). Grade names are our own and not tied to any exam board.
export const UNITS: Unit[] = [
  { id: "1-1", grade: 1, title: "Middle C position", blurb: "C D E F G in the treble clef.", sections: [T(60, 67)], alters: [0] },
  { id: "1-2", grade: 1, title: "The treble octave", blurb: "Middle C up to the C above.", sections: [T(60, 72)], alters: [0] },
  { id: "1-3", grade: 1, title: "Bass C position", blurb: "C D E F G in the bass clef.", sections: [B(48, 55)], alters: [0] },
  { id: "1-4", grade: 1, title: "The bass octave", blurb: "From the C below the staff to middle C.", sections: [B(48, 60)], alters: [0] },
  { id: "1-5", grade: 1, title: "Both hands", blurb: "Treble and bass around middle C.", sections: [T(60, 72), B(48, 60)], alters: [0] },
  { id: "2-1", grade: 2, title: "Above the staff", blurb: "Treble notes up to A, with ledger lines.", sections: [T(60, 81)], alters: [0] },
  { id: "2-2", grade: 2, title: "Below the staff", blurb: "Bass notes down to E, with ledger lines.", sections: [B(40, 60)], alters: [0] },
  { id: "2-3", grade: 2, title: "Across the grand staff", blurb: "Wider ranges in both clefs.", sections: [T(60, 79), B(41, 60)], alters: [0] },
  { id: "3-1", grade: 3, title: "Sharps", blurb: "Naturals and sharps in both clefs.", sections: [T(60, 76), B(45, 60)], alters: [0, 1] },
  { id: "3-2", grade: 3, title: "Flats", blurb: "Naturals and flats in both clefs.", sections: [T(60, 76), B(45, 60)], alters: [0, -1] },
  { id: "3-3", grade: 3, title: "Sharps and flats", blurb: "Everything so far, mixed.", sections: [T(59, 79), B(41, 62)], alters: [-1, 0, 1] },
];

export const GRADES = [1, 2, 3] as const;
export const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export const unitById = (id: string) => UNITS.find((u) => u.id === id);
export const unitsOfGrade = (g: number) => UNITS.filter((u) => u.grade === g);
