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
  const prev = ARTICLES[i - 1];
  const next = ARTICLES[i + 1];

  return (
    <main className="wrap page">
      <article className="stack" style={{ gap: 28 }}>
        <div className="stack">
          <Link className="tbtn" href="/learn" style={{ alignSelf: "flex-start" }}>← The learning shelf</Link>
          <div className="label">{a.category} · {a.minutes} min read</div>
          <h1 className="display">{a.title}</h1>
        </div>
        <hr className="rule" />
        <div className="prose">
          {a.blocks.map((b, k) => {
            if (b.t === "h2") return <h2 key={k}>{b.text}</h2>;
            if (b.t === "p") return <p key={k}>{b.text}</p>;
            if (b.t === "ul") return <ul key={k}>{b.items.map((it) => <li key={it}>{it}</li>)}</ul>;
            return <p key={k} className="aside">{b.text}</p>;
          })}
        </div>
        <hr className="rule" />
        <nav className="row" style={{ justifyContent: "space-between" }} aria-label="More guides">
          {prev ? <Link className="tbtn" href={`/learn/${prev.slug}`}>← {prev.title}</Link> : <span />}
          {next ? <Link className="tbtn" href={`/learn/${next.slug}`}>{next.title} →</Link> : <span />}
        </nav>
      </article>
    </main>
  );
}
