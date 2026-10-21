"use client";

import Link from "next/link";
import Choice from "@/components/Choice";
import GradePicker from "@/components/GradePicker";
import Metronome from "@/components/Metronome";
import { ROMAN, UNITS } from "@/lib/curriculum";
import { welcomeBack } from "@/lib/encourage";
import { useMyGrade } from "@/lib/myGrade";
import { daysSinceLast, streakOf, useProgress } from "@/lib/progress";
import { useHydrated } from "@/lib/useHydrated";

/** Today: one button to practise, then the few things you're most likely to want next. */
export default function Today() {
  const p = useProgress();
  const mine = useMyGrade();
  const next = UNITS.find((u) => !p.units[u.id]?.passed);
  const streak = streakOf(p.days);
  const hello = welcomeBack(daysSinceLast(p.days));

  // Your grade lives in this browser; don't flash the welcome screen at returning pianists.
  if (!useHydrated()) return <main className="wrap page home" />;

  if (!mine) {
    return (
      <main className="wrap page home">
        <section className="stack" style={{ gap: 26, flex: "1 1 380px" }}>
          <h1 className="display">Welcome. Which grade are you working on?</h1>
          <p className="muted" style={{ maxWidth: "52ch" }}>
            peanits sets your sight-reading, pieces and scales to it. Free, no account; it&apos;s saved in this browser.
          </p>
          <GradePicker />
        </section>
        <Metronome className="metro" />
      </main>
    );
  }

  return (
    <main className="wrap page home">
      <section className="stack" style={{ gap: 30, flex: "1 1 380px" }}>
        <div className="stack" style={{ gap: 8 }}>
          <h1 className="display">Today</h1>
          <p className="muted">
            {mine.label} · <Link href="/settings#grade">change</Link>
            {streak > 1 && <span className="num"> · {streak}-day streak</span>}
          </p>
          {hello && <p className="muted">{hello}</p>}
        </div>
        <div className="row">
          <Link className="btn solid" href="/session"><span>Start today&apos;s practice</span></Link>
        </div>
        <p className="muted small" style={{ marginTop: -14 }}>A note-reading warm-up, then a melody at {mine.grade.name}. About five minutes.</p>
        <nav className="choices" aria-label="Or go straight to">
          <Choice href={mine.sightReadingHref} title="Sight-reading" text={`A new melody at ${mine.label}.`} />
          <Choice
            href={next ? `/practice/unit/${next.id}` : "/practice/notes"}
            title="Note reading"
            text={next ? `Next: ${next.title} (Part ${ROMAN[next.grade]}).` : "Every part complete. Keep sharp with Today's étude."}
          />
          <Choice href={mine.href} title={`Your ${mine.grade.name}`} text="Pieces with free scores, scales, and what the exam asks for." />
        </nav>
      </section>
      <Metronome className="metro" />
    </main>
  );
}
