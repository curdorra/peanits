import Link from "next/link";
import type { Metadata } from "next";
import { boardList } from "@/content/boards";

export const metadata: Metadata = { title: "Sight-reading" };

export default function SightReadingPicker() {
  return (
    <main className="wrap page">
      <div className="stack">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/practice">Practise</Link><span>/</span></nav>
        <h1 className="display">Sight-reading</h1>
        <p className="muted" style={{ maxWidth: "52ch" }}>
          A new melody every time, written to your grade&apos;s keys, time signatures and length. Look it through for 30 seconds, then play.
        </p>
      </div>
      {boardList().map((b) => (
        <section key={b.id} className="stack" style={{ gap: 14 }}>
          <h2 className="title">{b.name}</h2>
          <div className="chips">
            {b.grades.map((g) => (
              <Link key={g.id} className="chip" href={`/practice/sight-reading/${b.id}/${g.id}`}>{g.name}</Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
