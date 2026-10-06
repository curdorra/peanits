import Link from "next/link";
import type { Metadata } from "next";
import { ARTICLES } from "@/content/articles";

export const metadata: Metadata = { title: "Learn" };

export default function Learn() {
  const groups = [...new Set(ARTICLES.map((a) => a.category))];
  return (
    <main className="wrap page">
      <div className="stack">
        <div className="label">Learn</div>
        <h1 className="display">The learning shelf</h1>
        <p className="muted" style={{ maxWidth: "56ch" }}>Short guides on reading, practising, theory and the history of the piano. Free to read, and written to be checked against other sources.</p>
      </div>
      {groups.map((g) => (
        <section key={g} className="stack" style={{ gap: 0 }}>
          <div className="label" style={{ paddingBottom: 12 }}>{g}</div>
          {ARTICLES.filter((a) => a.category === g).map((a) => (
            <Link key={a.slug} href={`/learn/${a.slug}`} className="card-link">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <h2 style={{ fontSize: "1.5rem" }}>{a.title}</h2>
                <span className="label">{a.minutes} min</span>
              </div>
              <p className="muted">{a.blurb}</p>
            </Link>
          ))}
        </section>
      ))}
    </main>
  );
}
