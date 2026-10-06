"use client";

import { useState } from "react";
import InputTest from "@/components/InputTest";
import { progressStore, settingsStore, useSettings } from "@/lib/progress";

export default function Settings() {
  const s = useSettings();
  const [confirm, setConfirm] = useState(false);

  return (
    <main className="wrap page">
      <div className="stack">
        <div className="label">Settings</div>
        <h1 className="display">Settings</h1>
      </div>

      <section className="stack" style={{ gap: 14 }}>
        <div className="label">Listen with</div>
        <div className="row" role="group" aria-label="Input source">
          {(["mic", "midi"] as const).map((v) => (
            <button key={v} className="btn" aria-pressed={s.source === v} onClick={() => settingsStore.update((x) => ({ ...x, source: v }))}>
              <span>{v === "mic" ? "Microphone" : "MIDI keyboard"}</span>
            </button>
          ))}
        </div>
        <InputTest />
      </section>

      <hr className="rule" />

      <section className="stack" style={{ gap: 14 }}>
        <div className="label">Notes per round</div>
        <div className="row" role="group" aria-label="Notes per round">
          {[10, 20, 40].map((n) => (
            <button key={n} className="btn" aria-pressed={s.length === n} onClick={() => settingsStore.update((x) => ({ ...x, length: n }))}>
              <span>{n}</span>
            </button>
          ))}
        </div>
      </section>

      <hr className="rule" />

      <section className="stack" style={{ gap: 14 }}>
        <div className="label">Your data</div>
        <p className="muted" style={{ maxWidth: "56ch" }}>
          Progress is saved only in this browser, on this device. There is no account. Clearing your browser data removes it.
        </p>
        {confirm ? (
          <div className="row">
            <span>Erase all progress?</span>
            <button className="btn solid" onClick={() => { progressStore.reset(); setConfirm(false); }}><span>Yes, erase</span></button>
            <button className="tbtn" onClick={() => setConfirm(false)}>Cancel</button>
          </div>
        ) : (
          <button className="btn" style={{ alignSelf: "flex-start" }} onClick={() => setConfirm(true)}><span>Erase progress</span></button>
        )}
      </section>
    </main>
  );
}
