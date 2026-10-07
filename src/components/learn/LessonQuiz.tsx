"use client";

import { useState } from "react";

export type QQ = { q: string; options: string[]; answer: string; explain?: string };

/** A few fixed questions to check understanding at the end of a lesson. */
export default function LessonQuiz({ questions, onDone }: { questions: QQ[]; onDone?: (score: number) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= questions.length;
  if (done) {
    return (
      <div className="widget center">
        <p className="display num">{score} of {questions.length}</p>
        <p className="muted">{score === questions.length ? "Lesson complete. ✓" : "Nearly there. Try the questions again."}</p>
        <button className="tbtn" onClick={() => { setI(0); setScore(0); setPicked(null); }}>Try again</button>
      </div>
    );
  }
  const q = questions[i];
  return (
    <div className="widget">
      <p className="muted small num">Question {i + 1} of {questions.length}</p>
      <p style={{ fontSize: "1.25rem" }}>{q.q}</p>
      <div className="chips" role="group" aria-label="Answers">
        {q.options.map((o) => (
          <button
            key={o}
            className="chip"
            disabled={!!picked}
            data-state={picked ? (o === q.answer ? "right" : o === picked ? "wrong" : "") : ""}
            onClick={() => {
              setPicked(o);
              if (o === q.answer) setScore((s) => s + 1);
            }}
          >
            {o}
          </button>
        ))}
      </div>
      {picked && (
        <>
          <p aria-live="polite">
            {picked === q.answer ? "✓ Right." : `✕ It's ${q.answer}.`} {q.explain && <span className="muted">{q.explain}</span>}
          </p>
          <button
            className="btn solid"
            style={{ alignSelf: "flex-start" }}
            onClick={() => {
              const last = i + 1 >= questions.length;
              setI(i + 1);
              setPicked(null);
              if (last) onDone?.(score);
            }}
          >
            <span>{i + 1 >= questions.length ? "Finish" : "Next question"}</span>
          </button>
        </>
      )}
    </div>
  );
}
