import type { Metadata } from "next";
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
      <p className="muted small" style={{ maxWidth: "60ch" }}>
        peanits is independent and not connected with ABRSM or Trinity College London. Requirements are summarised from their published
        syllabuses; always check the official syllabus before an exam.
      </p>
    </main>
  );
}
