"use client";

import { settingsStore, useSettings, type Source } from "@/lib/progress";

const LABELS: Record<Source, string> = { mic: "Microphone", midi: "MIDI keyboard", screen: "On-screen keys" };

/** The three ways to answer, as quiet underlined text choices. */
export default function SourcePicker() {
  const { source } = useSettings();
  return (
    <div className="row" role="group" aria-label="Listen with" style={{ justifyContent: "center", gap: 24 }}>
      {(Object.keys(LABELS) as Source[]).map((s) => (
        <button key={s} className="tbtn" aria-pressed={source === s} onClick={() => settingsStore.update((x) => ({ ...x, source: s }))}>
          {LABELS[s]}
        </button>
      ))}
    </div>
  );
}
