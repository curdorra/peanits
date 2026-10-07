"use client";

import Link from "next/link";
import { useState } from "react";
import LessonQuiz from "./LessonQuiz";
import { LESSONS, lessonBySlug } from "@/content/lessons";
import { completeLesson } from "@/lib/progress";

/** Shows a lesson one step at a time, then a short quiz. */
export default function LessonPlayer({ slug }: { slug: string }) {
  const lesson = lessonBySlug(slug)!;
  const [i, setI] = useState(0);
  const total = lesson.steps.length + 1; // + quiz
  const atQuiz = i >= lesson.steps.length;
  const step = lesson.steps[i];
  const idx = LESSONS.findIndex((l) => l.slug === slug);
  const next = LESSONS[idx + 1];

  return (
    <article className="stack" style={{ gap: 28 }}>
      <div className="stack">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/learn">Learn</Link><span>/</span><Link href="/learn/lessons">Lessons</Link><span>/</span>
        </nav>
        <h1 className="display">{lesson.title}</h1>
        <div className="steps" aria-label={`Step ${i + 1} of ${total}`}>
          {Array.from({ length: total }, (_, k) => (
            <button key={k} className={`stepdot${k === i ? " on" : k < i ? " done" : ""}`} onClick={() => setI(k)} aria-label={k < lesson.steps.length ? `Step ${k + 1}` : "Quiz"} />
          ))}
        </div>
      </div>

      {atQuiz ? (
        <section className="stack" style={{ gap: 12 }}>
          <h2 className="title">Check yourself</h2>
          <LessonQuiz key={slug} questions={lesson.quiz} onDone={() => completeLesson(slug)} />
        </section>
      ) : (
        <section className="stack lesson-step" style={{ gap: 14 }} aria-live="polite">
          <h2 className="title">{step.title}</h2>
          <p className="lesson-body">{step.body}</p>
          {step.widget}
        </section>
      )}

      <nav className="row" style={{ justifyContent: "space-between" }} aria-label="Lesson steps">
        {i > 0 ? <button className="tbtn" onClick={() => setI(i - 1)}>← Back</button> : <span />}
        {!atQuiz ? (
          <button className="btn solid" onClick={() => setI(i + 1)}><span>{i + 1 === lesson.steps.length ? "Check yourself" : "Next"}</span></button>
        ) : next ? (
          <Link className="tbtn" href={`/learn/lessons/${next.slug}`}>Next lesson: {next.title} →</Link>
        ) : (
          <Link className="tbtn" href="/learn/lessons">All lessons</Link>
        )}
      </nav>
    </article>
  );
}
