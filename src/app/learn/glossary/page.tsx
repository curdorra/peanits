"use client";

import Link from "next/link";
import { useState } from "react";
import Quiz, { type Question } from "@/components/Quiz";
import { CATS, GLOSSARY, type Cat } from "@/content/glossary";
import { optionsWith, pick } from "@/lib/random";

export default function Glossary() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Cat | "All">("All");
  const [cards, setCards] = useState(false);

  const pool = GLOSSARY.filter((t) => cat === "All" || t.cat === cat);
  const s = q.trim().toLowerCase();
  const shown = pool.filter((t) => !s || t.term.toLowerCase().includes(s) || t.meaning.toLowerCase().includes(s));

  function make(): Question {
    const t = pick(pool);
    const same = GLOSSARY.filter((x) => x.cat === t.cat).map((x) => x.meaning);
    return { prompt: t.term, options: optionsWith(t.meaning, same.length >= 4 ? same : GLOSSARY.map((x) => x.meaning)), answer: t.meaning };
  }

  if (cards) {
    return (
      <main className="wrap page">
        <Quiz title="Flashcards" intro="" make={make} backHref="/learn/glossary" backLabel="Back to the glossary" />
        <p className="center" style={{ textAlign: "center" }}><button className="tbtn" onClick={() => setCards(false)}>Back to the glossary</button></p>
      </main>
    );
  }

  return (
    <main className="wrap page">
      <div className="stack">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/learn">Learn</Link><span>/</span></nav>
        <h1 className="display">Glossary</h1>
        <div className="row" style={{ gap: 18 }}>
          <input className="search" type="search" placeholder="Search terms" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search the glossary" />
          <button className="btn solid" onClick={() => setCards(true)}><span>Flashcards{cat !== "All" ? `: ${cat}` : ""}</span></button>
        </div>
        <div className="row" role="group" aria-label="Category" style={{ gap: 16 }}>
          {(["All", ...CATS] as const).map((c) => (
            <button key={c} className="tbtn" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
      </div>
      <dl className="gloss">
        {shown.map((t) => (
          <div key={t.term}>
            <dt>{t.term}</dt>
            <dd className="muted">{t.meaning}</dd>
          </div>
        ))}
        {!shown.length && <p className="muted">Nothing matches “{q}”.</p>}
      </dl>
    </main>
  );
}
