"use client";
import { useEffect, useRef } from "react";
import { BetaForm } from "./beta-form";

const SCREENS = [
  { src: "/ebb/home.jpg", alt: "Ebb home: a line to notice, the week as a band of colour, and today's entry.", depth: 0.9 },
  { src: "/ebb/life.jpg", alt: "Ebb's life-is-moving view: each day a strip of colour.", depth: 1.5 },
  { src: "/ebb/pursuit.jpg", alt: "Ebb pursuit detail: twelve runs, a weekly heatmap and history.", depth: 0.6 },
  { src: "/ebb/day.jpg", alt: "Ebb day view: decisions kept, focus sessions and a line to remember.", depth: 1.2 },
];

const POINTS = [
  { t: "In your words.", d: "Journal by voice or pen. A line is enough." },
  { t: "Help in the moment.", d: "When a choice is tested, sit with it. One way through, started in a tap." },
  { t: "A slip is not the day.", d: "No streaks, no points. The rest of your choices stay open." },
  { t: "Protected at night.", d: "Apps lock at bedtime. Your morning routine lifts it." },
];

/** Four real screens, layered. They drift apart with the pointer, each at its own depth. */
export function EbbStage() {
  const cluster = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cluster.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(hover: hover)").matches) return;
    const cards = [...el.querySelectorAll<HTMLElement>(".screen")];
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const tick = () => {
      x += (tx - x) * 0.07; y += (ty - y) * 0.07;
      cards.forEach((c) => {
        const d = Number(c.dataset.depth);
        c.style.translate = `${(-x * 26 * d).toFixed(1)}px ${(-y * 20 * d).toFixed(1)}px`;
      });
      raf = requestAnimationFrame(tick);
    };
    el.addEventListener("pointermove", move);
    raf = requestAnimationFrame(tick);
    return () => { el.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section id="ebb" className="ebb" data-tone="light">
      <div className="ebb-head">
        <p className="mono">iOS · Swift · on device</p>
        <h2>A life<br /><em>in progress.</em></h2>
        <p className="ebb-thesis">Intentions into decisions.<br />Decisions into practice.<br />Practice into evidence.</p>
        <p className="ebb-lede">Ebb is a personal system for living well, changing behaviour and enjoying the process of becoming. Journal, focus, and make a few choices a day, then see where your days went. Private, on your device.</p>
      </div>

      <div className="ebb-cluster" ref={cluster}>
        {SCREENS.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={s.src} className={`screen s${i}`} data-depth={s.depth} src={s.src} srcSet={`${s.src.replace(".jpg", "-sm.jpg")} 560w, ${s.src} 1000w`} sizes="(max-width: 700px) 50vw, 28vw" alt={s.alt} width={1000} height={2174} loading="lazy" decoding="async" />
        ))}
      </div>

      <ul className="ebb-points">
        {POINTS.map((p) => (<li key={p.t}><b>{p.t}</b><p>{p.d}</p></li>))}
      </ul>
      <BetaForm />
      <ul className="chips ebb-chips"><li>Swift</li><li>SwiftUI</li><li>SwiftData</li><li>FoundationModels</li><li>Speech</li><li>Vision</li><li>NaturalLanguage</li><li>WidgetKit</li><li>Screen Time</li></ul>
    </section>
  );
}
