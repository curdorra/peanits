"use client";

import Link from "next/link";
import { ROMAN, UNITS } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";

export default function PracticeNext() {
  const p = useProgress();
  const next = UNITS.find((u) => !p.units[u.id]?.passed);
  return (
    <div className="panel">
      <div className="label">Next on the path</div>
      <h2 className="title">{next ? next.title : "Path complete"}</h2>
      <p className="muted">{next ? `Grade ${ROMAN[next.grade]} · ${next.blurb}` : "You've completed every unit so far. More grades are on the way."}</p>
      {next ? <Link className="btn solid" href={`/practice/unit/${next.id}`}><span>Continue</span></Link> : <Link className="btn" href="/path"><span>View path</span></Link>}
    </div>
  );
}
