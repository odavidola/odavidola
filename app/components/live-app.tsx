"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Moko, running for real: a true phone-landscape viewport (844 by 390), scaled to the frame's width.
 * An embedded app captures the mouse wheel and touch drags, which stalls the page and then makes it jump.
 * So the app stays inert until you choose to use it, and lets go the moment you move away or tap elsewhere.
 */
export function LiveApp() {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / 844));
    ro.observe(box.current!);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const away = (e: Event) => { if (!box.current?.contains(e.target as Node)) setActive(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(false); };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", esc); };
  }, [active]);

  return (
    <figure className="device">
      <div className="device-screen">
        <div className="device-view" ref={box} onPointerLeave={(e) => { if (e.pointerType === "mouse") setActive(false); }}>
          <iframe src="https://mokopiano.vercel.app" title="Moko, running live" loading="lazy" allow="autoplay" style={{ transform: `scale(${scale})`, pointerEvents: active ? "auto" : "none" }} tabIndex={active ? 0 : -1} />
          {!active && (
            <button type="button" className="device-gate" onClick={() => setActive(true)}>
              <span>Click to try it</span>
            </button>
          )}
        </div>
      </div>
      <figcaption className="mono">{active ? "Live. Move away or press Esc to keep scrolling." : "Live. This is the real app, not a mock-up."}</figcaption>
    </figure>
  );
}
