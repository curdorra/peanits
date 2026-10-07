import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Practice" };

const ROWS = [
  { href: "/practice/etude", title: "Today's étude", text: "A mix of what you've learned, leaning towards your slowest notes." },
  { href: "/practice/custom", title: "Custom étude", text: "Choose the clef, range and accidentals yourself." },
];

export default function Practice() {
  return (
    <main className="wrap page">
      <h1 className="display">Practice</h1>
      <div className="stack" style={{ gap: 0 }}>
        {ROWS.map((r) => (
          <Link key={r.href} href={r.href} className="card-link">
            <h2 style={{ fontSize: "1.5rem" }}>{r.title}</h2>
            <p className="muted">{r.text}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
