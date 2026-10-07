import Link from "next/link";

export default function Independent() {
  return (
    <p className="muted small" style={{ maxWidth: "60ch" }}>
      peanits is independent and not connected with, or endorsed by, ABRSM or Trinity College London. Requirements are
      summarised in our own words from their published syllabuses; always check the official syllabus before an exam.{" "}
      <Link href="/about">About and sources</Link>
    </p>
  );
}
