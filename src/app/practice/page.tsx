"use client";

import Link from "next/link";
import { ROMAN, UNITS } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";

export default function Practice() {
  const p = useProgress();
  const next = UNITS.find((u) => !p.units[u.id]?.passed);

  const rows = [
    next
      ? { href: `/practice/unit/${next.id}`, title: "Continue", text: `Grade ${ROMAN[next.grade]} · ${next.title}` }
      : null,
    { href: "/practice/etude", title: "Today's étude", text: "A mix of what you've learned, leaning towards your slowest notes." },
    { href: "/practice/custom", title: "Custom étude", text: "Choose the clef, range and accidentals yourself." },
  ].filter((r) => r !== null);

  return (
    <main className="wrap page">
      <h1 className="display">Practise</h1>
      <nav className="choices" aria-label="Ways to practise">
        {rows.map((r) => (
          <Link key={r.href} href={r.href} className="choice">
            <div>
              <h2>{r.title}</h2>
              <p>{r.text}</p>
            </div>
            <span className="go" aria-hidden="true">→</span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
