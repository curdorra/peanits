"use client";

export type ListenItem = { label: string; sub?: string; play: () => void };

/** A row of things to hear. */
export default function Listen({ items }: { items: ListenItem[] }) {
  return (
    <div className="widget">
      <div className="listen">
        {items.map((it) => (
          <button key={it.label} className="listen-item" onClick={it.play}>
            <span aria-hidden="true">▶</span>
            <span>
              {it.label}
              {it.sub && <span className="who">{it.sub}</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
