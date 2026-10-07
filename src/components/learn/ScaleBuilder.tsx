"use client";

import { useState } from "react";
import Keyboard, { type KeyMark } from "../Keyboard";
import { midiName } from "@/lib/notes";
import { playSequence } from "@/lib/sound";

const MAJOR = [2, 2, 1, 2, 2, 2, 1];
const MINOR = [2, 1, 2, 2, 1, 2, 2]; // natural minor

/** Pick a starting key; the tone/semitone pattern builds a major (or minor) scale. */
export default function ScaleBuilder() {
  const [start, setStart] = useState(60);
  const [minor, setMinor] = useState(false);
  const pattern = minor ? MINOR : MAJOR;
  const notes = pattern.reduce((acc, s) => [...acc, acc[acc.length - 1] + s], [start]);
  const marks: Record<number, KeyMark> = {};
  notes.forEach((m) => (marks[m] = "hint"));
  const play = (s = start, mi = minor) => {
    const p = mi ? MINOR : MAJOR;
    playSequence(p.reduce((acc, x) => [...acc, acc[acc.length - 1] + x], [s]), 0.32, { dur: 0.6 });
  };
  return (
    <div className="widget">
      <div className="row" role="group" aria-label="Scale" style={{ justifyContent: "center", gap: 22 }}>
        <button className="tbtn" aria-pressed={!minor} onClick={() => { setMinor(false); play(start, false); }}>Major</button>
        <button className="tbtn" aria-pressed={minor} onClick={() => { setMinor(true); play(start, true); }}>Natural minor</button>
      </div>
      <Keyboard low={48} high={84} marks={marks} sound={false} onKey={(m) => { setStart(m); play(m); }} label="Keyboard: tap a starting note" />
      <p className="muted small num" aria-live="polite">
        {pattern.map((s) => (s === 2 ? "T" : "S")).join(" ")}
        {"  ·  "}
        {notes.map((m) => midiName(m).replace(/\d/, "")).join(" ")}
      </p>
    </div>
  );
}
