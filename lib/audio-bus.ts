/**
 * One AudioContext for the whole page. Everything audible goes through the master gain and an
 * analyser, so the headline can lean on the loudness of what you just played.
 */
type Listener = (level: number) => void;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let analyser: AnalyserNode | null = null;
let raf = 0;
const listeners = new Set<Listener>();
const data = new Uint8Array(256);

export function audio() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 3400;
    analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.82;
    master.connect(lp).connect(analyser).connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, master: master!, analyser: analyser! };
}

/** 0..1 loudness, smoothed. Starts a single rAF loop while anyone listens. */
export function onLevel(fn: Listener) {
  listeners.add(fn);
  if (!raf) {
    let last = 0;
    const tick = () => {
      if (analyser) {
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < 64; i++) sum += data[i];
        last += (Math.min(1, sum / 64 / 150) - last) * 0.35;
      }
      listeners.forEach((l) => l(last));
      raf = listeners.size ? requestAnimationFrame(tick) : 0;
    };
    raf = requestAnimationFrame(tick);
  }
  return () => { listeners.delete(fn); };
}

/** A soft piano-ish voice: a triangle plus a quiet octave and twelfth, plucked and left to ring. */
export function pluck(midi: number, volume = 1) {
  const { ctx: c, master: m } = audio();
  const t = c.currentTime, f = 440 * 2 ** ((midi - 69) / 12);
  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.5 * volume, t + 0.006);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
  env.connect(m);
  ([["triangle", f, 1], ["sine", f * 2, 0.22], ["sine", f * 3, 0.06]] as const).forEach(([type, hz, vol]) => {
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = hz; g.gain.value = vol;
    o.connect(g).connect(env);
    o.start(t); o.stop(t + 2.5);
  });
}
