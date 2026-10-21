"use client";

import { useState } from "react";
import { boardList } from "@/content/boards";
import { useSettings } from "@/lib/progress";
import { setMyGrade } from "@/lib/myGrade";

/** Choose an exam board, then a grade. Saved in Settings; everything else is tuned to it. */
export default function GradePicker({ onPicked, inSettings }: { onPicked?: () => void; inSettings?: boolean }) {
  const s = useSettings();
  // Follow the saved board until you click another tab (settings load after the first render).
  const [picked, setBoard] = useState<"abrsm" | "trinity" | null>(null);
  const board = picked ?? s.board ?? "abrsm";
  const b = boardList().find((x) => x.id === board)!;

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="row" role="group" aria-label="Exam board" style={{ gap: 24 }}>
        {boardList().map((x) => (
          <button key={x.id} className="tbtn" aria-pressed={board === x.id} onClick={() => setBoard(x.id)}>
            {x.name}
          </button>
        ))}
      </div>
      <div className="chips" role="group" aria-label={`${b.name} grade`}>
        {b.grades.map((g) => (
          <button
            key={g.id}
            className="chip"
            aria-pressed={s.board === board && s.grade === g.id}
            onClick={() => {
              setMyGrade(board, g.id);
              onPicked?.();
            }}
          >
            {g.name}
          </button>
        ))}
      </div>
      <p className="muted small" style={{ maxWidth: "52ch" }}>
        Not taking exams? Pick ABRSM and the grade closest to what you can play. Brand new to the piano: Initial.{inSettings ? "" : " You can change it any time in Settings."}
      </p>
    </div>
  );
}
