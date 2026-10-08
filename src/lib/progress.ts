"use client";

import { createStore } from "./store";
import { PASS_ACCURACY } from "./curriculum";

export type NoteStat = { n: number; hit: number; ms: number }; // attempts, first-try hits, total ms to the correct note
export type UnitStat = { passed: boolean; best: number; rounds: number };
export type Progress = {
  notes: Record<string, NoteStat>; // keyed by MIDI number
  units: Record<string, UnitStat>;
  days: string[]; // YYYY-MM-DD (local) on which a round was completed
  rounds: number;
  lessons: Record<string, boolean>; // completed Learn lessons
};

export type Source = "mic" | "midi" | "screen";
export type Settings = { source: Source; length: number };

export const progressStore = createStore<Progress>("peanits-progress-v1", { notes: {}, units: {}, days: [], rounds: 0, lessons: {} });
export const settingsStore = createStore<Settings>("peanits-settings-v1", { source: "mic", length: 20 });

export const useProgress = progressStore.use;
export const useSettings = settingsStore.use;

export const dayKey = (d = new Date()) => d.toLocaleDateString("en-CA");

export type Attempt = { midi: number; hit: boolean; ms: number };

export function recordRound(attempts: Attempt[], unitId?: string) {
  progressStore.update((p) => {
    const notes = { ...p.notes };
    for (const a of attempts) {
      const s = notes[a.midi] ?? { n: 0, hit: 0, ms: 0 };
      notes[a.midi] = { n: s.n + 1, hit: s.hit + (a.hit ? 1 : 0), ms: s.ms + a.ms };
    }
    const units = { ...p.units };
    if (unitId && attempts.length) {
      const acc = attempts.filter((a) => a.hit).length / attempts.length;
      const prev = units[unitId] ?? { passed: false, best: 0, rounds: 0 };
      units[unitId] = {
        passed: prev.passed || acc >= PASS_ACCURACY,
        best: Math.max(prev.best, acc),
        rounds: prev.rounds + 1,
      };
    }
    const today = dayKey();
    const days = p.days.includes(today) ? p.days : [...p.days, today].slice(-400);
    return { ...p, notes, units, days, rounds: p.rounds + 1 };
  });
}

/** Consecutive practice days ending today (or yesterday, so the streak survives until you've had a chance to play). */
export function streakOf(days: string[]): number {
  const set = new Set(days);
  const d = new Date();
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(dayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

/** Whole days since the last practice day; 0 when there is none yet or you practised today. */
export function daysSinceLast(days: string[]): number {
  if (!days.length) return 0;
  const last = new Date(`${days[days.length - 1]}T00:00:00`);
  const today = new Date(`${dayKey()}T00:00:00`);
  return Math.max(0, Math.round((today.getTime() - last.getTime()) / 86400000));
}

export function lastSevenDays(days: string[]): boolean[] {
  const set = new Set(days);
  const out: boolean[] = [];
  const d = new Date();
  for (let i = 6; i >= 0; i--) {
    const x = new Date(d);
    x.setDate(d.getDate() - i);
    out.push(set.has(dayKey(x)));
  }
  return out;
}

export const avgMs = (s: NoteStat) => s.ms / Math.max(1, s.n);

/** Practice weight: unfamiliar, missed and slow notes come up more often. */
export function weightFor(midi: number, notes: Record<string, NoteStat>): number {
  const s = notes[midi];
  if (!s) return 1.5;
  const miss = 1 - s.hit / s.n;
  const slow = Math.min(avgMs(s) / 4000, 1);
  return 0.6 + 2 * miss + slow;
}

export function completeLesson(slug: string) {
  progressStore.update((p) => ({ ...p, lessons: { ...p.lessons, [slug]: true } }));
}
