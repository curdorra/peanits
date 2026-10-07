import Link from "next/link";

/** A full-width row link: title, one line of description, and an arrow. */
export default function Choice({ href, title, text, external }: { href: string; title: string; text?: string; external?: boolean }) {
  const body = (
    <>
      <div>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      <span className="go" aria-hidden="true">{external ? "↗" : "→"}</span>
    </>
  );
  return external ? (
    <a href={href} className="choice" target="_blank" rel="noopener noreferrer">{body}</a>
  ) : (
    <Link href={href} className="choice">{body}</Link>
  );
}
