"use client";

import { useState } from "react";
import Keyboard, { type KeyMark } from "../Keyboard";

/** "Tap every C": find all keys of one pitch class on a keyboard. */
export default function KeyHunt({ low = 48, high = 83, pc, name }: { low?: number; high?: number; pc: number; name: string }) {
  const targets: number[] = [];
  for (let m = low; m <= high; m++) if (m % 12 === pc) targets.push(m);
  const [found, setFound] = useState<number[]>([]);
  const [miss, setMiss] = useState<number | null>(null);
  const marks: Record<number, KeyMark> = {};
  found.forEach((m) => (marks[m] = "ok"));
  if (miss !== null) marks[miss] = "miss";
  const done = found.length === targets.length;

  return (
    <div className="widget">
      <Keyboard
        low={low}
        high={high}
        labels="none"
        marks={marks}
        onKey={(m) => {
          if (m % 12 === pc) setFound((f) => (f.includes(m) ? f : [...f, m]));
          else {
            setMiss(m);
            setTimeout(() => setMiss((x) => (x === m ? null : x)), 600);
          }
        }}
        label={`Keyboard: find every ${name}`}
      />
      <p className="muted small num" aria-live="polite">
        {done ? `All ${targets.length} found. ✓` : `Tap every ${name}: ${found.length} of ${targets.length}`}
        {done && (
          <button className="tbtn" style={{ marginLeft: 14 }} onClick={() => setFound([])}>Again</button>
        )}
      </p>
    </div>
  );
}
