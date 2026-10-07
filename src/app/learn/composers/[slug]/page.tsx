import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COMPOSERS, composerBySlug, lifespan } from "@/content/composers";
import { boardList, imslp } from "@/content/boards";

export function generateStaticParams() {
  return COMPOSERS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/composers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = composerBySlug(slug);
  return c ? { title: c.name, description: c.summary } : {};
}

export default async function ComposerPage({ params }: PageProps<"/learn/composers/[slug]">) {
  const { slug } = await params;
  const c = composerBySlug(slug);
  if (!c) notFound();
  const i = COMPOSERS.findIndex((x) => x.slug === slug);
  const next = COMPOSERS[i + 1];

  // where this composer appears in the grade highlights
  const inGrades = boardList().flatMap((b) =>
    b.grades.flatMap((g) => g.pieces.filter((p) => p.composer === c.name).map((p) => ({ b, g, p }))),
  );

  return (
    <main className="wrap page">
      <article className="stack" style={{ gap: 30 }}>
        <div className="stack">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/learn">Learn</Link><span>/</span><Link href="/learn/composers">Composers</Link><span>/</span></nav>
          <h1 className="display">{c.name}</h1>
          <p className="muted num">{lifespan(c)} · {c.from} · {c.era}</p>
        </div>
        <p className="lesson-body">{c.summary}</p>
        <p className="aside" style={{ maxWidth: "60ch" }}>{c.fact}</p>

        <div className="folds">
          <details className="fold" open>
            <summary><h2>Start with</h2></summary>
            <div className="fold-body">
              <ul className="pieces">
                {c.start.map((s) => (
                  <li key={s.title}>
                    <span>{s.title}<span className="who">{s.level}</span></span>
                    <a href={imslp(c.name, s.title)} target="_blank" rel="noopener noreferrer">Free score ↗</a>
                  </li>
                ))}
              </ul>
            </div>
          </details>
          <details className="fold">
            <summary><h2>Piano music</h2></summary>
            <div className="fold-body"><ul>{c.piano.map((w) => <li key={w}>{w}</li>)}</ul></div>
          </details>
          {inGrades.length > 0 && (
            <details className="fold">
              <summary><h2>In the exam lists</h2></summary>
              <div className="fold-body">
                <ul className="pieces">
                  {inGrades.map(({ b, g, p }) => (
                    <li key={b.id + g.id + p.title}>
                      <span>{p.title}<span className="who">{b.name} {g.name}</span></span>
                      <Link href={`/grades/${b.id}/${g.id}`}>The grade →</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          )}
        </div>
        {next && <Link className="tbtn" href={`/learn/composers/${next.slug}`} style={{ alignSelf: "flex-end" }}>{next.name} →</Link>}
      </article>
    </main>
  );
}
