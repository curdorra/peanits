"use client";

import { useState } from "react";
import MiniStaff from "@/components/MiniStaff";
import Quiz, { type Question } from "@/components/Quiz";
import { KEYS, MAJOR_KEYS, MINOR_KEYS, degreeNote, signatureSteps } from "@/lib/keys";
import { optionsWith, pick } from "@/lib/random";
import { playChord } from "@/lib/sound";

const LEVELS = [
  { id: "2", label: "Up to 2 sharps or flats", max: 2, minor: false },
  { id: "4", label: "Up to 4", max: 4, minor: false },
  { id: "7", label: "All major keys", max: 7, minor: false },
  { id: "m", label: "Minor keys", max: 7, minor: true },
];


export default function KeysGame() {
  const [level, setLevel] = useState(LEVELS[0]);

  function make(): Question {
    const ids = (level.minor ? MINOR_KEYS : MAJOR_KEYS).filter((id) => Math.abs(KEYS[id].acc) <= level.max);
    const id = pick(ids);
    const key = KEYS[id];
    const steps = signatureSteps(key);
    const accName = key.acc > 0 ? "sharp" : "flat";
    const sym = key.acc > 0 ? "♯" : "♭";
    const names = ids.map((x) => KEYS[x].name);
    const clef = pick(["treble", "bass"] as const);
    const triad = [0, 2, 4].map((d) => degreeNote(key, d, 4).midi);
    return {
      prompt: level.minor ? "Which minor key has this signature?" : "Which major key has this signature?",
      visual: <MiniStaff clef={clef} keyId={id} label={`Key signature with ${Math.abs(key.acc) || "no"} ${accName}s`} />,
      options: optionsWith(key.name, names),
      answer: key.name,
      explain: steps.length
        ? `${steps.length} ${accName}${steps.length > 1 ? "s" : ""}: ${steps.map((s) => s.toUpperCase() + sym).join(", ")}.`
        : "No sharps or flats.",
      onAnswered: () => playChord(triad, { dur: 1.6 }),
    };
  }

  return (
    <main className="wrap page">
      <Quiz
        title="Key signatures"
        intro="See a key signature, name the key. You'll hear its home chord after each answer."
        make={make}
        backHref="/practice"
        backLabel="Back to practice"
        options={
          <div className="row" role="group" aria-label="Level" style={{ justifyContent: "center", gap: 22 }}>
            {LEVELS.map((l) => (
              <button key={l.id} className="tbtn" aria-pressed={level.id === l.id} onClick={() => setLevel(l)}>{l.label}</button>
            ))}
          </div>
        }
      />
      <p className="muted small center" style={{ textAlign: "center" }}>
        Tip: in a sharp key, the major key is a half step above the last sharp. In a flat key, it&apos;s the second-to-last flat.
      </p>
    </main>
  );
}
