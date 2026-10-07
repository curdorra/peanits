"use client";

import { useState } from "react";
import Quiz, { type Question } from "@/components/Quiz";
import { pick } from "@/lib/random";
import { playChord, playNote } from "@/lib/sound";

type Game = { id: string; title: string; intro: string; make: () => Question };

const triad = (root: number, minor = false) => [root, root + (minor ? 3 : 4), root + 7];

const GAMES: Game[] = [
  {
    id: "pitch",
    title: "Higher or lower?",
    intro: "Two notes. Is the second one higher or lower than the first?",
    make: () => {
      const a = 55 + Math.floor(Math.random() * 14);
      const up = Math.random() < 0.5;
      const b = a + (up ? 1 : -1) * (1 + Math.floor(Math.random() * 7));
      return {
        prompt: "Is the second note higher or lower?",
        play: () => {
          playNote(a, { dur: 0.9 });
          playNote(b, { when: 0.8, dur: 1.2 });
        },
        options: ["Higher", "Lower"],
        answer: up ? "Higher" : "Lower",
      };
    },
  },
  {
    id: "mode",
    title: "Major or minor?",
    intro: "Hear a chord. Major tends to sound bright; minor sounds darker.",
    make: () => {
      const root = 48 + Math.floor(Math.random() * 12);
      const minor = Math.random() < 0.5;
      const t = triad(root, minor);
      return {
        prompt: "Major or minor?",
        play: () => {
          t.forEach((m, i) => playNote(m, { when: i * 0.35, dur: 1.2 }));
          playChord(t, { when: 1.2, dur: 1.8 });
        },
        options: ["Major", "Minor"],
        answer: minor ? "Minor" : "Major",
      };
    },
  },
  {
    id: "metre",
    title: "Two time or three time?",
    intro: "Listen for the strong beats, like the pulse test in an ABRSM aural exam.",
    make: () => {
      const beats = pick([2, 3]);
      const spb = 0.42;
      const root = pick([48, 50, 53, 55]);
      return {
        prompt: "Is it in two time or three time?",
        play: () => {
          for (let i = 0; i < beats * 4; i++) {
            const strong = i % beats === 0;
            const t = i * spb;
            if (strong) playNote(root - 12 + (Math.floor(i / beats) % 2 ? 7 : 0), { when: t, dur: 0.6, vel: 0.9 });
            else playChord([root + 4, root + 7], { when: t, dur: 0.3, vel: 0.35 });
          }
        },
        options: ["Two time", "Three time"],
        answer: beats === 2 ? "Two time" : "Three time",
      };
    },
  },
  {
    id: "cadence",
    title: "Perfect or imperfect cadence?",
    intro: "A perfect cadence ends on the home chord and sounds finished. An imperfect cadence stops on chord V, like a question.",
    make: () => {
      const tonic = pick([48, 53, 55, 50]);
      const I = triad(tonic + 12);
      const IV = triad(tonic + 17);
      const V = triad(tonic + 19);
      const perfect = Math.random() < 0.5;
      const prog = perfect ? [I, IV, V, I] : [I, IV, I, V];
      const bass = perfect ? [0, 5, 7, 0] : [0, 5, 0, 7];
      return {
        prompt: "Perfect (finished) or imperfect (unfinished)?",
        play: () =>
          prog.forEach((c, i) => {
            playChord(c, { when: i * 0.9, dur: 1.1 });
            playNote(tonic + bass[i] - 12, { when: i * 0.9, dur: 1.1 });
          }),
        options: ["Perfect", "Imperfect"],
        answer: perfect ? "Perfect" : "Imperfect",
      };
    },
  },
];

export default function Ear() {
  const [game, setGame] = useState<Game | null>(null);
  if (game) {
    return (
      <main className="wrap page">
        <Quiz key={game.id} title={game.title} intro={game.intro} make={game.make} autoPlay backHref="/practice/ear" backLabel="Other ear games" />
        <p className="center muted small" style={{ textAlign: "center" }}>
          <button className="tbtn" onClick={() => setGame(null)}>All ear games</button>
        </p>
      </main>
    );
  }
  return (
    <main className="wrap page">
      <div className="stack">
        <h1 className="display">Ear training</h1>
        <p className="muted" style={{ maxWidth: "50ch" }}>Short listening games. Turn your sound on; no microphone needed.</p>
      </div>
      <nav className="choices" aria-label="Ear games">
        {GAMES.map((g) => (
          <button key={g.id} className="choice" onClick={() => setGame(g)} style={{ background: "none", border: 0, borderTop: "1px solid var(--rule)", color: "inherit", font: "inherit", textAlign: "left", cursor: "pointer", width: "100%" }}>
            <div>
              <h2>{g.title}</h2>
              <p>{g.intro}</p>
            </div>
            <span className="go" aria-hidden="true">→</span>
          </button>
        ))}
      </nav>
    </main>
  );
}
