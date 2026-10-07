import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LessonPlayer from "@/components/learn/LessonPlayer";
import { LESSONS, lessonBySlug } from "@/content/lessons";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/lessons/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const l = lessonBySlug(slug);
  return l ? { title: l.title, description: l.blurb } : {};
}

export default async function Page({ params }: PageProps<"/learn/lessons/[slug]">) {
  const { slug } = await params;
  if (!lessonBySlug(slug)) notFound();
  return (
    <main className="wrap page">
      <LessonPlayer slug={slug} />
    </main>
  );
}
