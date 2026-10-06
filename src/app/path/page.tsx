"use client";

import Link from "next/link";
import PathSystem from "@/components/PathSystem";
import { GRADES, PASS_ACCURACY, ROMAN, UNITS, unitsOfGrade } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";

export default function PathPage() {
  const p = useProgress();
  const passed = Object.fromEntries(UNITS.map((u) => [u.id, !!p.units[u.id]?.passed]));
  const next = UNITS.find((u) => !passed[u.id]);

  return (
    <main className="wrap page">
      <div className="stack">
        <div className="label">The path</div>
        <h1 className="display">A score you fill in</h1>
        <p className="muted" style={{ maxWidth: "58ch" }}>
          Each grade is a line of music and each unit a bar. Complete a unit with {Math.round(PASS_ACCURACY * 100)}% first-try accuracy and a small
          scene is drawn into its bar. Nothing is locked; start wherever suits you.
        </p>
      </div>

      {GRADES.map((g) => {
        const units = unitsOfGrade(g);
        const offset = UNITS.findIndex((u) => u.grade === g);
        return (
          <section key={g} className="stack" style={{ gap: 22 }} aria-labelledby={`g${g}`}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <h2 id={`g${g}`} className="title">Grade {ROMAN[g]}</h2>
              <span className="label">{units.filter((u) => passed[u.id]).length} of {units.length} complete</span>
            </div>
            <PathSystem units={units} passed={passed} nextId={next?.id} offset={offset} label={`Grade ${ROMAN[g]}`} />
            <div className="stack" style={{ gap: 0 }}>
              {units.map((u, i) => {
                const s = p.units[u.id];
                return (
                  <Link key={u.id} href={`/practice/unit/${u.id}`} className="card-link">
                    <div className="row" style={{ justifyContent: "space-between", gap: 12 }}>
                      <span className="label">Unit {i + 1}{s?.passed ? " · complete" : u.id === next?.id ? " · next" : ""}</span>
                      {s && <span className="label num">best {Math.round(s.best * 100)}%</span>}
                    </div>
                    <h3 style={{ fontSize: "1.3rem" }}>{u.title}</h3>
                    <p className="muted">{u.blurb}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
      <p className="muted" style={{ fontSize: "0.95rem" }}>More grades (key signatures, rhythm and full sight-reading passages) are planned.</p>
    </main>
  );
}
