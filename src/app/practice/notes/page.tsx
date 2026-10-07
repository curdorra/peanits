"use client";

import Link from "next/link";
import PathSystem from "@/components/PathSystem";
import { GRADES, PASS_ACCURACY, ROMAN, UNITS, unitsOfGrade } from "@/lib/curriculum";
import { avgMs, useProgress } from "@/lib/progress";
import { midiName } from "@/lib/notes";

export default function PathPage() {
  const p = useProgress();
  const passed = Object.fromEntries(UNITS.map((u) => [u.id, !!p.units[u.id]?.passed]));
  const next = UNITS.find((u) => !passed[u.id]);

  const slow = Object.entries(p.notes)
    .filter(([, s]) => s.n >= 2)
    .map(([midi, s]) => ({ midi: +midi, ms: avgMs(s) }))
    .sort((a, b) => b.ms - a.ms)
    .slice(0, 8);

  return (
    <main className="wrap page">
      <div className="stack">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/practice">Practise</Link><span>/</span></nav>
        <h1 className="display">Note reading</h1>
        <p className="muted">Reach {Math.round(PASS_ACCURACY * 100)}% on the first try to complete a unit and draw its scene.</p>
      </div>

      {GRADES.map((g) => {
        const units = unitsOfGrade(g);
        const offset = UNITS.findIndex((u) => u.grade === g);
        return (
          <section key={g} className="stack" style={{ gap: 18 }} aria-labelledby={`g${g}`}>
            <h2 id={`g${g}`} className="title">Stage {ROMAN[g]}</h2>
            <PathSystem units={units} passed={passed} offset={offset} label={`Stage ${ROMAN[g]}`} />
            <div>
              {units.map((u, i) => {
                const s = p.units[u.id];
                return (
                  <Link key={u.id} href={`/practice/unit/${u.id}`} className="unit-row">
                    <span>{i + 1}. {u.title}</span>
                    <span>{s?.passed ? `✓ ${Math.round(s.best * 100)}%` : u.id === next?.id ? "next" : ""}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {slow.length > 0 && (
        <section className="stack" style={{ gap: 16 }}>
          <h2 className="title">Slowest notes</h2>
          <div className="heat">
            {slow.map((s, i) => (
              <div key={s.midi} className="cell" data-l={Math.min(4, 4 - Math.floor((i / slow.length) * 4))}>
                <span>{midiName(s.midi)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
