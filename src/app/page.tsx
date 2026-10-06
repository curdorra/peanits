"use client";

import Link from "next/link";
import Metronome from "@/components/Metronome";
import { ARTICLES } from "@/content/articles";
import { ROMAN, UNITS } from "@/lib/curriculum";
import { midiName } from "@/lib/notes";
import { avgMs, lastSevenDays, streakOf, useProgress } from "@/lib/progress";

export default function Home() {
  const p = useProgress();
  const next = UNITS.find((u) => !p.units[u.id]?.passed);
  const done = UNITS.filter((u) => p.units[u.id]?.passed).length;
  const pct = (done / UNITS.length) * 100;
  const streak = streakOf(p.days);
  const week = lastSevenDays(p.days);

  const slow = Object.entries(p.notes)
    .filter(([, s]) => s.n >= 2)
    .map(([midi, s]) => ({ midi: +midi, ms: avgMs(s) }))
    .sort((a, b) => b.ms - a.ms)
    .slice(0, 8);
  const article = ARTICLES[0];

  return (
    <main className="wrap page" style={{ gap: 48 }}>
      <section style={{ display: "flex", gap: 40, justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap" }}>
        <div className="stack" style={{ gap: 22, flex: "1 1 380px" }}>
          <div className="label">{next ? `Continue · Grade ${ROMAN[next.grade]}` : "Path complete"}</div>
          <h1 className="display">{next ? next.title : "Every unit complete"}</h1>
          <p className="muted" style={{ maxWidth: "46ch" }}>
            {next ? next.blurb : "Keep your reading sharp with today's étude. More grades are on the way."}
          </p>
          <div className="row" style={{ gap: 18, flexWrap: "nowrap" }}>
            <div className="pbar" aria-hidden="true">
              <i style={{ width: `${pct}%` }} />
              <b style={{ left: `${pct}%` }} />
            </div>
            <span className="label num">{done} / {UNITS.length}</span>
            <Link className="play" href={next ? `/practice/unit/${next.id}` : "/practice/etude"} aria-label={next ? `Continue with ${next.title}` : "Begin today's étude"}>▶</Link>
          </div>
        </div>
        <Metronome className="metro" />
      </section>

      <hr className="rule" />

      <section className="grid2">
        <div className="panel">
          <div className="label">Today&apos;s étude</div>
          <strong style={{ fontSize: "1.5rem", fontWeight: 400 }}>{p.rounds ? "A mix, tuned to you" : "A first round"}</strong>
          <p className="muted">Twenty notes, leaning towards the ones you find slow.</p>
          <Link className="btn solid" href="/practice/etude"><span>Begin</span></Link>
        </div>
        <div className="panel">
          <div className="label">Streak</div>
          <strong style={{ fontSize: "1.5rem", fontWeight: 400 }}>{streak} {streak === 1 ? "day" : "days"}</strong>
          <div className="dots" aria-label="Last seven days">
            {week.map((on, i) => <span key={i} className={`dot${on ? " on" : ""}`} />)}
          </div>
          <p className="muted" style={{ fontSize: "0.9rem" }}>Last seven days, today on the right.</p>
        </div>
      </section>

      <section className="stack" style={{ gap: 18 }}>
        <div className="label">Slowest notes · denser hatching, slower</div>
        {slow.length ? (
          <div className="heat">
            {slow.map((s, i) => (
              <div key={s.midi} className="cell" data-l={Math.min(4, 4 - Math.floor((i / slow.length) * 4))}>
                <span>{midiName(s.midi)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">Play a few rounds and your slowest notes will appear here.</p>
        )}
      </section>

      <hr className="rule" />

      <section className="stack" style={{ gap: 10 }}>
        <div className="label">From the learning shelf</div>
        <Link href={`/learn/${article.slug}`} className="card-link" style={{ borderTop: 0, padding: 0 }}>
          <h3 style={{ fontSize: "1.5rem" }}>{article.title}</h3>
          <p className="muted">{article.blurb}</p>
        </Link>
        <Link className="tbtn" href="/learn" style={{ alignSelf: "flex-start" }}>All guides</Link>
      </section>
    </main>
  );
}
