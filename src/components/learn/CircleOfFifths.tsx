"use client";

import { useState } from "react";
import MiniStaff from "../MiniStaff";
import { KEYS, degreeNote, signatureSteps } from "@/lib/keys";
import { playChord } from "@/lib/sound";

const MAJ = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"];
const MIN = ["Am", "Em", "Bm", "F#m", "C#m", "G#m", "D#m", "Bbm", "Fm", "Cm", "Gm", "Dm"];
const label = (id: string) => id.replace("#", "♯").replace(/^([A-G])b/, "$1♭");

/** Tap a key on the circle to see its signature and hear its chord. */
export default function CircleOfFifths() {
  const [sel, setSel] = useState("C");
  const key = KEYS[sel];
  const steps = signatureSteps(key);
  const choose = (id: string) => {
    setSel(id);
    const k = KEYS[id];
    playChord([0, 2, 4].map((d) => degreeNote(k, d, 4).midi), { dur: 1.5 });
  };
  const R = 120,
    r = 78,
    C = 150;
  return (
    <div className="widget circle">
      <svg viewBox="0 0 300 300" role="group" aria-label="Circle of fifths" style={{ width: "100%", maxWidth: 340 }}>
        <circle cx={C} cy={C} r={142} className="ring" />
        <circle cx={C} cy={C} r={100} className="ring soft" />
        <circle cx={C} cy={C} r={56} className="ring" />
        {MAJ.map((id, i) => {
          const a = (i * 30 - 90) * (Math.PI / 180);
          const m = MIN[i];
          return (
            <g key={id}>
              <text
                x={C + R * Math.cos(a)}
                y={C + R * Math.sin(a) + 6}
                textAnchor="middle"
                className={`cof${sel === id ? " on" : ""}`}
                onClick={() => choose(id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && choose(id)}
              >
                {label(id)}
              </text>
              <text
                x={C + r * Math.cos(a)}
                y={C + r * Math.sin(a) + 5}
                textAnchor="middle"
                className={`cof minor${sel === m ? " on" : ""}`}
                onClick={() => choose(m)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && choose(m)}
              >
                {label(m).replace("m", "m")}
              </text>
            </g>
          );
        })}
        <text x={C} y={C + 5} textAnchor="middle" className="cof-mid">{key.mode === "major" ? "major" : "minor"}</text>
      </svg>
      <div style={{ flex: "1 1 220px" }}>
        <MiniStaff keyId={sel} label={`Key signature of ${key.name}`} />
        <p className="center">
          <strong style={{ fontWeight: 500 }}>{key.name}</strong>
          <br />
          <span className="muted small">
            {steps.length ? `${steps.length} ${key.acc > 0 ? "sharp" : "flat"}${steps.length > 1 ? "s" : ""}: ${steps.map((s) => s.toUpperCase() + (key.acc > 0 ? "♯" : "♭")).join(" ")}` : "No sharps or flats"}
          </span>
        </p>
      </div>
    </div>
  );
}
