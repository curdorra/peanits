"use client";

import { useState } from "react";
import Drill from "@/components/Drill";
import { useSettings } from "@/lib/progress";
import type { Alter, Section } from "@/lib/notes";

type ClefChoice = "treble" | "bass" | "both";
type Range = "near" | "staves" | "wide";
type Acc = "none" | "sharps" | "flats" | "both";

// MIDI: C4 = 60.
const RANGES: Record<Range, { label: string; treble: [number, number]; bass: [number, number] }> = {
  near: { label: "Near middle C", treble: [60, 72], bass: [48, 60] },
  staves: { label: "On the staves", treble: [64, 77], bass: [43, 57] },
  wide: { label: "With ledger lines", treble: [55, 84], bass: [36, 64] },
};
const ALTERS: Record<Acc, Alter[]> = { none: [0], sharps: [0, 1], flats: [0, -1], both: [-1, 0, 1] };

function Choice<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="stack" style={{ gap: 10 }}>
      <h2 className="title" style={{ fontSize: "1.3rem" }}>{label}</h2>
      <div className="row" role="group" aria-label={label} style={{ gap: 28 }}>
        {options.map(([v, text]) => (
          <button key={v} className="tbtn" aria-pressed={value === v} onClick={() => onChange(v)}>
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Custom() {
  const { length } = useSettings();
  const [clef, setClef] = useState<ClefChoice>("both");
  const [range, setRange] = useState<Range>("near");
  const [acc, setAcc] = useState<Acc>("none");

  const r = RANGES[range];
  const sections: Section[] = [];
  if (clef !== "bass") sections.push({ clef: "treble", low: r.treble[0], high: r.treble[1] });
  if (clef !== "treble") sections.push({ clef: "bass", low: r.bass[0], high: r.bass[1] });

  return (
    <main className="wrap page">
      <h1 className="display">Custom étude</h1>
      <div className="stack" style={{ gap: 26 }}>
        <Choice label="Clef" value={clef} onChange={setClef} options={[["treble", "Treble"], ["bass", "Bass"], ["both", "Both"]]} />
        <Choice label="Range" value={range} onChange={setRange} options={[["near", "Near middle C"], ["staves", "On the staves"], ["wide", "With ledger lines"]]} />
        <Choice label="Accidentals" value={acc} onChange={setAcc} options={[["none", "None"], ["sharps", "Sharps"], ["flats", "Flats"], ["both", "Both"]]} />
      </div>
      <Drill
        title="Custom"
        compact
        detail="Your own choice of clef, range and accidentals. Rounds here count towards your note statistics but not towards unit progress."
        sections={sections}
        alters={ALTERS[acc]}
        length={length}
        backHref="/practice"
        backLabel="Back to practice"
      />
    </main>
  );
}
