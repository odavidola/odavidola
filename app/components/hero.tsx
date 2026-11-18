"use client";
import { useEffect, useRef, useState } from "react";
import { Piano } from "@/app/components/piano";
import { onLevel } from "@/lib/audio-bus";

const PREVIEWS: Record<string, string> = {
  Moko: "Audio ML pipeline. Live.",
  Ebb: "A private life system, on the device.",
  Experience: "Eight years of front-office systems.",
  Music: "ynda. Afloat EP.",
  Contact: "Say hello.",
};

/** The masthead. Its width axis rides on the loudness of whatever the visitor plays. */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const el = root.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return onLevel((lvl) => el.style.setProperty("--lvl", lvl.toFixed(3)));
  }, []);

  return (
    <section ref={root} className="hero" id="top" data-tone="light">
      <div className="mast">
        <h1 aria-label="Senior AI Product Engineer.">
          <span className="m-senior" aria-hidden="true">Senior</span>
          <span className="m-ai" aria-hidden="true">AI</span>
          <span className="m-product" aria-hidden="true">Product</span>
          <span className="m-engineer" aria-hidden="true">Engineer<i>.</i></span>
        </h1>
        <aside className="rail" aria-label="At a glance">
          <p className="rail-live" data-on={!!preview}>{preview ? PREVIEWS[preview] : "Play the keys."}</p>
          <ul>
            <li>London</li>
            <li>8 years, front-office trading systems</li>
            <li>Vice President, Marex</li>
            <li>Builds Moko, Ebb, and music as ynda</li>
          </ul>
        </aside>
      </div>
      <Piano onPreview={setPreview} />
    </section>
  );
}
