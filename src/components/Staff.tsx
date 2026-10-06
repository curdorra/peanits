"use client";

import { useEffect, useRef } from "react";
import { Accidental, Formatter, Renderer, Stave, StaveNote, Voice } from "vexflow";
import { noteName, vexKey, type Clef, type Note } from "@/lib/notes";
import { blobPath, hlPath } from "@/lib/pencil";

const W = 260;
const H = 100;
const TOP = -10; // viewBox offset so the staff sits centred with room for ledger lines
const SVG_NS = "http://www.w3.org/2000/svg";

export type Mark = "ok" | "miss" | null;

function pen(svg: SVGElement, d: string) {
  const p = document.createElementNS(SVG_NS, "path");
  p.setAttribute("class", "mk");
  p.setAttribute("pathLength", "1");
  p.setAttribute("d", d);
  svg.appendChild(p);
  return p;
}

/** One whole note on a treble or bass staff, with optional pen marks (circle + tick, or crossed out). */
export default function Staff({ note, clef, mark = null }: { note: Note; clef: Clef; mark?: Mark }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    el.innerHTML = "";

    const renderer = new Renderer(el, Renderer.Backends.SVG);
    renderer.resize(W, H);
    const ctx = renderer.getContext();
    ctx.setFillStyle("currentColor");
    ctx.setStrokeStyle("currentColor");

    const stave = new Stave(0, 0, W - 2);
    stave.addClef(clef);
    stave.setContext(ctx).draw();

    const sn = new StaveNote({ keys: [vexKey(note)], duration: "w", clef });
    if (note.alter) sn.addModifier(new Accidental(note.alter === 1 ? "#" : "b"));
    const voice = new Voice({ numBeats: 4, beatValue: 4 }).addTickables([sn]);
    new Formatter().joinVoices([voice]).format([voice], 110);
    voice.draw(ctx, stave);

    const svg = el.querySelector("svg");
    if (!svg) return;
    svg.setAttribute("viewBox", `0 ${TOP} ${W} ${H}`);
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.style.width = "100%";
    svg.style.height = "auto";

    if (mark) {
      const cx = (sn.getNoteHeadBeginX() + sn.getNoteHeadEndX()) / 2;
      const cy = sn.getYs()[0];
      const seed = note.midi * 7 + (mark === "ok" ? 1 : 2);
      if (mark === "ok") {
        const c = pen(svg, blobPath(54, 44, 2, seed, 1.3));
        c.setAttribute("transform", `translate(${cx - 27},${cy - 22})`);
        pen(svg, `${hlPath(cx + 34, cy - 14, cx + 41, cy - 6, seed + 1, 0.3)} ${hlPath(cx + 41, cy - 6, cx + 56, cy - 28, seed + 2, 0.3)}`);
      } else {
        pen(svg, hlPath(cx - 18, cy - 14, cx + 18, cy + 14, seed, 0.9));
        pen(svg, hlPath(cx - 18, cy + 14, cx + 18, cy - 14, seed + 1, 0.9));
      }
    }
  }, [note, clef, mark]);

  return <div ref={host} className="staff" role="img" aria-label={`${clef === "treble" ? "Treble" : "Bass"} clef, note ${noteName(note)}`} />;
}
