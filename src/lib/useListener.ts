"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { startMic, type PitchFrame, type MicSession } from "./pitch";
import { startMidi, type MidiSession } from "./midi";

export type Heard = { midi: number; cents: number; hz: number } | null;

const STABLE_FRAMES = 4; // consecutive identical mic frames before a note counts

/**
 * Listens for played notes from the microphone or a MIDI keyboard.
 * `onNote` fires once per note: when the mic has heard the same pitch for a few frames,
 * or immediately on a MIDI note-on.
 */
export function useListener(onNote: (midi: number) => void) {
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heard, setHeard] = useState<Heard>(null);
  const [devices, setDevices] = useState<string[]>([]);

  const session = useRef<MicSession | MidiSession | null>(null);
  const cb = useRef(onNote);
  const stable = useRef({ midi: -1, count: 0 });
  const last = useRef<Heard>(null);

  useEffect(() => {
    cb.current = onNote;
  });

  const stop = useCallback(() => {
    session.current?.stop();
    session.current = null;
    last.current = null;
    setActive(false);
    setHeard(null);
  }, []);

  const start = useCallback(
    async (source: "mic" | "midi"): Promise<boolean> => {
      stop();
      setError(null);
      try {
        if (source === "mic") {
          session.current = await startMic((f: PitchFrame | null) => {
            const prev = last.current;
            const changed =
              (f === null) !== (prev === null) || (f && prev && (f.midi !== prev.midi || Math.abs(f.cents - prev.cents) >= 6));
            if (changed) {
              last.current = f && { midi: f.midi, cents: f.cents, hz: f.hz };
              setHeard(last.current);
            }
            const s = stable.current;
            if (!f) {
              s.midi = -1;
              s.count = 0;
              return;
            }
            if (f.midi === s.midi) s.count++;
            else {
              s.midi = f.midi;
              s.count = 1;
            }
            if (s.count === STABLE_FRAMES) cb.current(f.midi);
          });
          setDevices([]);
        } else {
          const m = await startMidi((midi) => {
            setHeard({ midi, cents: 0, hz: 0 });
            cb.current(midi);
          });
          session.current = m;
          setDevices(m.inputNames());
        }
        setActive(true);
        return true;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "";
        setError(
          source === "mic" && /denied|permission|notallowed/i.test(msg)
            ? "Microphone access was blocked. Allow it in your browser's site settings, or use a MIDI keyboard."
            : msg || "Couldn't start input.",
        );
        return false;
      }
    },
    [stop],
  );

  useEffect(() => () => session.current?.stop(), []);

  return { start, stop, active, error, heard, devices };
}
