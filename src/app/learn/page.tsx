import Link from "next/link";
import type { Metadata } from "next";
import { ARTICLES } from "@/content/articles";

export const metadata: Metadata = { title: "Learn" };

export default function Learn() {
  return (
    <main className="wrap page">
      <h1 className="display">Learn</h1>
      <div className="stack" style={{ gap: 0 }}>
        {ARTICLES.map((a) => (
          <Link key={a.slug} href={`/learn/${a.slug}`} className="card-link">
            <h2 style={{ fontSize: "1.45rem" }}>{a.title}</h2>
            <p className="muted">{a.blurb}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
