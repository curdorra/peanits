import { KEYS, degreeNote, tonicOctaveIn, type KeyDef } from "./keys";
import type { Clef, Note } from "./notes";

/** VexFlow durations we use. "d" = dotted. */
export type Dur = "w" | "hd" | "h" | "qd" | "q" | "8d" | "8" | "16";
export const BEATS: Record<Dur, number> = { w: 4, hd: 3, h: 2, qd: 1.5, q: 1, "8d": 0.75, "8": 0.5, "16": 0.25 }; // in crotchets

export type Ev = { dur: Dur; rest?: boolean; note?: Note };
export type Melody = {
  key: KeyDef;
  time: string; // "3/4"
  clef: Clef;
  bars: Ev[][];
  tempo: { word: string; bpm: number };
};

/** What a test at a level may contain. Built from ABRSM's published sight-reading parameters. */
export type SRSpec = {
  level: number; // 0 = Initial … 8 = Grade 8
  keys: string[];
  times: string[];
  bars: number;
  span: number; // melodic range in scale degrees (4 = a fifth)
  quavers: boolean;
  dotted: boolean; // dotted crotchet + quaver
  semis: boolean; // simple semiquaver patterns
  rests: boolean;
  harmonicMinor: boolean; // occasional raised 7th in minor keys
  tempo: [number, number];
};

const cum = <T,>(lists: T[][], upto: number): T[] => lists.slice(0, upto + 1).flat();

// Keys and time signatures introduced at each grade (ABRSM Piano sight-reading parameters,
// 2025–2028 syllabuses; parameters are cumulative).
const KEYS_BY_GRADE = [
  ["C", "Dm"],
  ["G", "F", "Am"],
  ["D", "Em", "Gm"],
  ["A", "Bb", "Eb", "Bm"],
  [],
  ["E", "Ab", "F#m", "Cm"],
  ["C#m", "Fm"],
  [],
  ["B", "Db"],
];
const TIMES_BY_GRADE = [["4/4"], ["2/4", "3/4"], [], ["3/8"], ["6/8"], [], ["9/8", "5/8", "5/4"], ["7/8", "7/4"], ["12/8"]];

export function specForLevel(level: number): SRSpec {
  const L = Math.max(0, Math.min(8, level));
  return {
    level: L,
    keys: cum(KEYS_BY_GRADE, L),
    times: cum(TIMES_BY_GRADE, L),
    bars: [4, 4, 6, 8, 8, 8, 8, 8, 8][L],
    span: [4, 4, 5, 7, 7, 8, 9, 9, 10][L],
    quavers: L >= 0,
    dotted: L >= 2,
    semis: L >= 3,
    rests: L >= 1,
    harmonicMinor: L >= 1,
    tempo: [
      [60, 72], [66, 80], [66, 88], [72, 96], [72, 100], [76, 108], [80, 112], [80, 116], [84, 120],
    ][L] as [number, number],
  };
}

/* ---------- rhythm ---------- */
type Cell = Dur[];

function rnd(n: number) {
  return Math.floor(Math.random() * n);
}
function pick<T>(xs: T[]): T {
  return xs[rnd(xs.length)];
}
function weighted<T>(xs: [T, number][]): T {
  let r = Math.random() * xs.reduce((a, [, w]) => a + w, 0);
  for (const [x, w] of xs) {
    r -= w;
    if (r <= 0) return x;
  }
  return xs[xs.length - 1][0];
}

export function parseTime(t: string) {
  const [n, d] = t.split("/").map(Number);
  const compound = d === 8 && n % 3 === 0 && n > 3;
  return { n, d, compound, barBeats: (n * 4) / d };
}

/** Fill one bar with rhythm cells that add up exactly. */
export function fillBar(time: string, spec: SRSpec): Cell {
  const { d, compound, barBeats } = parseTime(time);
  const out: Dur[] = [];
  let left = barBeats;

  if (compound || time === "3/8") {
    // dotted-crotchet beats
    const cells: [Cell, number][] = [
      [["qd"], 3],
      [["q", "8"], 3],
      [["8", "8", "8"], 2],
    ];
    while (left > 0.01) {
      if (left >= 3 - 0.01 && Math.random() < 0.15) {
        out.push("hd");
        left -= 3;
        continue;
      }
      out.push(...weighted(cells));
      left -= 1.5;
    }
    return out;
  }

  if (d === 8) {
    // irregular quaver metres (5/8, 7/8): groups of 2 and 3 quavers
    let q = Math.round(left * 2);
    while (q > 0) {
      const g = q === 2 || q === 4 ? 2 : q === 3 ? 3 : pick([2, 3]);
      out.push(...(g === 2 ? weighted<Cell>([[["q"], 3], [["8", "8"], 2]]) : weighted<Cell>([[["qd"], 3], [["q", "8"], 2], [["8", "8", "8"], 1]])));
      q -= g;
    }
    return out;
  }

  // simple time, crotchet beats
  const cells: [Cell, number][] = [
    [["q"], 6],
    [["h"], 3],
  ];
  if (spec.quavers) cells.push([["8", "8"], spec.level === 0 ? 1 : 3]);
  if (spec.dotted) cells.push([["qd", "8"], 2]);
  if (spec.semis) cells.push([["8", "16", "16"], 1], [["16", "16", "8"], 1]);
  if (spec.level >= 1) cells.push([["hd"], 1]);
  if (spec.level >= 2) cells.push([["w"], 1]);
  while (left > 0.01) {
    const fit = cells.filter(([c]) => c.reduce((a, x) => a + BEATS[x], 0) <= left + 0.001);
    const c = weighted(fit);
    out.push(...c);
    left -= c.reduce((a, x) => a + BEATS[x], 0);
  }
  return out;
}

function lastBar(time: string): Dur[] {
  const { n, d, compound } = parseTime(time);
  const beats = (n * 4) / d;
  const single: Partial<Record<number, Dur>> = { 4: "w", 3: "hd", 2: "h", 1.5: "qd" };
  if (single[beats]) return [single[beats]!];
  if (compound && beats === 4.5) return ["hd", "qd"];
  if (beats === 6) return ["hd", "hd"];
  if (beats === 5) return ["hd", "h"];
  if (beats === 2.5) return ["h", "8"];
  if (beats === 3.5) return ["hd", "8"];
  if (beats === 7) return ["w", "hd"];
  return ["q"];
}

/* ---------- melody ---------- */

export function generateMelody(spec: SRSpec, clefChoice?: Clef): Melody {
  const key = KEYS[pick(spec.keys)];
  const time = pick(spec.times);
  const clef: Clef = clefChoice ?? (Math.random() < 0.5 ? "treble" : "bass");
  const tOct = clef === "treble" ? tonicOctaveIn(key, 60, 67) : tonicOctaveIn(key, 48, 55);

  // a window of scale degrees that always contains the tonic
  const span = spec.span;
  // Initial: tonic to dominant only; Grade 1: any five-finger position around the tonic
  const lowest = spec.level === 0 ? 0 : spec.level === 1 ? pick([0, 0, -3]) : -Math.min(3, rnd(span - 3) + 1);
  const lo = Math.min(0, lowest);
  const hi = lo + span;

  const rhythm: Dur[][] = [];
  for (let b = 0; b < spec.bars - 1; b++) rhythm.push(fillBar(time, spec));
  rhythm.push(lastBar(time));

  const bars: Ev[][] = [];
  let deg = pick([0, 0, 2, 4].filter((d) => d >= lo && d <= hi));
  let prev = Number.NaN;
  const total = rhythm.reduce((a, r) => a + r.length, 0);
  let i = 0;

  for (let b = 0; b < rhythm.length; b++) {
    const bar: Ev[] = [];
    for (const dur of rhythm[b]) {
      i++;
      const isLast = i === total;
      const isPenult = i === total - 1;
      // occasional rest, never at the start or end, never inside a quaver group
      if (spec.rests && i > 2 && !isLast && !isPenult && (dur === "q" || dur === "h") && Math.random() < 0.07) {
        bar.push({ dur, rest: true });
        continue;
      }
      if (i > 1) {
        if (isLast) {
          deg = Math.abs(deg - 7) < Math.abs(deg) && 7 <= hi ? 7 : 0;
        } else if (isPenult) {
          const target = Math.abs(deg - 7) < Math.abs(deg) && 7 <= hi ? 7 : 0;
          const options = [target + 1, target - 1, target + 2].filter((d) => d >= lo && d <= hi && d !== prev);
          deg = options.length ? pick(options) : target + 1;
        } else {
          // mostly steps; leaps grow a little with the grade
          const leap = Math.min(1, spec.level / 6);
          const step = weighted<number>([
            [1, 6], [-1, 6], [2, 2 + leap], [-2, 2 + leap], [3, 0.4 + leap], [-3, 0.4 + leap], [4, 0.1 + leap * 0.6], [-4, 0.1 + leap * 0.6],
          ]);
          let next = deg + step;
          if (next > hi || next < lo) next = deg - step;
          next = Math.max(lo, Math.min(hi, next));
          if (next === deg) next = deg + (deg < hi ? 1 : -1); // avoid repeated notes (the mic can't hear a re-strike)
          deg = next;
        }
      }
      const raise = spec.harmonicMinor && key.mode === "minor" && ((deg % 7) + 7) % 7 === 6 && Math.random() < 0.7;
      let note = degreeNote(key, deg, tOct, raise);
      if (Math.abs(note.alter) > 1) note = degreeNote(key, deg, tOct, false);
      bar.push({ dur, note });
      prev = deg;
    }
    bars.push(bar);
  }

  const bpm = spec.tempo[0] + rnd(Math.floor((spec.tempo[1] - spec.tempo[0]) / 4) + 1) * 4;
  const word = bpm < 66 ? "Andante" : bpm < 80 ? "Moderato" : bpm < 100 ? "Allegretto" : "Allegro";
  return { key, time, clef, bars, tempo: { word, bpm } };
}

/** The notes (not rests) in playing order. */
export function melodyNotes(m: Melody): Note[] {
  return m.bars.flat().filter((e) => !e.rest && e.note).map((e) => e.note!);
}
