export type MidiSession = { stop: () => void; inputNames: () => string[] };

/** Listens for note-on messages from any connected MIDI keyboard (Web MIDI). */
export async function startMidi(
  onNote: (midi: number, velocity: number) => void,
): Promise<MidiSession> {
  if (!navigator.requestMIDIAccess) {
    throw new Error("Web MIDI isn't supported in this browser. Try Chrome, Edge, Firefox or Opera.");
  }
  const access = await navigator.requestMIDIAccess();

  const handler = (e: MIDIMessageEvent) => {
    if (!e.data) return;
    const [status, note, velocity] = e.data;
    if ((status & 0xf0) === 0x90 && velocity > 0) onNote(note, velocity);
  };
  const attach = () => access.inputs.forEach((input) => (input.onmidimessage = handler));
  attach();
  access.onstatechange = attach;

  return {
    stop() {
      access.inputs.forEach((input) => (input.onmidimessage = null));
      access.onstatechange = null;
    },
    inputNames: () => Array.from(access.inputs.values()).map((i) => i.name ?? "MIDI device"),
  };
}
