"use client";

import Link from "next/link";
import Choice from "@/components/Choice";
import { LESSONS } from "@/content/lessons";
import { useProgress } from "@/lib/progress";

const GROUPS = ["Reading", "Rhythm", "Sound", "Theory", "Skills"] as const;

export default function Lessons() {
  const p = useProgress();
  const done = LESSONS.filter((l) => p.lessons?.[l.slug]).length;
  return (
    <main className="wrap page">
      <div className="stack">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/learn">Learn</Link><span>/</span></nav>
        <h1 className="display">Lessons</h1>
        <p className="muted">Short and hands-on: tap, listen, then check yourself. {done > 0 && <span className="num">{done} of {LESSONS.length} complete.</span>}</p>
      </div>
      {GROUPS.map((g) => (
        <section key={g} className="stack" style={{ gap: 6 }}>
          <h2 className="label" style={{ fontSize: "0.72rem" }}>{g}</h2>
          <nav className="choices" aria-label={g}>
            {LESSONS.filter((l) => l.group === g).map((l) => (
              <Choice key={l.slug} href={`/learn/lessons/${l.slug}`} title={`${p.lessons?.[l.slug] ? "✓ " : ""}${l.title}`} text={l.blurb} />
            ))}
          </nav>
        </section>
      ))}
    </main>
  );
}
