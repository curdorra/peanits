"use client";

import Link from "next/link";
import { useState } from "react";
import Drill from "@/components/Drill";
import GradePicker from "@/components/GradePicker";
import SightReader from "@/components/SightReader";
import { UNITS } from "@/lib/curriculum";
import { KEYS } from "@/lib/keys";
import { useMyGrade } from "@/lib/myGrade";
import { streakOf, useProgress } from "@/lib/progress";
import { specForLevel } from "@/lib/sightread";
import type { Alter, Section } from "@/lib/notes";
import { useHydrated } from "@/lib/useHydrated";

const WARM_UP_NOTES = 10;
const STEPS = ["Warm up", "Sight-read"] as const;

/** Today's practice: a short note-reading warm-up, then a melody at your grade. */
export default function Session() {
  const mine = useMyGrade();
  const p = useProgress();
  const [step, setStep] = useState(0);
  const hydrated = useHydrated();

  if (!hydrated) return <main className="wrap page" />;
  if (!mine) {
    return (
      <main className="wrap page">
        <h1 className="display">First, your grade</h1>
        <GradePicker />
      </main>
    );
  }

  // Warm up on everything you've completed, or on the next note-reading unit if you haven't completed any.
  const done = UNITS.filter((u) => p.units[u.id]?.passed);
  const source = done.length ? done : [UNITS.find((u) => !p.units[u.id]?.passed) ?? UNITS[0]];
  const sections: Section[] = source.flatMap((u) => u.sections);
  const alters = [...new Set(source.flatMap((u) => u.alters))] as Alter[];
  const spec = specForLevel(mine.level);
  const streak = streakOf(p.days);

  return (
    <main className="wrap page">
      {step < STEPS.length && (
        <p className="label center" style={{ textAlign: "center" }}>
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </p>
      )}

      {step === 0 && (
        <Drill
          key="warm-up"
          title="Warm up"
          detail={`${WARM_UP_NOTES} single notes, leaning towards the ones you find slow.`}
          sections={sections}
          alters={alters}
          length={WARM_UP_NOTES}
          backHref="/"
          backLabel="Back to Today"
          onNext={() => setStep(1)}
          nextLabel="Continue to sight-reading"
        />
      )}

      {step === 1 && (
        <SightReader
          key="sight-read"
          spec={spec}
          title={`Sight-read · ${mine.label}`}
          detail={`Keys: ${spec.keys.map((k) => KEYS[k].name).join(", ")}. Time: ${spec.times.join(", ")}. ${spec.bars} bars.`}
          backHref="/"
          backLabel="Back to Today"
          onNext={() => setStep(2)}
          nextLabel="Finish"
        />
      )}

      {step === 2 && (
        <div className="drill">
          <h1 className="display">That&apos;s today done.</h1>
          <p className="muted">{streak > 1 ? `${streak} days in a row.` : "Come back tomorrow and it starts to add up."}</p>
          <div className="row" style={{ justifyContent: "center", gap: 22 }}>
            <Link className="btn solid" href="/"><span>Back to Today</span></Link>
            <Link className="btn" href="/practice/rhythm"><span>A bit of rhythm</span></Link>
            <Link className="tbtn" href={mine.href}>Your pieces and scales</Link>
          </div>
        </div>
      )}
    </main>
  );
}
