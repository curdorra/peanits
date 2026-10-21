import { PitchDetector } from "pitchy";
import { freqToMidiFloat } from "./notes";

export type PitchFrame = {
  hz: number;
  midi: number; // nearest MIDI note
  cents: number; // deviation from that note, -50..50
  clarity: number; // 0..1, detector confidence
};

export type MicSession = { stop: () => void };

// Sensitivity 0..1 (Settings). Higher hears quieter playing but is likelier to pick up room noise.
// The loudness gate sits a few times above the room's own noise floor, which is measured continuously,
// so a quiet laptop mic and a loud USB mic both work without turning the volume up.
const gateFor = (sensitivity: number) => ({
  aboveFloor: 4 - 2.5 * sensitivity, // 4× the noise floor at 0, 1.5× at 1
  minRms: 0.004 - 0.0035 * sensitivity, // absolute minimum, so silence never counts
  clarity: 0.88 - 0.13 * sensitivity, // piano tones are less "pure" than a voice; 0.88 … 0.75
});

/**
 * Monophonic pitch detection from the microphone (McLeod pitch method).
 * Calls onFrame every animation frame with the pitch (null means "no confident pitch")
 * and the input level, 0..1, for meters. All processing stays in the browser.
 */
export async function startMic(
  onFrame: (frame: PitchFrame | null, level: number) => void,
  sensitivity = 0.6,
): Promise<MicSession> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  });
  const ctx = new AudioContext();
  await ctx.resume();
  const src = ctx.createMediaStreamSource(stream);

  // Trim rumble below the piano's lowest A and hiss above the top of the range we listen to.
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 25;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 4500;
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 4096; // ~93ms window at 44.1kHz; enough periods for low piano notes
  src.connect(hp).connect(lp).connect(analyser);

  const buf = new Float32Array(analyser.fftSize);
  const detector = PitchDetector.forFloat32Array(analyser.fftSize);
  const gate = gateFor(sensitivity);
  let floor = 0.002; // running estimate of the room's background level
  let raf = 0;

  const tick = () => {
    analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    const rms = Math.sqrt(sum / buf.length);
    // The floor falls quickly to quiet moments and rises slowly, so held notes don't raise it much.
    floor = rms < floor ? floor * 0.9 + rms * 0.1 : floor * 0.998 + rms * 0.002;
    const level = Math.min(1, Math.sqrt(rms / 0.1));

    let frame: PitchFrame | null = null;
    if (rms >= Math.max(gate.minRms, floor * gate.aboveFloor)) {
      const [hz, clarity] = detector.findPitch(buf, ctx.sampleRate);
      if (clarity >= gate.clarity && hz > 27 && hz < 4200) {
        const exact = freqToMidiFloat(hz);
        const midi = Math.round(exact);
        frame = { hz, midi, cents: Math.round((exact - midi) * 100), clarity };
      }
    }
    onFrame(frame, level);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return {
    stop() {
      cancelAnimationFrame(raf);
      stream.getTracks().forEach((t) => t.stop());
      void ctx.close();
    },
  };
}
