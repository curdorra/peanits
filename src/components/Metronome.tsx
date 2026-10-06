import { METRONOME_PATHS } from "./art-metronome";

/** Pencil drawing of a metronome (generated once by scripts/gen-art.ts). */
export default function Metronome({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 130 190" aria-hidden="true" focusable="false">
      <g dangerouslySetInnerHTML={{ __html: METRONOME_PATHS }} />
    </svg>
  );
}
