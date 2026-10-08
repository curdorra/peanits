"use client";

import Link from "next/link";
import { useState } from "react";
import { boardList, imslp } from "@/content/boards";
import { COMPOSERS } from "@/content/composers";
import { MOODS, PIECE_NOTES, type Mood } from "@/content/stories";

type Found = { title: string; composer: string; note: string; mood: Mood; where: { board: string; boardId: string; grade: string; gradeId: string }[] };

const FOUND: Found[] = PIECE_NOTES.flatMap((n) => {
  if (!n.mood) return [];
  const where: Found["where"] = [];
  let composer = "";
  for (const b of boardList())
    for (const g of b.grades) {
      const p = g.pieces.find((x) => x.title === n.title);
      if (p) {
        composer = p.composer;
        where.push({ board: b.name, boardId: b.id, grade: g.name, gradeId: g.id });
      }
    }
  return where.length ? [{ title: n.title, composer, note: n.note, mood: n.mood, where }] : [];
});

export default function MoodPage() {
  const [mood, setMood] = useState<Mood | null>(null);
  const list = mood ? FOUND.filter((f) => f.mood === mood) : [];

  return (
    <main className="wrap page">
      <div className="stack">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/learn">Learn</Link><span>/</span></nav>
        <h1 className="display">How do you feel?</h1>
        <p className="muted">Choose a mood. We’ll suggest pieces from the exam lists, with a line on the story behind each.</p>
      </div>
      <div className="choices" role="group" aria-label="Mood">
        {MOODS.map((m) => (
          <button key={m.mood} className="choice" aria-pressed={mood === m.mood} onClick={() => setMood(m.mood)} style={{ textAlign: "left" }}>
            <div>
              <h2>{m.mood}</h2>
              <p>{m.line}</p>
            </div>
            <span className="go" aria-hidden="true">{mood === m.mood ? "↓" : "→"}</span>
          </button>
        ))}
      </div>
      {mood && (
        <ul className="pieces" aria-live="polite">
          {list.map((f) => {
            const c = COMPOSERS.find((x) => x.name === f.composer);
            const w = f.where[0];
            return (
              <li key={f.title}>
                <span>
                  {f.title}
                  <span className="who">
                    {c ? <Link href={`/learn/composers/${c.slug}`}>{f.composer}</Link> : f.composer} · <Link href={`/grades/${w.boardId}/${w.gradeId}`}>{w.board} {w.grade}</Link>
                  </span>
                  <span className="note">{f.note}</span>
                </span>
                <a href={imslp(f.composer, f.title)} target="_blank" rel="noopener noreferrer">Free score ↗</a>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
