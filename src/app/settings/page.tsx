"use client";

import { useState } from "react";
import InputTest from "@/components/InputTest";
import SourcePicker from "@/components/SourcePicker";
import { progressStore, useSettings } from "@/lib/progress";

export default function Settings() {
  const s = useSettings();
  const [confirm, setConfirm] = useState(false);

  return (
    <main className="wrap page">
      <h1 className="display">Settings</h1>

      <section className="stack" style={{ gap: 18, alignItems: "flex-start" }}>
        <h2 className="title">Listen with</h2>
        <SourcePicker />
        {s.source !== "screen" && <InputTest />}
      </section>

      <section className="stack" style={{ gap: 14 }}>
        <h2 className="title">Your progress</h2>
        <p className="muted" style={{ maxWidth: "48ch" }}>Saved only in this browser. There is no account.</p>
        {confirm ? (
          <div className="row" style={{ gap: 18 }}>
            <span>Erase everything?</span>
            <button className="btn solid" onClick={() => { progressStore.reset(); setConfirm(false); }}><span>Erase</span></button>
            <button className="tbtn" onClick={() => setConfirm(false)}>Cancel</button>
          </div>
        ) : (
          <button className="tbtn" style={{ alignSelf: "flex-start" }} onClick={() => setConfirm(true)}>Erase progress</button>
        )}
      </section>
    </main>
  );
}
