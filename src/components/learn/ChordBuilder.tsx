"use client";

import { useState } from "react";
import Keyboard, { type KeyMark } from "../Keyboard";
import { midiName } from "@/lib/notes";
import { playChord } from "@/lib/sound";

/** Tap a root; see and hear the major or minor triad built on it. */
export default function ChordBuilder() {
  const [root, setRoot] = useState(60);
  const [minor, setMinor] = useState(false);
  const notes = [root, root + (minor ? 3 : 4), root + 7];
  const marks: Record<number, KeyMark> = {};
  notes.forEach((m) => (marks[m] = "hint"));
  return (
    <div className="widget">
      <div className="row" role="group" aria-label="Chord quality" style={{ justifyContent: "center", gap: 22 }}>
        <button className="tbtn" aria-pressed={!minor} onClick={() => { setMinor(false); playChord([root, root + 4, root + 7]); }}>Major</button>
        <button className="tbtn" aria-pressed={minor} onClick={() => { setMinor(true); playChord([root, root + 3, root + 7]); }}>Minor</button>
      </div>
      <Keyboard
        low={48}
        high={76}
        marks={marks}
        sound={false}
        onKey={(m) => {
          setRoot(m);
          playChord([m, m + (minor ? 3 : 4), m + 7]);
        }}
        label="Keyboard: tap a key to build a chord on it"
      />
      <p className="muted small num" aria-live="polite">
        {midiName(root).replace(/\d/, "")} {minor ? "minor" : "major"}: {notes.map((m) => midiName(m).replace(/\d/, "")).join(" – ")}
        {"  ·  "}root, {minor ? "minor" : "major"} 3rd, perfect 5th
      </p>
    </div>
  );
}
