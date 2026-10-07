"use client";

import Link from "next/link";
import Metronome from "@/components/Metronome";
import { ROMAN, UNITS } from "@/lib/curriculum";
import { streakOf, useProgress } from "@/lib/progress";

export default function Home() {
  const p = useProgress();
  const next = UNITS.find((u) => !p.units[u.id]?.passed);
  const done = UNITS.filter((u) => p.units[u.id]?.passed).length;
  const streak = streakOf(p.days);

  return (
    <main className="wrap page home">
      <section className="stack" style={{ gap: 26, flex: "1 1 340px" }}>
        <h1 className="display">{next ? next.title : "Every unit complete"}</h1>
        <p className="muted" style={{ maxWidth: "36ch" }}>
          {next ? `Grade ${ROMAN[next.grade]}. ${next.blurb}` : "Keep your reading sharp with today's étude."}
        </p>
        <div className="row" style={{ gap: 26 }}>
          <Link className="btn solid" href={next ? `/practice/unit/${next.id}` : "/practice/etude"}>
            <span>Begin</span>
          </Link>
          <Link className="tbtn" href="/practice">More études</Link>
        </div>
        {done > 0 && (
          <p className="muted small num">
            {done} of {UNITS.length} units{streak > 1 ? ` · ${streak}-day streak` : ""}
          </p>
        )}
      </section>
      <Metronome className="metro" />
    </main>
  );
}
