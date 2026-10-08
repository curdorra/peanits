import Independent from "@/components/Independent";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BOARDS, findGrade, imslp, type BoardId } from "@/content/boards";
import { noteFor } from "@/content/stories";

export function generateStaticParams() {
  return Object.values(BOARDS).flatMap((b) => b.grades.map((g) => ({ board: b.id, grade: g.id })));
}

export async function generateMetadata({ params }: PageProps<"/grades/[board]/[grade]">): Promise<Metadata> {
  const { board, grade } = await params;
  const g = findGrade(board as BoardId, grade);
  return g ? { title: `${BOARDS[board as BoardId].name} ${g.name} piano` } : {};
}

export default async function GradePage({ params }: PageProps<"/grades/[board]/[grade]">) {
  const { board, grade } = await params;
  const b = BOARDS[board as BoardId];
  const g = findGrade(board as BoardId, grade);
  if (!b || !g) notFound();
  const i = b.grades.findIndex((x) => x.id === g.id);
  const prev = b.grades[i - 1];
  const next = b.grades[i + 1];

  return (
    <main className="wrap page">
      <div className="stack">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/grades">Grades</Link><span>/</span><Link href={`/grades/${b.id}`}>{b.name}</Link><span>/</span>
        </nav>
        <h1 className="display">{b.name} {g.name}</h1>
        <p className="muted" style={{ maxWidth: "52ch" }}>{g.about}</p>
        <div className="row" style={{ gap: 22, marginTop: 8 }}>
          <Link className="btn solid" href={`/practice/sight-reading/${b.id}/${g.id}`}><span>Practise sight-reading</span></Link>
          <Link className="tbtn" href="/practice">Other practice</Link>
        </div>
      </div>

      <div className="folds">
        <details className="fold" open>
          <summary><h2>Pieces</h2></summary>
          <div className="fold-body">
            <p className="muted small">
              Classical pieces from the {b.name} list whose scores are free to download. {b.id === "abrsm" ? "One piece from each list (A, B and C) is played. " : "Three pieces are played. "}
              <a href={b.repertoireUrl} target="_blank" rel="noopener noreferrer">The full list ↗</a>
            </p>
            <ul className="pieces">
              {g.pieces.map((p) => (
                <li key={p.composer + p.title}>
                  <span>
                    {p.title}
                    <span className="who">{p.composer}{p.list ? ` · List ${p.list}` : ""}</span>
                    {noteFor(p.title) && <span className="note">{noteFor(p.title)!.note}</span>}
                  </span>
                  <a href={imslp(p.composer, p.title)} target="_blank" rel="noopener noreferrer" aria-label={`Find a free score of ${p.title} on IMSLP`}>
                    Free score ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </details>

        <details className="fold">
          <summary><h2>Sight-reading</h2></summary>
          <div className="fold-body">
            <p className="muted small">{b.sightReadingNote}</p>
            <ul>{g.sightReading.map((s) => <li key={s}>{s}</li>)}</ul>
            <Link className="tbtn" href={`/practice/sight-reading/${b.id}/${g.id}`} style={{ alignSelf: "flex-start" }}>Practise it</Link>
          </div>
        </details>

        <details className="fold">
          <summary><h2>{b.id === "abrsm" ? "Scales and arpeggios" : "Technical work"}</h2></summary>
          <div className="fold-body">
            <ul>{g.scales.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        </details>

        {g.aural && (
          <details className="fold">
            <summary><h2>Aural tests</h2></summary>
            <div className="fold-body">
              <ul>{g.aural.map((s) => <li key={s}>{s}</li>)}</ul>
              <Link className="tbtn" href="/practice/ear" style={{ alignSelf: "flex-start" }}>Train your ear</Link>
            </div>
          </details>
        )}

        <details className="fold">
          <summary><h2>The exam</h2></summary>
          <div className="fold-body">
            {g.minutes && <p>About {g.minutes} minutes long.</p>}
            {g.hours && <p>Trinity estimates about {g.hours} hours of learning for this grade, including lessons.</p>}
            <table className="table">
              <tbody>{b.marks.map((m) => <tr key={m.part}><td>{m.part}</td><td>{m.max}</td></tr>)}</tbody>
              <tfoot><tr><td>Pass</td><td>{b.results[b.results.length - 1].range.split("–")[0]} of {b.total}</td></tr></tfoot>
            </table>
            {b.id === "abrsm" && g.level >= 6 && <p className="muted small">Grade 5 Music Theory (or an accepted alternative) is needed before this exam.</p>}
          </div>
        </details>
      </div>

      <nav className="row" style={{ justifyContent: "space-between" }} aria-label="Other grades">
        {prev ? <Link className="tbtn" href={`/grades/${b.id}/${prev.id}`}>← {prev.name}</Link> : <span />}
        {next ? <Link className="tbtn" href={`/grades/${b.id}/${next.id}`}>{next.name} →</Link> : <span />}
      </nav>
      <p className="muted small">Summarised from the {b.name} syllabus. Check the official syllabus before an exam.</p>
      <Independent />
    </main>
  );
}
