"use client";

import { useEffect, useRef, type RefObject } from "react";
import { midiName } from "@/lib/notes";
import { settingsStore, useSettings } from "@/lib/progress";
import { useListener } from "@/lib/useListener";

/** A thin bar showing how loud the microphone hears you. Reads the level ref each frame, no re-renders. */
function LevelMeter({ level }: { level: RefObject<number> }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (bar.current) bar.current.style.transform = `scaleX(${level.current})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [level]);
  return (
    <div className="meter" aria-hidden="true">
      <div ref={bar} />
    </div>
  );
}

export default function InputTest() {
  const { source, micSensitivity } = useSettings();
  const l = useListener(() => {});
  const restart = () => {
    if (l.active) void l.start(source === "screen" ? "mic" : source);
  };

  return (
    <div className="stack" style={{ gap: 16 }}>
      {source === "mic" && (
        <label className="stack" style={{ gap: 6, maxWidth: 360 }}>
          <span className="label">Microphone sensitivity</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={micSensitivity}
            onChange={(e) => settingsStore.update((x) => ({ ...x, micSensitivity: Number(e.target.value) }))}
            onPointerUp={restart}
            onKeyUp={restart}
          />
          <span className="muted small row" style={{ justifyContent: "space-between" }}>
            <span>Noisy room</span>
            <span>Quiet piano, far away</span>
          </span>
        </label>
      )}
      <div className="row">
        <button className="btn" onClick={() => (l.active ? l.stop() : l.start(source === "screen" ? "mic" : source))}>
          <span>{l.active ? "Stop listening" : "Test input"}</span>
        </button>
      </div>
      {l.error && <div className="alert" role="alert">{l.error}</div>}
      {l.active && source === "mic" && <LevelMeter level={l.level} />}
      {l.active && (
        <div className="readout" style={{ justifyContent: "flex-start" }} aria-live="polite">
          <div>
            <span className="label">Heard</span>
            <b>{l.heard ? midiName(l.heard.midi) : "–"}</b>
            <span className="muted" style={{ fontSize: "0.8rem" }}>
              {l.heard && source === "mic" ? `${l.heard.cents > 0 ? "+" : ""}${l.heard.cents}¢ · ${l.heard.hz.toFixed(1)} Hz` : " "}
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
        {source === "mic" && " If the bar moves but no note appears, raise the sensitivity. If notes appear when you aren't playing, lower it."}
      </p>
    </div>
  );
}
