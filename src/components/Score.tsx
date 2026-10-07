"use client";

import { useEffect, useRef } from "react";
import { Accidental, BarlineType, Beam, Dot, Formatter, Fraction, Renderer, Stave, StaveNote, Voice } from "vexflow";
import { signatureAlters } from "@/lib/keys";
import { vexKey } from "@/lib/notes";
import type { Melody } from "@/lib/sightread";
import { hlPath } from "@/lib/pencil";

export type NoteMark = "ok" | "miss" | undefined;

const W = 720;
const LINE_H = 118;
const TOP = 34;
const SVG_NS = "http://www.w3.org/2000/svg";

function pen(svg: SVGElement, d: string, cls = "mk") {
  const p = document.createElementNS(SVG_NS, "path");
  p.setAttribute("class", cls);
  p.setAttribute("pathLength", "1");
  p.setAttribute("d", d);
  svg.appendChild(p);
}

/**
 * A short melody on one or two lines of music. Played notes are dimmed, missed notes get a small
 * pen cross, and the current note has a caret beneath it.
 */
export default function Score({ melody, current = -1, marks = [] }: { melody: Melody; current?: number; marks?: NoteMark[] }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    el.innerHTML = "";
    const perLine = melody.bars.length <= 4 ? melody.bars.length : 4;
    const lines: (typeof melody.bars)[] = [];
    for (let i = 0; i < melody.bars.length; i += perLine) lines.push(melody.bars.slice(i, i + perLine));
    const H = TOP + lines.length * LINE_H;

    const renderer = new Renderer(el, Renderer.Backends.SVG);
    renderer.resize(W, H);
    const ctx = renderer.getContext();
    ctx.setFillStyle("currentColor");
    ctx.setStrokeStyle("currentColor");
    const dim = getComputedStyle(el).getPropertyValue("--ink2").trim() || "#8a8078";

    const sig = signatureAlters(melody.key);
    const [num, den] = melody.time.split("/").map(Number);
    const grouped = den === 8 && num % 3 === 0;
    const pos: { x: number; y: number; bottom: number }[] = [];
    let idx = 0;

    lines.forEach((lineBars, li) => {
      const y = TOP + li * LINE_H - 10;
      const extra = li === 0 ? 118 : 86;
      const bw = (W - 2 - extra) / lineBars.length;
      let x = 0;
      lineBars.forEach((bar, bi) => {
        const width = bw + (bi === 0 ? extra : 0);
        const stave = new Stave(x, y, width);
        if (bi === 0) {
          stave.addClef(melody.clef).addKeySignature(melody.key.id);
          if (li === 0) stave.addTimeSignature(melody.time);
        }
        if (li === lines.length - 1 && bi === lineBars.length - 1) stave.setEndBarType(BarlineType.END);
        stave.setContext(ctx).draw();

        const inEffect: Record<string, number> = {};
        const items = bar.map((ev) => {
          const base = ev.dur.replace("d", "");
          const dotted = ev.dur.endsWith("d");
          let sn: StaveNote;
          if (ev.rest || !ev.note) {
            sn = new StaveNote({ keys: [melody.clef === "treble" ? "b/4" : "d/3"], duration: `${base}r`, clef: melody.clef });
          } else {
            const n = ev.note;
            sn = new StaveNote({ keys: [vexKey(n)], duration: base, clef: melody.clef, autoStem: true });
            const k = `${n.step}${n.octave}`;
            const current = inEffect[k] ?? sig[n.step];
            if (n.alter !== current) {
              sn.addModifier(new Accidental(n.alter === 1 ? "#" : n.alter === -1 ? "b" : "n"));
              inEffect[k] = n.alter;
            }
          }
          if (dotted) Dot.buildAndAttach([sn], { all: true });
          let i = -1;
          if (!ev.rest && ev.note) {
            i = idx++;
            if (marks[i]) sn.setStyle({ fillStyle: dim, strokeStyle: dim });
          }
          return { sn, i };
        });

        const notes = items.map((t) => t.sn);
        const voice = new Voice({ numBeats: num, beatValue: den });
        voice.setMode(Voice.Mode.SOFT);
        voice.addTickables(notes);
        const beams = Beam.generateBeams(notes, grouped || melody.time === "3/8" ? { groups: [new Fraction(3, 8)] } : {});
        new Formatter().joinVoices([voice]).format([voice], Math.max(40, stave.getNoteEndX() - stave.getNoteStartX() - 14));
        voice.draw(ctx, stave);
        beams.forEach((b) => b.setContext(ctx).draw());

        items.forEach(({ sn, i }) => {
          if (i < 0) return;
          pos[i] = {
            x: (sn.getNoteHeadBeginX() + sn.getNoteHeadEndX()) / 2,
            y: sn.getYs()[0],
            bottom: stave.getYForLine(4),
          };
        });
        x += width;
      });
    });

    const svg = el.querySelector("svg");
    if (!svg) return;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.style.width = "100%";
    svg.style.height = "auto";

    const t = document.createElementNS(SVG_NS, "text");
    t.setAttribute("x", "4");
    t.setAttribute("y", "16");
    t.setAttribute("class", "score-tempo");
    t.textContent = `${melody.tempo.word}  ♩ = ${melody.tempo.bpm}`;
    svg.appendChild(t);

    marks.forEach((m, i) => {
      const p = pos[i];
      if (m === "miss" && p) pen(svg, `${hlPath(p.x - 6, p.y - 30, p.x + 6, p.y - 18, i * 7 + 1, 0.4)} ${hlPath(p.x - 6, p.y - 18, p.x + 6, p.y - 30, i * 7 + 2, 0.4)}`, "mk sm");
    });
    const c = pos[current];
    if (c) {
      const yb = Math.max(c.bottom, c.y) + 20;
      pen(svg, `${hlPath(c.x - 7, yb + 7, c.x, yb, 991, 0.2)} ${hlPath(c.x, yb, c.x + 7, yb + 7, 992, 0.2)}`, "mk caret");
    }
  }, [melody, current, marks]);

  const midis = melody.bars.flat().filter((e) => !e.rest && e.note).map((e) => e.note!.midi).join(",");
  return <div ref={host} className="score" role="img" data-notes={midis} aria-label={`${melody.key.name}, ${melody.time}, ${melody.bars.length} bars`} />;
}
