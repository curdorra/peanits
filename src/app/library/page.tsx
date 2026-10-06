import type { Metadata } from "next";

export const metadata: Metadata = { title: "Library" };

export default function Library() {
  return (
    <main className="wrap page">
      <div className="stack">
        <div className="label">Library</div>
        <h1 className="display">Free scores, coming soon</h1>
        <p className="muted" style={{ maxWidth: "58ch" }}>
          The library will gather public-domain piano music, sorted by level, era and composer, to read on screen and, later, to download as
          printable PDFs for your iPad or music stand.
        </p>
      </div>
      <hr className="rule" />
      <div className="stack" style={{ maxWidth: "58ch" }}>
        <div className="label">The plan</div>
        <ul className="stack" style={{ margin: 0, paddingLeft: "1.2em", gap: 8 }}>
          <li>Editions that are in the public domain, with their sources credited.</li>
          <li>Graded to match the path, so each unit has pieces to try.</li>
          <li>A reading view that works on a tablet, and PDFs to print.</li>
        </ul>
        <p className="muted">Until then, the Learn section has guides on reading and practising.</p>
      </div>
    </main>
  );
}
