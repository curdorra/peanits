"use client";

import { useState } from "react";
import MiniStaff from "../MiniStaff";
import { noteName, type Clef, type Note } from "@/lib/notes";
import { playNote } from "@/lib/sound";

/** Tap a name to see the note on the staff and hear it. */
export default function NoteExplorer({ clef = "treble", notes, keyId }: { clef?: Clef; notes: Note[]; keyId?: string }) {
  const [sel, setSel] = useState<Note>(notes[0]);
  return (
    <div className="widget">
      <MiniStaff clef={clef} keyId={keyId} notes={[sel]} label={`${clef} staff showing ${noteName(sel)}`} />
      <div className="chips" style={{ justifyContent: "center" }} role="group" aria-label="Notes">
        {notes.map((n) => (
          <button
            key={n.midi + n.step}
            className="chip"
            aria-pressed={sel === n}
            data-state={sel === n ? "right" : ""}
            onClick={() => {
              setSel(n);
              playNote(n.midi);
            }}
          >
            {noteName(n)}
          </button>
        ))}
      </div>
    </div>
  );
}
