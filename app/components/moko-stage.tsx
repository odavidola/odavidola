"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LiveApp } from "@/app/components/live-app";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { n: "01", t: "Isolate", d: "Pull the piano out of the full mix." },
  { n: "02", t: "Vote", d: "Two models disagree. The audio decides." },
  { n: "03", t: "Teach", d: "Chords, two hands, a key you can reach. Then the real app: try it." },
];

/** Deterministic pseudo-random so the picture is the same every visit. */
function rng(seed: number) { return () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296; }
type Note = { t: number; d: number; pitch: number; a: boolean; b: boolean; c?: number };
function makeNotes(): Note[] {
  const r = rng(7), out: Note[] = [];
  let pitch = 64;
  for (let i = 0; i < 40; i++) {
    pitch = Math.max(46, Math.min(82, pitch + Math.round((r() - 0.5) * 9)));
    out.push({ t: 0.04 + (i / 40) * 0.9 + r() * 0.01, d: 0.018 + r() * 0.03, pitch, a: true, b: true, c: i % 5 === 2 ? (i % 2 ? 2 : -3) : undefined });
  }
  // a left-hand bass line: long, low notes
  for (let i = 0; i < 13; i++) out.push({ t: 0.03 + (i / 13) * 0.92, d: 0.045 + r() * 0.02, pitch: 38 + Math.round(r() * 14), a: true, b: true });
  for (let i = 0; i < 7; i++) out.push({ t: 0.05 + r() * 0.88, d: 0.02 + r() * 0.02, pitch: 50 + Math.round(r() * 32), a: i % 2 === 0, b: i % 2 === 1 });
  return out;
}
const NOTES = makeNotes();
const ease = (x: number) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function draw(c: HTMLCanvasElement, p: number) {
  const ctx = c.getContext("2d")!;
  const W = c.clientWidth, H = c.clientHeight, dpr = Math.min(2, devicePixelRatio || 1);
  if (c.width !== Math.round(W * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const t1 = ease((p - 0.18) / 0.2), t2 = ease((p - 0.56) / 0.2), t3 = Math.max(0, Math.min(1, (p - 0.8) / 0.2));
  const chalk = "#f9f9f6", ink = "#101114", orange = "#f05a3c";

  // 01 the full mix: a waveform that dissolves as the notes arrive.
  if (t1 < 1) {
    const n = 150, mid = H * 0.5;
    ctx.fillStyle = chalk;
    const r = rng(3);
    for (let i = 0; i < n; i++) {
      const env = 0.35 + 0.65 * Math.abs(Math.sin(i * 0.11) * Math.cos(i * 0.037 + 1));
      const h = (0.08 + r() * 0.9) * env * H * 0.34 * (1 - t1);
      ctx.globalAlpha = 1 - t1;
      ctx.fillRect(lerp(8, 8, 0) + (i / n) * (W - 16), mid - h / 2, Math.max(2, (W - 16) / n - 3), Math.max(2, h));
    }
    ctx.globalAlpha = 1;
  }

  // 02 two transcribers, then the vote. 03 the survivors become a two-hand lesson.
  if (t1 > 0) {
    const pad = 18, laneH = (H - pad * 3) / 2;
    const pmin = 36, pmax = 82, noteH = 8;
    NOTES.forEach((n, i) => {
      const x = pad + n.t * (W - pad * 2), w = Math.max(5, n.d * (W - pad * 2));
      const py = (lane: number, roll: boolean, off = 0) => {
        const f = 1 - (n.pitch + off - pmin) / (pmax - pmin);
        return roll ? pad + f * (H - pad * 2 - noteH) : pad + lane * (laneH + pad) + f * (laneH - noteH);
      };
      const agreed = n.a && n.b;
      const draws: { y: number; show: number; lane: number }[] = [];
      if (n.a) draws.push({ y: lerp(py(0, false), py(0, true), t2), show: 1, lane: 0 });
      if (n.b && !(agreed && t2 > 0.98)) draws.push({ y: lerp(py(1, false, n.c ?? 0), py(0, true), t2), show: agreed ? 1 - t2 : 1, lane: 1 });
      draws.forEach((d) => {
        const ghost = !agreed;
        const alpha = t1 * (ghost ? 1 - t2 : agreed && d.lane === 1 ? d.show : 1);
        if (alpha <= 0.01) return;
        const right = n.pitch >= 60;
        ctx.globalAlpha = alpha;
        const disputed = !!n.c && d.lane === 1 && t2 < 0.6;
        ctx.fillStyle = ghost || disputed ? orange : t2 > 0.5 ? (right ? chalk : ink) : chalk;
        const rise = (1 - t1) * 30 * (((i * 37) % 7) / 7 - 0.5);
        ctx.fillRect(x, d.y + rise, w, noteH);
      });
    });
    ctx.globalAlpha = 1;
    // lane labels, then the vote mark
    ctx.font = "500 11px ui-monospace, monospace";
    ctx.fillStyle = chalk;
    ctx.globalAlpha = t1 * (1 - t2);
    ctx.fillText("MODEL A", pad, pad - 6 + 2);
    ctx.fillText("MODEL B", pad, pad * 2 + laneH - 4);
    ctx.globalAlpha = t2 * (1 - t3 * 0.0);
    ctx.fillText("RIGHT HAND", pad, pad - 4);
    ctx.fillStyle = ink;
    ctx.fillText("LEFT HAND", pad, H - 6);
    ctx.globalAlpha = 1;
  }
  // playhead
  if (t3 > 0) {
    const x = 18 + t3 * (W - 36);
    ctx.fillStyle = orange;
    ctx.fillRect(x, 10, 2, H - 20);
  }
}

const METRICS = [
  { k: "Note precision", v: 80 },
  { k: "Note recall", v: 71 },
  { k: "Hand accuracy", v: 77 },
];

export function MokoStage() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = root.current!, cv = canvas.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const steps = [...el.querySelectorAll<HTMLElement>(".moko-step")];
    const right = el.querySelector<HTMLElement>(".moko-right")!;
    const paint = (p: number) => {
      draw(cv, Math.min(1, p / 0.7));
      // the pipeline's last frame hands over to the real app
      const reveal = ease((p - 0.76) / 0.12);
      right.style.setProperty("--reveal", reveal.toFixed(3));
      right.dataset.live = reveal > 0.6 ? "true" : "false";
      const idx = p < 0.27 ? 0 : p < 0.52 ? 1 : 2;
      steps.forEach((s, i) => s.classList.toggle("on", i === idx));
    };
    const ctx = gsap.context(() => {
      if (reduce) { paint(1); steps.forEach((s) => s.classList.add("on")); return; }
      paint(0);
      // Pinning is plain CSS (position: sticky inside a tall track), so the layout never shifts after load
      // and deep links like /#ebb land exactly. GSAP only reports how far through the track we are.
      ScrollTrigger.create({
        trigger: ".moko-track", start: "top top", end: "bottom bottom", scrub: 0.4,
        onUpdate: (self) => paint(self.progress),
      });
      el.querySelectorAll<HTMLElement>(".metric").forEach((m) => {
        const target = Number(m.dataset.v), out = m.querySelector("b")!;
        const o = { v: 0 };
        ScrollTrigger.create({ trigger: m, start: "top 85%", once: true, onEnter: () => gsap.to(o, { v: target, duration: 1.4, ease: "power3.out", onUpdate: () => { out.textContent = String(Math.round(o.v)); } }) });
      });
    }, el);
    const onResize = () => paint(reduce ? 1 : ScrollTrigger.getAll().find((s) => s.trigger === el.querySelector(".moko-track"))?.progress ?? 0);
    addEventListener("resize", onResize);
    return () => { removeEventListener("resize", onResize); ctx.revert(); };
  }, []);

  return (
    <section ref={root} id="moko" className="moko" data-tone="dark">
      <div className="moko-track">
      <div className="moko-pin">
        <div className="moko-copy">
          <p className="mono">Applied AI · live</p>
          <h2>Moko</h2>
          <p className="moko-lede">Turn any song into a lesson. Play it back; Moko listens.</p>
          <ol className="moko-steps">
            {STEPS.map((s) => (
              <li key={s.n} className="moko-step"><span className="mono">{s.n}</span><div><b>{s.t}</b><p>{s.d}</p></div></li>
            ))}
          </ol>
          <a className="big-link moko-open" href="https://mokopiano.vercel.app" target="_blank" rel="noopener noreferrer">Open the full app</a>
        </div>
        <div className="moko-right">
          <canvas ref={canvas} className="moko-canvas" role="img" aria-label="Animation: an audio waveform becomes two models' note transcriptions, which are voted down to a two-hand piano lesson." />
          <div className="moko-live-stage"><LiveApp /></div>
        </div>
      </div>
      </div>

      <div className="moko-after">
        <div className="metrics" aria-label="Evaluation results">
          {METRICS.map((m) => (
            <div className="metric" key={m.k} data-v={m.v}><span><b>{m.v}</b>%</span><p className="mono">{m.k}</p></div>
          ))}
          <p className="metrics-note">Measured on an 18-song test set. Precision first: fewer notes, all right.</p>
        </div>
        <ul className="chips"><li>Next.js</li><li>TypeScript</li><li>Web Audio</li><li>Python</li><li>FastAPI</li><li>PyTorch</li><li>librosa</li></ul>
      </div>
    </section>
  );
}
