import type { Metadata } from "next";
import Independent from "@/components/Independent";
import Choice from "@/components/Choice";
import { boardList } from "@/content/boards";

export const metadata: Metadata = { title: "Grades" };

export default function Grades() {
  return (
    <main className="wrap page">
      <div className="stack">
        <h1 className="display">Grades</h1>
        <p className="muted" style={{ maxWidth: "52ch" }}>
          Piano exams, grade by grade: what each one asks for, the sight-reading and scales, and classical pieces you can download free.
        </p>
      </div>
      <nav className="choices" aria-label="Exam boards">
        {boardList().map((b) => (
          <Choice key={b.id} href={`/grades/${b.id}`} title={b.name} text={b.blurb} />
        ))}
      </nav>
      <Independent />
    </main>
  );
}
