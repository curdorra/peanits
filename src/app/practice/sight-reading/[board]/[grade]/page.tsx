import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SightReader from "@/components/SightReader";
import { BOARDS, findGrade, practiceLevel, type BoardId } from "@/content/boards";
import { KEYS } from "@/lib/keys";
import { specForLevel } from "@/lib/sightread";

export function generateStaticParams() {
  return Object.values(BOARDS).flatMap((b) => b.grades.map((g) => ({ board: b.id, grade: g.id })));
}

export async function generateMetadata({ params }: PageProps<"/practice/sight-reading/[board]/[grade]">): Promise<Metadata> {
  const { board, grade } = await params;
  const g = findGrade(board as BoardId, grade);
  return g ? { title: `Sight-reading · ${BOARDS[board as BoardId].name} ${g.name}` } : {};
}

export default async function Page({ params }: PageProps<"/practice/sight-reading/[board]/[grade]">) {
  const { board, grade } = await params;
  const b = BOARDS[board as BoardId];
  const g = findGrade(board as BoardId, grade);
  if (!b || !g) notFound();
  const spec = specForLevel(practiceLevel(b.id, g.level));
  const keys = spec.keys.map((k) => KEYS[k].name).join(", ");
  return (
    <main className="wrap page">
      <SightReader
        spec={spec}
        title={`${b.name} ${g.name}`}
        detail={`Keys: ${keys}. Time: ${spec.times.join(", ")}. ${spec.bars} bars.`}
        backHref={`/grades/${b.id}/${g.id}`}
        backLabel={`About ${b.name} ${g.name}`}
      />
    </main>
  );
}
