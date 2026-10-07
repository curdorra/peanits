import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ARTICLES, articleBySlug } from "@/content/articles";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = articleBySlug(slug);
  return a ? { title: a.title, description: a.blurb } : {};
}

export default async function Article({ params }: PageProps<"/learn/[slug]">) {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) notFound();
  const i = ARTICLES.findIndex((x) => x.slug === slug);
  const next = ARTICLES[i + 1];

  return (
    <main className="wrap page">
      <article className="stack" style={{ gap: 32 }}>
        <div className="stack">
          <Link className="tbtn" href="/learn" style={{ alignSelf: "flex-start" }}>← Learn</Link>
          <h1 className="display">{a.title}</h1>
        </div>
        <div className="prose">
          {a.blocks.map((b, k) => {
            if (b.t === "h2") return <h2 key={k}>{b.text}</h2>;
            if (b.t === "p") return <p key={k}>{b.text}</p>;
            if (b.t === "ul") return <ul key={k}>{b.items.map((it) => <li key={it}>{it}</li>)}</ul>;
            return <p key={k} className="aside">{b.text}</p>;
          })}
        </div>
        {next && <Link className="tbtn" href={`/learn/${next.slug}`} style={{ alignSelf: "flex-end" }}>{next.title} →</Link>}
      </article>
    </main>
  );
}
