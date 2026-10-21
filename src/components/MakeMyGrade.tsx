"use client";

import { setMyGrade } from "@/lib/myGrade";
import { useSettings } from "@/lib/progress";

/** On a grade page: say whether it's yours, or make it yours. */
export default function MakeMyGrade({ board, grade }: { board: "abrsm" | "trinity"; grade: string }) {
  const s = useSettings();
  if (s.board === board && s.grade === grade) return <span className="muted small">✓ Your grade</span>;
  return (
    <button className="tbtn" onClick={() => setMyGrade(board, grade)}>
      Make this my grade
    </button>
  );
}
