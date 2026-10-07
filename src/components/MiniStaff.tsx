"use client";

import { useEffect, useRef } from "react";
import { Accidental, Formatter, Renderer, Stave, StaveNote, Voice } from "vexflow";
import { KEYS, signatureAlters } from "@/lib/keys";
import { vexKey, type Clef, type Note } from "@/lib/notes";

/** A single bar: clef, optional key signature, and whole notes (one after another, or stacked as a chord). */
export default function MiniStaff({ clef = "treble", keyId, notes = [], chord = false, width = 260, label }: {
  clef?: Clef;
  keyId?: string;
  notes?: Note[];
  chord?: boolean;
  width?: number;
  label: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const sig = keyId ? signatureAlters(KEYS[keyId]) : null;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    el.innerHTML = "";
    const H = 120;
    const r = new Renderer(el, Renderer.Backends.SVG);
    r.resize(width, H);
    const ctx = r.getContext();
    ctx.setFillStyle("currentColor");
    ctx.setStrokeStyle("currentColor");
    const stave = new Stave(0, 10, width - 2);
    stave.addClef(clef);
    if (keyId) stave.addKeySignature(keyId);
    stave.setContext(ctx).draw();

    const acc = (n: Note) => {
      const want = sig ? sig[n.step] : 0;
      return n.alter === want ? null : n.alter === 1 ? "#" : n.alter === -1 ? "b" : "n";
    };
    if (notes.length) {
      let tickables: StaveNote[];
      if (chord) {
        const sn = new StaveNote({ keys: notes.map(vexKey), duration: "w", clef });
        notes.forEach((n, i) => {
          const a = acc(n);
          if (a) sn.addModifier(new Accidental(a), i);
        });
        tickables = [sn];
      } else {
        tickables = notes.map((n) => {
          const sn = new StaveNote({ keys: [vexKey(n)], duration: "w", clef });
          const a = acc(n);
          if (a) sn.addModifier(new Accidental(a));
          return sn;
        });
      }
      const v = new Voice({ numBeats: 4 * tickables.length, beatValue: 4 });
      v.setMode(Voice.Mode.SOFT);
      v.addTickables(tickables);
      new Formatter().joinVoices([v]).format([v], Math.max(60, stave.getNoteEndX() - stave.getNoteStartX() - 20));
      v.draw(ctx, stave);
    }
    const svg = el.querySelector("svg");
    if (svg) {
      svg.setAttribute("viewBox", `0 0 ${width} ${H}`);
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      svg.style.width = "100%";
      svg.style.height = "auto";
    }
  }, [clef, keyId, notes, chord, width, sig]);

  return <div ref={host} className="staff mini" role="img" aria-label={label} />;
}
