"use client";

import { BOARDS, findGrade, practiceLevel } from "@/content/boards";
import { settingsStore, useSettings } from "./progress";

/** The exam grade you're working towards (chosen once, changeable in Settings), with its links. */
export function useMyGrade() {
  const { board, grade } = useSettings();
  const b = board ? BOARDS[board] : undefined;
  const g = board && grade ? findGrade(board, grade) : undefined;
  if (!b || !g) return null;
  return {
    board: b,
    grade: g,
    label: `${b.name} ${g.name}`,
    href: `/grades/${b.id}/${g.id}`,
    sightReadingHref: `/practice/sight-reading/${b.id}/${g.id}`,
    level: practiceLevel(b.id, g.level), // sight-reading level (Trinity tests sit lower)
  };
}

export type MyGrade = NonNullable<ReturnType<typeof useMyGrade>>;

export const setMyGrade = (board: "abrsm" | "trinity", grade: string) => settingsStore.update((s) => ({ ...s, board, grade }));
