"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

export type Question = {
  prompt: string;
  options: string[];
  answer: string;
  visual?: ReactNode;
  play?: () => void; // "Hear it"
  explain?: string;
  onAnswered?: () => void; // e.g. play the answer
};

type Props = {
  title: string;
  intro: string;
  make: () => Question;
  rounds?: number;
  autoPlay?: boolean;
  backHref: string;
  backLabel: string;
  options?: ReactNode; // settings shown on the start screen
};

/** A short round of multiple-choice questions with instant feedback. */
export default function Quiz({ title, intro, make, rounds = 10, autoPlay = false, backHref, backLabel, options }: Props) {
  const [phase, setPhase] = useState<"ready" | "q" | "done">("ready");
  const [q, setQ] = useState<Question | null>(null);
  const [n, setN] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  function ask() {
    const next = make();
    setQ(next);
    setPicked(null);
    if (autoPlay) next.play?.();
  }
  function start() {
    setN(1);
    setScore(0);
    setPhase("q");
    ask();
  }
  function choose(o: string) {
    if (!q || picked) return;
    setPicked(o);
    if (o === q.answer) setScore((s) => s + 1);
    q.onAnswered?.();
  }
  function next() {
    if (n >= rounds) return setPhase("done");
    setN((x) => x + 1);
    ask();
  }

  if (phase === "done") {
    return (
      <div className="drill">
        <h1 className="display num">{score} of {rounds}</h1>
        <p className="muted">{score === rounds ? "Perfect." : score >= rounds * 0.8 ? "Very good." : "Another round will help."}</p>
        <div className="row" style={{ justifyContent: "center", gap: 22 }}>
          <button className="btn solid" onClick={start}><span>Again</span></button>
          <Link className="tbtn" href={backHref}>{backLabel}</Link>
        </div>
      </div>
    );
  }

  if (phase === "q" && q) {
    const right = picked === q.answer;
    return (
      <div className="drill">
        <p className="muted small num">{n} / {rounds}</p>
        <h1 style={{ fontSize: "1.8rem" }}>{q.prompt}</h1>
        {q.visual && <div className="stage">{q.visual}</div>}
        {q.play && (
          <button className="tbtn" onClick={q.play}>Hear it{picked ? " again" : ""}</button>
        )}
        <div className="chips" style={{ justifyContent: "center", maxWidth: 560 }} role="group" aria-label="Answers">
          {q.options.map((o) => (
            <button
              key={o}
              className="chip"
              aria-pressed={picked === o}
              disabled={!!picked}
              data-state={picked ? (o === q.answer ? "right" : o === picked ? "wrong" : "") : ""}
              onClick={() => choose(o)}
            >
              {o}
            </button>
          ))}
        </div>
        <p aria-live="polite" style={{ minHeight: "1.6em" }}>
          {picked && (right ? "✓ Right." : `✕ It's ${q.answer}.`)} {picked && q.explain && <span className="muted">{q.explain}</span>}
        </p>
        {picked ? (
          <button className="btn solid" onClick={next}><span>{n >= rounds ? "Finish" : "Next"}</span></button>
        ) : (
          <span style={{ height: 42 }} />
        )}
        <Link className="tbtn" href={backHref}>Stop</Link>
      </div>
    );
  }

  return (
    <div className="drill">
      <h1 className="display">{title}</h1>
      <p className="muted" style={{ maxWidth: "44ch" }}>{intro}</p>
      {options}
      <button className="btn solid" onClick={start}><span>Begin</span></button>
      <Link className="tbtn" href={backHref}>{backLabel}</Link>
    </div>
  );
}
