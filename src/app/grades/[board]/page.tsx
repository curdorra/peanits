import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Choice from "@/components/Choice";
import { BOARDS, type BoardId } from "@/content/boards";

export function generateStaticParams() {
  return Object.keys(BOARDS).map((board) => ({ board }));
}

export async function generateMetadata({ params }: PageProps<"/grades/[board]">): Promise<Metadata> {
  const { board } = await params;
  const b = BOARDS[board as BoardId];
  return b ? { title: `${b.name} piano grades` } : {};
}

export default async function BoardPage({ params }: PageProps<"/grades/[board]">) {
  const { board } = await params;
  const b = BOARDS[board as BoardId];
  if (!b) notFound();

  return (
    <main className="wrap page">
      <div className="stack">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/grades">Grades</Link><span>/</span></nav>
        <h1 className="display">{b.name}</h1>
        <p className="muted">{b.fullName} · {b.syllabus}</p>
      </div>

      <nav className="choices" aria-label={`${b.name} grades`}>
        {b.grades.map((g) => (
          <Choice key={g.id} href={`/grades/${b.id}/${g.id}`} title={g.name} text={g.about} />
        ))}
      </nav>

      <div className="folds">
        <details className="fold">
          <summary><h2>How the exam is marked</h2></summary>
          <div className="fold-body">
            <table className="table">
              <tbody>
                {b.marks.map((m) => (
                  <tr key={m.part}><td>{m.part}</td><td>{m.max}</td></tr>
                ))}
              </tbody>
              <tfoot><tr><td>Total</td><td>{b.total}</td></tr></tfoot>
            </table>
            <table className="table">
              <tbody>
                {b.results.map((r) => (
                  <tr key={r.label}><td>{r.label}</td><td>{r.range}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        <details className="fold">
          <summary><h2>Good to know</h2></summary>
          <div className="fold-body">
            <ul>{b.facts.map((f) => <li key={f}>{f}</li>)}</ul>
            <p className="muted">{b.validity}</p>
            <p><a href={b.officialUrl} target="_blank" rel="noopener noreferrer">The official {b.name} piano page ↗</a></p>
          </div>
        </details>
      </div>
    </main>
  );
}
