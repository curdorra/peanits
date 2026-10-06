import { notFound } from "next/navigation";
import type { Metadata } from "next";
import UnitDrill from "@/components/UnitDrill";
import { UNITS, ROMAN, unitById } from "@/lib/curriculum";

export function generateStaticParams() {
  return UNITS.map((u) => ({ id: u.id }));
}

export async function generateMetadata({ params }: PageProps<"/practice/unit/[id]">): Promise<Metadata> {
  const { id } = await params;
  const u = unitById(id);
  return { title: u ? `${u.title} · Grade ${ROMAN[u.grade]}` : "Practice" };
}

export default async function Page({ params }: PageProps<"/practice/unit/[id]">) {
  const { id } = await params;
  const unit = unitById(id);
  if (!unit) notFound();
  const i = UNITS.findIndex((u) => u.id === id);
  return (
    <main className="wrap page">
      <UnitDrill unit={unit} nextId={UNITS[i + 1]?.id} />
    </main>
  );
}
