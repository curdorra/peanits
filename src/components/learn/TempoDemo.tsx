"use client";

import { useState } from "react";
import { click } from "@/lib/sound";

const TEMPI: [string, number, string][] = [
  ["Largo", 50, "broadly"],
  ["Adagio", 66, "slowly, at ease"],
  ["Andante", 84, "at a walking pace"],
  ["Moderato", 104, "moderately"],
  ["Allegro", 132, "quick and lively"],
  ["Presto", 176, "very fast"],
];

/** Hear what tempo words feel like on a metronome. */
export default function TempoDemo() {
  const [on, setOn] = useState<string | null>(null);
  return (
    <div className="widget">
      <div className="listen">
        {TEMPI.map(([w, bpm, meaning]) => (
          <button
            key={w}
            className="listen-item"
            aria-pressed={on === w}
            onClick={() => {
              setOn(w);
              for (let i = 0; i < 8; i++) click(i % 4 === 0, 0.05 + (i * 60) / bpm);
            }}
          >
            <span aria-hidden="true">▶</span>
            <span>
              {w} <span className="num">♩ ≈ {bpm}</span>
              <span className="who">{meaning}</span>
            </span>
          </button>
        ))}
      </div>
      <p className="muted small">Speeds are typical, not fixed: tempo words describe a character as much as a number.</p>
    </div>
  );
}
