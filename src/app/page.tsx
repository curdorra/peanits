"use client";

import Link from "next/link";
import Metronome from "@/components/Metronome";
import { UNITS } from "@/lib/curriculum";
import { welcomeBack } from "@/lib/encourage";
import { daysSinceLast, streakOf, useProgress } from "@/lib/progress";

const CHOICES = [
  { href: "/practice", title: "Practise", text: "Sight-read melodies, read notes, train your ear and rhythm." },
  { href: "/grades", title: "Grades", text: "ABRSM and Trinity exams, grade by grade, with free scores." },
  { href: "/learn", title: "Learn", text: "Hands-on lessons, composers, history and a glossary." },
];

export default function Home() {
  const p = useProgress();
  const done = UNITS.filter((u) => p.units[u.id]?.passed).length;
  const streak = streakOf(p.days);
  const hello = welcomeBack(daysSinceLast(p.days));

  return (
    <main className="wrap page home">
      <section className="stack" style={{ gap: 30, flex: "1 1 380px" }}>
        <h1 className="display">What would you like to do?</h1>
        <nav className="choices" aria-label="Choose what to do">
          {CHOICES.map((c) => (
            <Link key={c.href} href={c.href} className="choice">
              <div>
                <h2>{c.title}</h2>
                <p>{c.text}</p>
              </div>
              <span className="go" aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>
        {hello && <p className="muted">{hello}</p>}
        {done > 0 && (
          <p className="muted small num">
            {done} of {UNITS.length} units complete{streak > 1 ? ` · ${streak}-day streak` : ""}
          </p>
        )}
      </section>
      <Metronome className="metro" />
    </main>
  );
}
