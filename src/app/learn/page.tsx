import type { Metadata } from "next";
import Choice from "@/components/Choice";
import { LESSONS } from "@/content/lessons";
import { COMPOSERS } from "@/content/composers";
import { GLOSSARY } from "@/content/glossary";

export const metadata: Metadata = { title: "Learn" };

export default function Learn() {
  return (
    <main className="wrap page">
      <h1 className="display">Learn</h1>
      <nav className="choices" aria-label="Learn">
        <Choice href="/learn/lessons" title="Lessons" text={`${LESSONS.length} short, hands-on lessons: tap, listen, then check yourself.`} />
        <Choice href="/learn/mood" title="Play it for the mood" text="Tell us how you feel. We'll suggest pieces that fit, with the story behind each." />
        <Choice href="/learn/composers" title="Composers" text={`${COMPOSERS.length} composers from Purcell to Florence Price, and what to play first.`} />
        <Choice href="/learn/timeline" title="Timeline" text="From the harpsichord to MIDI: the piano's story in moments." />
        <Choice href="/learn/glossary" title="Glossary" text={`${GLOSSARY.length} Italian terms and signs, with flashcards.`} />
        <Choice href="/learn/read" title="Reading room" text="Longer guides on practising, history and theory." />
      </nav>
    </main>
  );
}
