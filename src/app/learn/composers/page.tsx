import Link from "next/link";
import type { Metadata } from "next";
import Choice from "@/components/Choice";
import { COMPOSERS, ERAS, lifespan } from "@/content/composers";

export const metadata: Metadata = { title: "Composers" };

export default function Composers() {
  return (
    <main className="wrap page">
      <div className="stack">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/learn">Learn</Link><span>/</span></nav>
        <h1 className="display">Composers</h1>
      </div>
      {ERAS.map((e) => (
        <section key={e.era} className="stack" style={{ gap: 10 }}>
          <div className="stack" style={{ gap: 4 }}>
            <h2 className="title">{e.era} <span className="muted small num">{e.span}</span></h2>
            <p className="muted" style={{ maxWidth: "62ch" }}>{e.about}</p>
          </div>
          <nav className="choices" aria-label={`${e.era} composers`}>
            {COMPOSERS.filter((c) => c.era === e.era).map((c) => (
              <Choice key={c.slug} href={`/learn/composers/${c.slug}`} title={c.name} text={`${lifespan(c)} · ${c.from}`} />
            ))}
          </nav>
        </section>
      ))}
    </main>
  );
}
