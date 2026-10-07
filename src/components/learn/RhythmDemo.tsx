"use client";

import { useMemo } from "react";
import Score from "../Score";
import { KEYS } from "@/lib/keys";
import { makeNote } from "@/lib/notes";
import { BEATS, parseTime, type Dur, type Melody } from "@/lib/sightread";
import { click, playNote } from "@/lib/sound";

/** Rhythm on a single pitch, with a Play button that counts in and plays it. */
export default function RhythmDemo({ time, bars, bpm = 80, label }: { time: string; bars: Dur[][]; bpm?: number; label?: string }) {
  const melody: Melody = useMemo(
    () => ({ key: KEYS.C, time, clef: "treble", bars: bars.map((b) => b.map((dur) => ({ dur, note: makeNote("b", 0, 4) }))), tempo: { word: label ?? "", bpm } }),
    [time, bars, bpm, label],
  );
  function play() {
    const spb = 60 / bpm;
    const { n, d, compound } = parseTime(time);
    const beatLen = compound ? 1.5 : 4 / d;
    const perBar = compound ? n / 3 : n;
    const totalBeats = perBar * (bars.length + 1);
    for (let i = 0; i < totalBeats; i++) click(i % perBar === 0, 0.1 + i * beatLen * spb);
    let t = 0.1 + perBar * beatLen * spb;
    for (const dur of bars.flat()) {
      playNote(72, { when: t, dur: Math.max(0.25, BEATS[dur] * spb * 0.9), vel: 0.55 });
      t += BEATS[dur] * spb;
    }
  }
  return (
    <div className="widget">
      <Score melody={melody} />
      <button className="tbtn" onClick={play}>▶ Play (one bar counted in)</button>
    </div>
  );
}
