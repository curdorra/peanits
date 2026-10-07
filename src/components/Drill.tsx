"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Staff, { type Mark } from "./Staff";
import { PASS_ACCURACY } from "@/lib/curriculum";
import { midiName, poolFor, type Alter, type Section, type Target } from "@/lib/notes";
import { progressStore, recordRound, settingsStore, useSettings, weightFor, type Attempt } from "@/lib/progress";
import { useListener } from "@/lib/useListener";

type Props = {
  title: string; // e.g. "Middle C position"
  detail: string; // short description of what is being practised
  sections: Section[];
  alters: Alter[];
  length: number;
  unitId?: string;
  backHref: string;
  backLabel: string;
  nextHref?: string; // shown after a passed unit
  compact?: boolean; // hide the heading and description (when the page already shows them)
};

type Phase = "ready" | "playing" | "done";
const SETTLE_MS = 550; // pause after a correct note so the mark can be seen
const RING_MS = 1200; // ignore the previous note ringing on

// Wall-clock time for response timing; only ever called from event handlers.
const clock = () => performance.now();

function pickTarget(pool: Target[], avoid?: number): Target {
  const notes = progressStore.get().notes;
  const options = pool.length > 1 ? pool.filter((t) => t.note.midi !== avoid) : pool;
  const weights = options.map((t) => weightFor(t.note.midi, notes));
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < options.length; i++) {
    r -= weights[i];
    if (r <= 0) return options[i];
  }
  return options[options.length - 1];
}

const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

export default function Drill(props: Props) {
  const { title, detail, sections, alters, length, unitId, backHref, backLabel, nextHref, compact } = props;
  const settings = useSettings();

  const [phase, setPhase] = useState<Phase>("ready");
  const [target, setTarget] = useState<Target | null>(null);
  const [mark, setMark] = useState<Mark>(null);
  const [index, setIndex] = useState(0);
  const [summary, setSummary] = useState<{ hits: number; total: number; medianMs: number; passed: boolean } | null>(null);

  // Mutable round state lives in refs so the input callback never reads stale values.
  const phaseRef = useRef<Phase>("ready");
  const poolRef = useRef<Target[]>([]);
  const attempts = useRef<Attempt[]>([]);
  const cur = useRef({ target: null as Target | null, shownAt: 0, missed: false, locked: false, ignoreMidi: -1, ignoreUntil: 0 });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // The listener forwards notes to whatever handler is current (set in an effect below).
  const onNoteRef = useRef<(midi: number) => void>(() => {});
  const listener = useListener((midi) => onNoteRef.current(midi));

  function show(t: Target) {
    cur.current = { ...cur.current, target: t, shownAt: clock(), missed: false, locked: false };
    setTarget(t);
    setMark(null);
  }

  function advance(prevMidi: number) {
    const next = attempts.current.length;
    if (next >= length) return finish();
    // With a microphone the last note may still be ringing; a MIDI keyboard has no such problem.
    cur.current.ignoreMidi = prevMidi;
    cur.current.ignoreUntil = settingsStore.get().source === "mic" ? clock() + RING_MS : 0;
    setIndex(next);
    show(pickTarget(poolRef.current, prevMidi));
  }

  function onNote(midi: number) {
    const c = cur.current;
    if (phaseRef.current !== "playing" || c.locked || !c.target) return;
    const now = clock();
    if (midi === c.ignoreMidi && now < c.ignoreUntil) return;

    if (midi === c.target.note.midi) {
      const ms = Math.round(now - c.shownAt);
      attempts.current.push({ midi, hit: !c.missed, ms });
      c.locked = true;
      setMark("ok");
      const hitMidi = c.target.note.midi;
      later(() => advance(hitMidi), SETTLE_MS);
    } else if (!c.missed) {
      c.missed = true;
      setMark("miss");
      later(() => setMark((m) => (m === "miss" ? null : m)), 900);
    }
  }

  async function begin() {
    poolRef.current = poolFor(sections, alters);
    attempts.current = [];
    setIndex(0);
    setSummary(null);
    const ok = await listener.start(settings.source);
    if (!ok) return;
    phaseRef.current = "playing";
    setPhase("playing");
    show(pickTarget(poolRef.current));
  }

  function finish() {
    clearTimers();
    listener.stop();
    phaseRef.current = "done";
    const a = attempts.current;
    const hits = a.filter((x) => x.hit).length;
    const passed = !!unitId && a.length > 0 && hits / a.length >= PASS_ACCURACY;
    recordRound(a, unitId);
    setSummary({ hits, total: a.length, medianMs: median(a.map((x) => x.ms)), passed });
    setPhase("done");
  }

  function quit() {
    clearTimers();
    listener.stop();
    phaseRef.current = "ready";
    setPhase("ready");
    setTarget(null);
  }

  useEffect(() => {
    onNoteRef.current = onNote;
  });
  useEffect(() => clearTimers, []);

  /* ---------- views ---------- */
  if (phase === "done" && summary) {
    return (
      <div className="drill">
        <h1 className="display num">
          {summary.hits} of {summary.total}
        </h1>
        <p className="muted">
          on the first try
          {unitId && (summary.passed ? " · unit complete" : ` · ${Math.round(PASS_ACCURACY * 100)}% completes this unit`)}
        </p>
        <div className="row" style={{ justifyContent: "center", gap: 22 }}>
          <button className="btn solid" onClick={begin}><span>Again</span></button>
          {summary.passed && nextHref && <Link className="btn" href={nextHref}><span>Next unit</span></Link>}
          <Link className="tbtn" href={backHref}>{backLabel}</Link>
        </div>
      </div>
    );
  }

  if (phase === "playing" && target) {
    const heard = listener.heard;
    return (
      <div className="drill">
        <div className="stage">
          <Staff note={target.note} clef={target.clef} mark={mark} />
        </div>
        <p className="muted num" aria-live="polite" style={{ minHeight: "1.6em" }}>
          {heard ? `heard ${midiName(heard.midi)}` : "\u00a0"}
        </p>
        <p className="muted small num">{Math.min(index + 1, length)} / {length}</p>
        <button className="tbtn" onClick={quit}>Stop</button>
      </div>
    );
  }

  return (
    <div className="drill">
      {!compact && (
        <>
          <h1 className="display">{title}</h1>
          <p className="muted" style={{ maxWidth: "40ch" }}>{detail}</p>
        </>
      )}

      <div className="row" role="group" aria-label="Listen with" style={{ justifyContent: "center", gap: 28 }}>
        {(["mic", "midi"] as const).map((s) => (
          <button key={s} className="tbtn" aria-pressed={settings.source === s} onClick={() => settingsStore.update((x) => ({ ...x, source: s }))}>
            {s === "mic" ? "Microphone" : "MIDI keyboard"}
          </button>
        ))}
      </div>

      {listener.error && <div className="alert" role="alert">{listener.error}</div>}
      <button className="btn solid" onClick={begin}><span>Begin</span></button>
      <Link className="tbtn" href={backHref}>{backLabel}</Link>
      <p className="muted small">
        Your audio stays on your device. <Link href="/learn/how-peanits-listens">How listening works</Link>
      </p>
    </div>
  );
}
