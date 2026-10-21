import scores from "@/content/scores.json";

const PIECES: Record<string, string> = scores.pieces;
const COMPOSERS: Record<string, string> = scores.composers;

/**
 * Link to a free score on IMSLP. Pages are looked up ahead of time (scripts/resolve-scores.ts):
 * the piece's own page when IMSLP has one, otherwise the composer's page, otherwise a search.
 */
export default function ScoreLink({ composer, title }: { composer: string; title: string }) {
  const surname = composer.split(" ").pop()!;
  const piece = PIECES[`${composer}|${title}`];
  const href =
    piece ??
    COMPOSERS[composer] ??
    `https://imslp.org/index.php?title=Special:Search&search=${encodeURIComponent(`${surname} ${title.replace(/\(.*?\)/g, "")}`)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={piece ? `Free score of ${title} on IMSLP` : `${surname}'s scores on IMSLP`}
      title={piece ? undefined : `IMSLP has no single page for this piece; look under ${surname}'s works.`}
    >
      {piece ? "Free score ↗" : `${surname} scores ↗`}
    </a>
  );
}
