import Link from "next/link";
import type { Metadata } from "next";
import { ARTICLES } from "@/content/articles";

export const metadata: Metadata = { title: "Learn" };

export default function Learn() {
  return (
    <main className="wrap page">
      <h1 className="display">Learn</h1>
      <nav className="choices" aria-label="Guides">
        {ARTICLES.map((a) => (
          <Link key={a.slug} href={`/learn/${a.slug}`} className="choice">
            <div>
              <h2 style={{ fontSize: "1.5rem" }}>{a.title}</h2>
              <p>{a.blurb}</p>
            </div>
            <span className="go" aria-hidden="true">→</span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
