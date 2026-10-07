"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Score, { type NoteMark } from "@/components/Score";
import { KEYS } from "@/lib/keys";
import { makeNote } from "@/lib/notes";
import { BEATS, fillBar, parseTime, specForLevel, type Melody } from "@/lib/sightread";
import { click, latency, now } from "@/lib/sound";
import { pick } from "@/lib/random";

const LEVELS = [
  { id: 0, label: "Crotchets and minims", times: ["4/4"] },
  { id: 1, label: "Quavers", times: ["2/4", "3/4", "4/4"] },
  { id: 2, label: "Dotted rhythms", times: ["2/4", "3/4", "4/4"] },
  { id: 3, label: "Semiquavers", times: ["2/4", "3/4", "4/4"] },
  { id: 4, label: "6/8", times: ["6/8"] },
];
const TEMPI = [60, 80, 100];
const BARS = 2;

type Phase = "ready" | "running" | "done";

export default function Rhythm() {
  const [level, setLevel] = useState(LEVELS[1]);
  const [bpm, setBpm] = useState(80);
  const [phase, setPhase] = useState<Phase>("ready");
  const [melody, setMelody] = useState<Melody | null>(null);
  const [marks, setMarks] = useState<NoteMark[]>([]);
  const [beatLabel, setBeatLabel] = useState("");
  const [result, setResult] = useState<{ hit: number; total: number; meanMs: number; extra: number } | null>(null);

  const onsets = useRef<number[]>([]);
  const taps = useRef<number[]>([]);
  const sync = useRef({ perf: 0, ctx: 0 });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const running = useRef(false);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  function start() {
    clear();
    const spec = specForLevel(level.id);
    const time = pick(level.times);
    const bars = Array.from({ length: BARS }, () => fillBar(time, spec).map((dur) => ({ dur, note: makeNote("b", 0, 4) })));
    const m: Melody = { key: KEYS.C, time, clef: "treble", bars, tempo: { word: "", bpm } };
    setMelody(m);
    setMarks([]);
    setResult(null);

    const { n, d, compound } = parseTime(time);
    const spb = 60 / bpm; // seconds per crotchet
    const beatLen = compound ? 1.5 : 4 / d; // in crotchets
    const beatsPerBar = compound ? n / 3 : n;
    const t0 = now() + 0.3;
    sync.current = { perf: performance.now(), ctx: now() };

    // one bar of count-in, then clicks through the exercise
    const totalBeats = beatsPerBar * (BARS + 1);
    for (let i = 0; i < totalBeats; i++) {
      const at = t0 + i * beatLen * spb;
      click(i % beatsPerBar === 0, at - now());
      const label = i < beatsPerBar ? String(i + 1) : "";
      timers.current.push(setTimeout(() => setBeatLabel(label), (at - now()) * 1000));
    }
    const start = t0 + beatsPerBar * beatLen * spb;
    let t = start;
    const ons: number[] = [];
    for (const ev of bars.flat()) {
      ons.push(t);
      t += BEATS[ev.dur] * spb;
    }
    onsets.current = ons;
    taps.current = [];
    running.current = true;
    setPhase("running");
    timers.current.push(setTimeout(finish, (t - now() + 0.6) * 1000));
  }

  function tap() {
    if (!running.current) return;
    const ctxTime = sync.current.ctx + (performance.now() - sync.current.perf) / 1000 - latency();
    taps.current.push(ctxTime);
  }

  function finish() {
    running.current = false;
    clear();
    setBeatLabel("");
    const spb = 60 / bpm;
    const tol = Math.max(0.09, 0.22 * spb);
    const used = new Set<number>();
    const offsets: number[] = [];
    const mk: NoteMark[] = onsets.current.map((o) => {
      let best = -1;
      let bestD = Infinity;
      taps.current.forEach((t, i) => {
        const dd = Math.abs(t - o);
        if (!used.has(i) && dd < bestD) {
          best = i;
          bestD = dd;
        }
      });
      if (best >= 0 && bestD <= tol) {
        used.add(best);
        offsets.push(taps.current[best] - o);
        return "ok";
      }
      return "miss";
    });
    setMarks(mk);
    const hit = mk.filter((x) => x === "ok").length;
    setResult({
      hit,
      total: mk.length,
      meanMs: offsets.length ? Math.round((offsets.reduce((a, b) => a + b, 0) / offsets.length) * 1000) : 0,
      extra: taps.current.length - used.size,
    });
    setPhase("done");
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && running.current) {
        e.preventDefault();
        tap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clear();
    };
  }, []);

  if (phase !== "ready" && melody) {
    return (
      <main className="wrap page">
        <div className="drill">
          <p className="muted small">{phase === "running" ? "One bar is counted in. Tap each note on the button or the space bar." : "Grey notes were on time; crossed notes were missed."}</p>
          <div className="stage wide"><Score melody={melody} marks={phase === "done" ? marks : []} /></div>
          {phase === "running" ? (
            <>
              <p className="display num" aria-live="polite" style={{ minHeight: "1.2em" }}>{beatLabel}</p>
              <button className="tap" onPointerDown={(e) => { e.preventDefault(); tap(); }}>Tap</button>
            </>
          ) : (
            result && (
              <>
                <h1 className="display num">{result.hit} of {result.total}</h1>
                <p className="muted">
                  on time
                  {result.hit > 0 && Math.abs(result.meanMs) >= 25 ? ` · on average ${Math.abs(result.meanMs)} ms ${result.meanMs < 0 ? "early" : "late"}` : result.hit > 0 ? " · well centred" : ""}
                  {result.extra > 0 ? ` · ${result.extra} extra tap${result.extra > 1 ? "s" : ""}` : ""}
                </p>
                <div className="row" style={{ justifyContent: "center", gap: 22 }}>
                  <button className="btn solid" onClick={start}><span>Another rhythm</span></button>
                  <button className="tbtn" onClick={() => setPhase("ready")}>Change level</button>
                </div>
              </>
            )
          )}
          <Link className="tbtn" href="/practice">Back to practice</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="wrap page">
      <div className="drill">
        <h1 className="display">Rhythm</h1>
        <p className="muted" style={{ maxWidth: "44ch" }}>
          Read two bars of rhythm and tap them in time with the metronome. Turn your sound on.
        </p>
        <div className="row" role="group" aria-label="Level" style={{ justifyContent: "center", gap: 22 }}>
          {LEVELS.map((l) => (
            <button key={l.id} className="tbtn" aria-pressed={level.id === l.id} onClick={() => setLevel(l)}>{l.label}</button>
          ))}
        </div>
        <div className="row" role="group" aria-label="Tempo" style={{ justifyContent: "center", gap: 22 }}>
          {TEMPI.map((t) => (
            <button key={t} className="tbtn num" aria-pressed={bpm === t} onClick={() => setBpm(t)}>♩ = {t}</button>
          ))}
        </div>
        <button className="btn solid" onClick={start}><span>Begin</span></button>
        <Link className="tbtn" href="/practice">Back to practice</Link>
      </div>
    </main>
  );
}
