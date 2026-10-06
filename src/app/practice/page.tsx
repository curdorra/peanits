import Link from "next/link";
import type { Metadata } from "next";
import PracticeNext from "@/components/PracticeNext";

export const metadata: Metadata = { title: "Practice" };

const SOON = [
  ["Sight-reading passages", "Short pieces with rhythm, played to a metronome, without stopping."],
  ["Rhythm", "Clap and count before you play."],
  ["Intervals and chords", "Recognising shapes on the staff and on the keys."],
  ["Key signatures", "Reading in every major and minor key."],
];

export default function Practice() {
  return (
    <main className="wrap page">
      <div className="stack">
        <div className="label">Practice</div>
        <h1 className="display">Études</h1>
        <p className="muted" style={{ maxWidth: "56ch" }}>
          Short rounds of twenty notes. Play what you see; peanits listens and keeps track of which notes you find slow.
        </p>
      </div>

      <section className="grid2">
        <PracticeNext />
        <div className="panel">
          <div className="label">Today</div>
          <h2 className="title">Today&apos;s étude</h2>
          <p className="muted">A mix of everything you&apos;ve learned, leaning towards your slowest notes.</p>
          <Link className="btn solid" href="/practice/etude"><span>Begin</span></Link>
        </div>
        <div className="panel">
          <div className="label">Your own</div>
          <h2 className="title">Custom étude</h2>
          <p className="muted">Choose the clef, range and accidentals yourself.</p>
          <Link className="btn" href="/practice/custom"><span>Set up</span></Link>
        </div>
      </section>

      <section className="stack">
        <div className="label">Coming next</div>
        <hr className="rule" />
        {SOON.map(([t, d]) => (
          <div key={t} className="stack" style={{ gap: 4, paddingBottom: 10 }}>
            <h3 style={{ fontSize: "1.2rem" }}>{t}</h3>
            <p className="muted">{d}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
