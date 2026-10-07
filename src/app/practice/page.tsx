"use client";

import Choice from "@/components/Choice";
import { ROMAN, UNITS } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";

export default function Practice() {
  const p = useProgress();
  const next = UNITS.find((u) => !p.units[u.id]?.passed);

  const groups = [
    {
      title: "Read",
      rows: [
        { href: "/practice/sight-reading", title: "Sight-reading", text: "New melodies at your exam grade. Look, then play." },
        {
          href: "/practice/notes",
          title: "Note reading",
          text: next ? `Single notes, stage by stage. Next: ${next.title} (Stage ${ROMAN[next.grade]}).` : "Single notes, stage by stage. All complete.",
        },
        { href: "/practice/keys", title: "Key signatures", text: "Name the key from its sharps or flats." },
        { href: "/practice/intervals", title: "Intervals", text: "Name the distance between two notes, by eye or by ear." },
      ],
    },
    {
      title: "Listen and count",
      rows: [
        { href: "/practice/rhythm", title: "Rhythm", text: "Tap a written rhythm in time with the metronome." },
        { href: "/practice/ear", title: "Ear training", text: "Higher or lower, major or minor, two or three time, cadences." },
      ],
    },
    {
      title: "Quick rounds",
      rows: [
        { href: "/practice/etude", title: "Today's étude", text: "Twenty notes from what you've learned, leaning to your slowest." },
        { href: "/practice/custom", title: "Custom étude", text: "Pick the clef, range and accidentals." },
      ],
    },
  ];

  return (
    <main className="wrap page">
      <h1 className="display">Practise</h1>
      {groups.map((g) => (
        <section key={g.title} className="stack" style={{ gap: 6 }}>
          <h2 className="label" style={{ fontSize: "0.72rem" }}>{g.title}</h2>
          <nav className="choices" aria-label={g.title}>
            {g.rows.map((r) => (
              <Choice key={r.href} {...r} />
            ))}
          </nav>
        </section>
      ))}
    </main>
  );
}
