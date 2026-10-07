"use client";

import { useState } from "react";
import MiniStaff from "@/components/MiniStaff";
import Quiz, { type Question } from "@/components/Quiz";
import { makeNote, type Step } from "@/lib/notes";
import { optionsWith, pick } from "@/lib/random";
import { playChord, playSequence } from "@/lib/sound";

const STEPS: Step[] = ["c", "d", "e", "f", "g", "a", "b"];
const NUM = ["", "", "2nd", "3rd", "4th", "5th", "6th", "7th", "Octave"];
const QUALITY: Record<string, string> = {
  "2:1": "Minor 2nd", "2:2": "Major 2nd", "3:3": "Minor 3rd", "3:4": "Major 3rd", "4:5": "Perfect 4th", "4:6": "Augmented 4th",
  "5:6": "Diminished 5th", "5:7": "Perfect 5th", "6:8": "Minor 6th", "6:9": "Major 6th", "7:10": "Minor 7th", "7:11": "Major 7th", "8:12": "Octave",
};
const EAR = [
  ["Major 2nd", 2], ["Minor 3rd", 3], ["Major 3rd", 4], ["Perfect 4th", 5], ["Perfect 5th", 7], ["Major 6th", 9], ["Octave", 12],
] as const;

const MODES = [
  { id: "num", label: "Number (3rd, 5th…)" },
  { id: "qual", label: "Number and quality" },
  { id: "ear", label: "By ear" },
] as const;

export default function Intervals() {
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("num");

  function make(): Question {
    if (mode === "ear") {
      const [name, semis] = pick(EAR);
      const low = 55 + Math.floor(Math.random() * 10);
      return {
        prompt: "What interval do you hear?",
        play: () => playSequence([low, low + semis], 0.7),
        options: optionsWith<string>(name, EAR.map((e) => e[0])).sort((x, y) => EAR.findIndex((e) => e[0] === x) - EAR.findIndex((e) => e[0] === y)),
        answer: name,
        onAnswered: () => playChord([low, low + semis], { when: 0.2, dur: 1.6 }),
      };
    }
    const i = Math.floor(Math.random() * 5); // C4–G4
    const n = 2 + Math.floor(Math.random() * 7); // 2nd … octave
    const a = makeNote(STEPS[i], 0, 4);
    const j = i + n - 1;
    const b = makeNote(STEPS[j % 7], 0, 4 + Math.floor(j / 7));
    const semis = b.midi - a.midi;
    const answer = mode === "num" ? NUM[n] : QUALITY[`${n}:${semis}`];
    const pool = mode === "num" ? NUM.filter(Boolean) : Object.values(QUALITY);
    return {
      prompt: "Name the interval",
      visual: <MiniStaff notes={[a, b]} label="Two notes on a treble staff" />,
      play: () => playSequence([a.midi, b.midi], 0.7),
      options: optionsWith(answer, pool).sort((x, y) => pool.indexOf(x) - pool.indexOf(y)),
      answer,
      explain: mode === "num" ? `Count both notes: ${a.step.toUpperCase()} up to ${b.step.toUpperCase()}.` : `${semis} semitones.`,
      onAnswered: () => playSequence([a.midi, b.midi], 0.6),
    };
  }

  return (
    <main className="wrap page">
      <Quiz
        key={mode}
        title="Intervals"
        intro="The distance between two notes. Count the letter names, including both ends: C to E is a 3rd."
        make={make}
        autoPlay={mode === "ear"}
        backHref="/practice"
        backLabel="Back to practice"
        options={
          <div className="row" role="group" aria-label="Mode" style={{ justifyContent: "center", gap: 22 }}>
            {MODES.map((m) => (
              <button key={m.id} className="tbtn" aria-pressed={mode === m.id} onClick={() => setMode(m.id)}>{m.label}</button>
            ))}
          </div>
        }
      />
    </main>
  );
}
