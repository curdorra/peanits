"use client";

import Link from "next/link";
import Drill from "@/components/Drill";
import { UNITS } from "@/lib/curriculum";
import { useProgress, useSettings } from "@/lib/progress";
import type { Alter, Section } from "@/lib/notes";

export default function Etude() {
  const progress = useProgress();
  const { length } = useSettings();
  const done = UNITS.filter((u) => progress.units[u.id]?.passed);
  const source = done.length ? done : [UNITS[0]];
  const sections: Section[] = source.flatMap((u) => u.sections);
  const alters = [...new Set(source.flatMap((u) => u.alters))] as Alter[];

  return (
    <main className="wrap page">
      <Drill
        key={source.map((u) => u.id).join()}
        title="Today's étude"
        detail={
          done.length
            ? "A mix of everything you've completed, leaning towards the notes you find slow or tricky."
            : "Start with the first notes of the path. Complete units to widen this mix."
        }
        sections={sections}
        alters={alters}
        length={length}
        backHref="/practice"
        backLabel="Back to practice"
      />
      <p className="muted center" style={{ textAlign: "center" }}>
        <Link href="/path">See the path</Link>
      </p>
    </main>
  );
}
