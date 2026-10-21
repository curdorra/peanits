export type MidiSession = { stop: () => void; inputNames: () => string[] };

/** Listens for note-on messages from any connected MIDI keyboard (Web MIDI). */
export async function startMidi(
  onNote: (midi: number, velocity: number) => void,
): Promise<MidiSession> {
  if (!navigator.requestMIDIAccess) throw new Error(whyNoMidi());
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

/** Why this browser can't see MIDI keyboards, in words a pianist can act on. */
function whyNoMidi(): string {
  const ua = navigator.userAgent;
  const apple = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  if (apple) return "iPhones and iPads can't connect MIDI keyboards to websites yet (Apple doesn't allow it in any browser). Use the microphone or the on-screen keys.";
  if (!window.isSecureContext) return "MIDI only works on a secure page. Open peanits from its https:// address (or localhost), not a plain http:// one.";
  if (/Safari\//.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/.test(ua))
    return "Safari doesn't support MIDI keyboards. Open peanits in Chrome or Edge to use one (Settings › Get the app shows how to install it), or use the microphone here.";
  return "This browser can't see MIDI keyboards. Try Chrome, Edge or Firefox.";
}
