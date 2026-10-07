"use client";

import Link from "next/link";
import Metronome from "@/components/Metronome";
import { UNITS } from "@/lib/curriculum";
import { streakOf, useProgress } from "@/lib/progress";

const CHOICES = [
  { href: "/practice", title: "Practise", text: "Read a note on the staff and play it." },
  { href: "/path", title: "Path", text: "Work through the grades, one unit at a time." },
  { href: "/learn", title: "Learn", text: "Guides on reading, theory and the piano's history." },
];

export default function Home() {
  const p = useProgress();
  const done = UNITS.filter((u) => p.units[u.id]?.passed).length;
  const streak = streakOf(p.days);

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
