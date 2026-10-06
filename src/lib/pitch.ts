import { PitchDetector } from "pitchy";
import { freqToMidiFloat } from "./notes";

export type PitchFrame = {
  hz: number;
  midi: number; // nearest MIDI note
  cents: number; // deviation from that note, -50..50
  clarity: number; // 0..1, detector confidence
};

export type MicSession = { stop: () => void };

const MIN_RMS = 0.01;
const MIN_CLARITY = 0.9;

/**
 * Monophonic pitch detection from the microphone (McLeod pitch method).
 * Calls onFrame every animation frame; null means "no confident pitch".
 * All processing stays in the browser.
 */
export async function startMic(
  onFrame: (frame: PitchFrame | null) => void,
): Promise<MicSession> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  });
  const ctx = new AudioContext();
  await ctx.resume();
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 4096; // ~93ms window at 44.1kHz; enough periods for low piano notes
  ctx.createMediaStreamSource(stream).connect(analyser);

  const buf = new Float32Array(analyser.fftSize);
  const detector = PitchDetector.forFloat32Array(analyser.fftSize);
  let raf = 0;

  const tick = () => {
    analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    const rms = Math.sqrt(sum / buf.length);

    if (rms < MIN_RMS) {
      onFrame(null);
    } else {
      const [hz, clarity] = detector.findPitch(buf, ctx.sampleRate);
      if (clarity >= MIN_CLARITY && hz > 27 && hz < 4200) {
        const exact = freqToMidiFloat(hz);
        const midi = Math.round(exact);
        onFrame({ hz, midi, cents: Math.round((exact - midi) * 100), clarity });
      } else {
        onFrame(null);
      }
    }
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
