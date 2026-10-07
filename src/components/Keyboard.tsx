"use client";

import { useId, useState } from "react";
import { midiName } from "@/lib/notes";
import { playNote } from "@/lib/sound";

const BLACK = new Set([1, 3, 6, 8, 10]);
const isBlack = (m: number) => BLACK.has(m % 12);

export type KeyMark = "on" | "ok" | "miss" | "hint";

type Props = {
  low: number;
  high: number;
  onKey?: (midi: number) => void;
  marks?: Record<number, KeyMark>;
  labels?: "none" | "c" | "all";
  sound?: boolean;
  label?: string;
};

/** A hairline, hand-drawn-feeling piano keyboard. Tapping a key calls onKey (and plays it if `sound`). */
export default function Keyboard({ low, high, onKey, marks = {}, labels = "c", sound = true, label = "Piano keyboard" }: Props) {
  const id = useId().replace(/:/g, "");
  const [down, setDown] = useState<number | null>(null);
  // widen to whole white keys at both ends
  let lo = low;
  while (isBlack(lo)) lo--;
  let hi = high;
  while (isBlack(hi)) hi++;

  const whites: number[] = [];
  for (let m = lo; m <= hi; m++) if (!isBlack(m)) whites.push(m);
  const W = 24,
    H = 104,
    BW = 15,
    BH = 64;
  const xOfWhite = new Map(whites.map((m, i) => [m, i * W]));

  const press = (m: number) => {
    setDown(m);
    setTimeout(() => setDown((d) => (d === m ? null : d)), 160);
    if (sound) playNote(m);
    onKey?.(m);
  };

  const fillFor = (m: number, black: boolean) => {
    const mk = down === m ? "on" : marks[m];
    if (mk === "on") return `url(#hatch-${id})`;
    if (mk === "hint") return `url(#dots-${id})`;
    return black ? "var(--kb-black)" : "var(--kb-white)";
  };

  return (
    <svg
      className="kb"
      viewBox={`-1 -1 ${whites.length * W + 2} ${H + 2}`}
      role="group"
      aria-label={label}
      style={{ width: "100%", maxWidth: whites.length * 34, height: "auto", touchAction: "manipulation" }}
    >
      <defs>
        <pattern id={`hatch-${id}`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="5" fill="var(--kb-white)" />
          <line x1="0" y1="0" x2="0" y2="5" stroke="var(--kb-black)" strokeWidth="1.4" />
        </pattern>
        <pattern id={`dots-${id}`} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="var(--kb-white)" />
          <circle cx="3" cy="3" r="1" fill="var(--kb-black)" />
        </pattern>
      </defs>
      {whites.map((m) => {
        const x = xOfWhite.get(m)!;
        const mk = marks[m];
        return (
          <g key={m}>
            <rect
              x={x}
              y={0}
              width={W}
              height={H}
              rx={3}
              fill={fillFor(m, false)}
              stroke="var(--kb-line)"
              strokeWidth={1}
              style={{ cursor: onKey ? "pointer" : "default" }}
              onPointerDown={(e) => {
                e.preventDefault();
                press(m);
              }}
            >
              <title>{midiName(m)}</title>
            </rect>
            {(labels === "all" || (labels === "c" && m % 12 === 0)) && (
              <text x={x + W / 2} y={H - 8} textAnchor="middle" fontSize={9} fill="var(--kb-label)" pointerEvents="none">
                {labels === "all" ? midiName(m).replace(/\d/, "") : midiName(m)}
              </text>
            )}
            {mk === "ok" && <circle cx={x + W / 2} cy={H - 24} r={4} fill="var(--kb-black)" pointerEvents="none" />}
            {mk === "miss" && (
              <path d={`M${x + W / 2 - 4},${H - 28} l8,8 M${x + W / 2 + 4},${H - 28} l-8,8`} stroke="var(--kb-black)" strokeWidth={1.6} pointerEvents="none" />
            )}
          </g>
        );
      })}
      {whites.map((m) => {
        const b = m + 1;
        if (!isBlack(b) || b > hi) return null;
        const x = xOfWhite.get(m)! + W - BW / 2;
        const mk = marks[b];
        return (
          <g key={b}>
            <rect
              x={x}
              y={0}
              width={BW}
              height={BH}
              rx={2}
              fill={fillFor(b, true)}
              stroke="var(--kb-line)"
              strokeWidth={1}
              style={{ cursor: onKey ? "pointer" : "default" }}
              onPointerDown={(e) => {
                e.preventDefault();
                press(b);
              }}
            >
              <title>{midiName(b)}</title>
            </rect>
            {mk === "ok" && <circle cx={x + BW / 2} cy={BH - 12} r={3.5} fill="var(--kb-white)" pointerEvents="none" />}
            {mk === "miss" && (
              <path d={`M${x + BW / 2 - 3.5},${BH - 16} l7,7 M${x + BW / 2 + 3.5},${BH - 16} l-7,7`} stroke="var(--kb-white)" strokeWidth={1.6} pointerEvents="none" />
            )}
          </g>
        );
      })}
    </svg>
  );
}
