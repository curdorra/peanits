"use client";

import Drill from "./Drill";
import type { Unit } from "@/lib/curriculum";
import { useSettings } from "@/lib/progress";

export default function UnitDrill({ unit, nextId }: { unit: Unit; nextId?: string }) {
  const { length } = useSettings();
  return (
    <Drill
      title={unit.title}
      detail={unit.blurb}
      sections={unit.sections}
      alters={unit.alters}
      length={length}
      unitId={unit.id}
      backHref="/path"
      backLabel="Back to the path"
      nextHref={nextId ? `/practice/unit/${nextId}` : undefined}
    />
  );
}
