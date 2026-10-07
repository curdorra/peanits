"use client";

import Link from "next/link";
import { useState } from "react";
import { TIMELINE } from "@/content/glossary";

const ERAS = ["All", "Baroque", "Classical", "Romantic", "Modern"] as const;

export default function Timeline() {
  const [era, setEra] = useState<(typeof ERAS)[number]>("All");
  const items = TIMELINE.filter((e) => era === "All" || e.era === era);
  return (
    <main className="wrap page">
      <div className="stack">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/learn">Learn</Link><span>/</span></nav>
        <h1 className="display">Timeline</h1>
        <div className="row" role="group" aria-label="Era" style={{ gap: 22 }}>
          {ERAS.map((e) => (
            <button key={e} className="tbtn" aria-pressed={era === e} onClick={() => setEra(e)}>{e}</button>
          ))}
        </div>
      </div>
      <ol className="timeline">
        {items.map((e) => (
          <li key={e.year + e.label}>
            <span className="year num">{e.year === 1700 || e.year === 1600 ? `c. ${e.year}` : e.year}</span>
            <div>
              <h2>{e.label}</h2>
              <p className="muted">{e.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
