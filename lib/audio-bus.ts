/**
 * One AudioContext for the whole page. Everything audible goes through the master gain and an
 * analyser, so the headline can lean on the loudness of whatever you just played.
 *
 * The piano is the Salamander Grand Piano (Alexander Holm, CC BY 3.0): nine samples from C4 to C6,
 * each stretched at most a minor third to reach its neighbours. A small synthetic room adds warmth.
 * Until the samples have loaded, a soft synthesised voice covers for them.
 */
type Listener = (level: number) => void;

const SAMPLES: [number, string][] = [[60, "C4"], [63, "Ds4"], [66, "Fs4"], [69, "A4"], [72, "C5"], [75, "Ds5"], [78, "Fs5"], [81, "A5"], [84, "C6"]];

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let send: GainNode | null = null;
let analyser: AnalyserNode | null = null;
let raf = 0;
const listeners = new Set<Listener>();
const data = new Uint8Array(256);

const raw = new Map<number, ArrayBuffer>();
const buffers = new Map<number, AudioBuffer>();
let fetching: Promise<void> | null = null;
let decoding: Promise<void> | null = null;

/** A short, soft room: decaying stereo noise. Cheap, and it makes single notes feel like they are somewhere. */
function roomImpulse(c: AudioContext) {
  const len = Math.floor(c.sampleRate * 2.2), buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
  }
  return buf;
}

export function audio() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.85;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 9000;
    analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.82;
    master.connect(lp).connect(analyser).connect(ctx.destination);
    // reverb send
    send = ctx.createGain();
    send.gain.value = 1;
    const conv = ctx.createConvolver();
    conv.buffer = roomImpulse(ctx);
    const wet = ctx.createGain();
    wet.gain.value = 0.2;
    send.connect(conv).connect(wet).connect(master);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, master: master!, send: send!, analyser: analyser! };
}

/** Fetch the sample files (about 540 KB). Safe to call early and often; it only runs once. No AudioContext needed yet. */
export function prefetchPiano() {
  if (fetching) return fetching;
  fetching = Promise.all(SAMPLES.map(async ([m, name]) => {
    try { const r = await fetch(`/piano/${name}.mp3`); if (r.ok) raw.set(m, await r.arrayBuffer()); } catch { /* the synth voice covers */ }
  })).then(() => undefined);
  return fetching;
}

async function decodeAll() {
  if (decoding) return decoding;
  const { ctx: c } = audio();
  decoding = prefetchPiano().then(async () => {
    await Promise.all([...raw.entries()].map(async ([m, ab]) => {
      try { buffers.set(m, await c.decodeAudioData(ab.slice(0))); } catch { /* skip a bad file */ }
    }));
  });
  return decoding;
}

/** Call on the visitor's first touch of the page: starts the audio engine and decodes the samples, so the first key sounds like a piano. */
export function warmPiano() { audio(); void decodeAll(); }

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

/** The fallback: a triangle plus a quiet octave and twelfth, plucked and left to ring. */
function synth(midi: number, volume: number) {
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

/** One note. Sampled piano when loaded, synth otherwise. A little velocity variation keeps repeated notes alive. */
export function pluck(midi: number, volume = 1) {
  const { ctx: c, master: m, send: s } = audio();
  if (buffers.size === 0) { void decodeAll(); synth(midi, volume); return; }
  let base = 60, best = 99;
  buffers.forEach((_, k) => { const d = Math.abs(midi - k); if (d < best) { best = d; base = k; } });
  const t = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = buffers.get(base)!;
  src.playbackRate.value = 2 ** ((midi - base) / 12);
  const g = c.createGain();
  const vel = volume * (0.82 + Math.random() * 0.22);
  g.gain.setValueAtTime(vel, t);
  g.gain.setValueAtTime(vel, t + 2.4);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 4.2);
  src.connect(g);
  g.connect(m);
  g.connect(s);
  src.start(t);
  src.stop(t + 4.3);
}
