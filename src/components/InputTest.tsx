"use client";

import { midiName } from "@/lib/notes";
import { useSettings } from "@/lib/progress";
import { useListener } from "@/lib/useListener";

export default function InputTest() {
  const { source } = useSettings();
  const l = useListener(() => {});
  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="row">
        <button className="btn" onClick={() => (l.active ? l.stop() : l.start(source === "screen" ? "mic" : source))}>
          <span>{l.active ? "Stop listening" : "Test input"}</span>
        </button>
      </div>
      {l.error && <div className="alert" role="alert">{l.error}</div>}
      {l.active && (
        <div className="readout" style={{ justifyContent: "flex-start" }} aria-live="polite">
          <div>
            <span className="label">Heard</span>
            <b>{l.heard ? midiName(l.heard.midi) : "–"}</b>
            <span className="muted" style={{ fontSize: "0.8rem" }}>
              {l.heard && source === "mic" ? `${l.heard.cents > 0 ? "+" : ""}${l.heard.cents}¢ · ${l.heard.hz.toFixed(1)} Hz` : " "}
            </span>
          </div>
          {source === "midi" && (
            <div>
              <span className="label">Devices</span>
              <b style={{ fontSize: "1.1rem" }}>{l.devices.length ? l.devices.join(", ") : "none found"}</b>
            </div>
          )}
        </div>
      )}
      <p className="muted small" style={{ maxWidth: "48ch" }}>
        Play a note. If the name is right and steady, you&apos;re ready.
      </p>
    </div>
  );
}
