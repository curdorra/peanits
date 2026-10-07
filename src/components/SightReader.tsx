"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Keyboard from "./Keyboard";
import Score, { type NoteMark } from "./Score";
import SourcePicker from "./SourcePicker";
import { midiName, type Clef } from "@/lib/notes";
import { generateMelody, melodyNotes, BEATS, type Melody, type SRSpec } from "@/lib/sightread";
import { recordRound, useSettings, type Attempt } from "@/lib/progress";
import { playNote } from "@/lib/sound";
import { useListener } from "@/lib/useListener";

type Phase = "ready" | "study" | "playing" | "done";
const STUDY_SECONDS = 30;
const clock = () => performance.now();

type Props = {
  spec: SRSpec;
  title: string;
  detail: string;
  backHref: string;
  backLabel: string;
  clef?: Clef;
};

export function describeSpec(spec: SRSpec, keyNames: (id: string) => string) {
  return {
    keys: spec.keys.map(keyNames).join(", "),
    times: spec.times.join(", "),
    bars: spec.bars,
  };
}

export default function SightReader({ spec, title, detail, backHref, backLabel, clef }: Props) {
  const { source } = useSettings();
  const [phase, setPhase] = useState<Phase>("ready");
  const [melody, setMelody] = useState<Melody | null>(null);
  const [index, setIndex] = useState(0);
  const [marks, setMarks] = useState<NoteMark[]>([]);
  const [left, setLeft] = useState(STUDY_SECONDS);
  const [keepGoing, setKeepGoing] = useState(false);
  const [wrong, setWrong] = useState<number | null>(null);
  const [kb, setKb] = useState<[number, number]>([60, 72]);

  const phaseRef = useRef<Phase>("ready");
  const notesRef = useRef<number[]>([]);
  const idxRef = useRef(0);
  const missedRef = useRef(false);
  const marksRef = useRef<NoteMark[]>([]);
  const shownAt = useRef(0);
  const attempts = useRef<Attempt[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const onNoteRef = useRef<(m: number) => void>(() => {});
  const listener = useListener((m) => onNoteRef.current(m));

  const stopTimer = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };

  function begin() {
    stopTimer();
    listener.stop();
    const m = generateMelody(spec, clef);
    setMelody(m);
    notesRef.current = melodyNotes(m).map((n) => n.midi);
    {
      const lo = Math.min(...notesRef.current) - 2;
      const hi = Math.max(...notesRef.current) + 2;
      const pad = Math.max(0, 14 - (hi - lo));
      setKb([lo - Math.floor(pad / 2), hi + Math.ceil(pad / 2)]);
    }
    idxRef.current = 0;
    marksRef.current = [];
    attempts.current = [];
    setIndex(0);
    setMarks([]);
    setWrong(null);
    setLeft(STUDY_SECONDS);
    phaseRef.current = "study";
    setPhase("study");
    timer.current = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          void startPlaying();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  async function startPlaying() {
    stopTimer();
    if (phaseRef.current !== "study") return;
    phaseRef.current = "playing";
    const ok = await listener.start(source);
    if (!ok) {
      phaseRef.current = "ready";
      setPhase("ready");
      return;
    }
    shownAt.current = clock();
    setPhase("playing");
  }

  function advance(mark: NoteMark, midi: number) {
    const i = idxRef.current;
    attempts.current.push({ midi, hit: mark === "ok", ms: Math.round(clock() - shownAt.current) });
    shownAt.current = clock();
    marksRef.current = [...marksRef.current];
    marksRef.current[i] = mark;
    setMarks(marksRef.current);
    idxRef.current = i + 1;
    missedRef.current = false;
    setIndex(i + 1);
    if (i + 1 >= notesRef.current.length) finish();
  }

  function onNote(m: number) {
    if (phaseRef.current !== "playing") return;
    const expected = notesRef.current[idxRef.current];
    if (expected === undefined) return;
    if (m === expected) {
      setWrong(null);
      advance(missedRef.current ? "miss" : "ok", expected);
    } else {
      setWrong(m);
      if (keepGoing) advance("miss", expected);
      else missedRef.current = true;
    }
  }

  function finish() {
    stopTimer();
    listener.stop();
    phaseRef.current = "done";
    recordRound(attempts.current);
    setPhase("done");
  }

  function quit() {
    stopTimer();
    listener.stop();
    phaseRef.current = "ready";
    setPhase("ready");
  }

  function hear() {
    if (!melody) return;
    const spb = 60 / melody.tempo.bpm;
    let t = 0.1;
    for (const ev of melody.bars.flat()) {
      const len = BEATS[ev.dur] * spb;
      if (!ev.rest && ev.note) playNote(ev.note.midi, { when: t, dur: Math.max(0.4, len * 1.4) });
      t += len;
    }
  }

  useEffect(() => {
    onNoteRef.current = onNote;
  });
  useEffect(() => () => stopTimer(), []);

  /* ---------- views ---------- */
  if (phase === "done" && melody) {
    const right = marks.filter((m) => m === "ok").length;
    return (
      <div className="drill">
        <h1 className="display num">{right} of {marks.length}</h1>
        <p className="muted">notes right first time · {melody.key.name} · {melody.time}</p>
        <div className="stage wide"><Score melody={melody} marks={marks} /></div>
        <div className="row" style={{ justifyContent: "center", gap: 22 }}>
          <button className="btn solid" onClick={begin}><span>Another melody</span></button>
          <button className="btn" onClick={hear}><span>Hear it</span></button>
          <Link className="tbtn" href={backHref}>{backLabel}</Link>
        </div>
      </div>
    );
  }

  if ((phase === "study" || phase === "playing") && melody) {
    const [lo, hi] = kb;
    const total = melodyNotes(melody).length;
    return (
      <div className="drill">
        <p className="muted small">
          {phase === "study" ? (
            <>Look it through: key, time, the highest and lowest notes. <span className="num">{left}s</span></>
          ) : (
            <>Play it through. Keep your eyes a note ahead.</>
          )}
        </p>
        <div className="stage wide">
          <Score melody={melody} current={phase === "playing" ? index : -1} marks={marks} />
        </div>
        {phase === "study" ? (
          <button className="btn solid" onClick={() => void startPlaying()}><span>Start playing</span></button>
        ) : (
          <>
            <p className="muted num" aria-live="polite" style={{ minHeight: "1.6em" }}>
              {wrong !== null ? `heard ${midiName(wrong)}` : listener.heard && source === "mic" ? `heard ${midiName(listener.heard.midi)}` : " "}
            </p>
            {source === "screen" && <Keyboard low={lo} high={hi} onKey={(m) => onNoteRef.current(m)} />}
            <p className="muted small num">{Math.min(index + 1, total)} / {total}</p>
          </>
        )}
        <button className="tbtn" onClick={quit}>Stop</button>
      </div>
    );
  }

  return (
    <div className="drill">
      <h1 className="display">{title}</h1>
      <p className="muted" style={{ maxWidth: "44ch" }}>{detail}</p>
      <SourcePicker />
      <div className="row" role="group" aria-label="When you play a wrong note" style={{ justifyContent: "center", gap: 24 }}>
        <button className="tbtn" aria-pressed={!keepGoing} onClick={() => setKeepGoing(false)}>Wait for each note</button>
        <button className="tbtn" aria-pressed={keepGoing} onClick={() => setKeepGoing(true)}>Keep going, like the exam</button>
      </div>
      {listener.error && <div className="alert" role="alert">{listener.error}</div>}
      <button className="btn solid" onClick={begin}><span>Begin</span></button>
      <Link className="tbtn" href={backHref}>{backLabel}</Link>
      <p className="muted small" style={{ maxWidth: "48ch" }}>
        Pitches are checked; rhythm isn&apos;t scored yet. Melodies are for one hand at a time.
      </p>
    </div>
  );
}
