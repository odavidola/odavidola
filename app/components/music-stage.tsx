"use client";
import { useEffect, useRef, useState } from "react";

/** The art break. Afloat's painting runs edge to edge; the water ripples where you move. */
export function MusicStage() {
  const wrap = useRef<HTMLElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [player, setPlayer] = useState(false);

  useEffect(() => {
    const c = cv.current!, ctx = c.getContext("2d")!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    type Ring = { x: number; y: number; r: number; a: number };
    const rings: Ring[] = [];
    let raf = 0, last = 0, W = 0, H = 0, running = false;
    const size = () => { const dpr = Math.min(2, devicePixelRatio || 1); W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    const move = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (Math.hypot(x - last, 0) < 0) return;
      if (performance.now() - last > 90) { rings.push({ x, y, r: 4, a: 0.55 }); last = performance.now(); }
    };
    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = rings.length - 1; i >= 0; i--) {
        const g = rings[i];
        g.r += 2.6; g.a *= 0.968;
        if (g.a < 0.02) { rings.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(255,255,255,${g.a})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, 7); ctx.stroke();
        ctx.strokeStyle = `rgba(255,255,255,${g.a * 0.5})`;
        ctx.beginPath(); ctx.arc(g.x, g.y, g.r * 0.62, 0, 7); ctx.stroke();
      }
      raf = running ? requestAnimationFrame(frame) : 0;
    };
    const io = new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running && !raf) raf = requestAnimationFrame(frame); });
    io.observe(c);
    c.addEventListener("pointermove", move);
    addEventListener("resize", size);
    return () => { io.disconnect(); c.removeEventListener("pointermove", move); removeEventListener("resize", size); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section ref={wrap} id="music" className="music" data-tone="dark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="music-art" src="/afloat-large.jpg" alt="Afloat, cover art for the EP by ynda: an oil painting of a swimmer floating in blue water." width={1800} height={1800} loading="lazy" />
      <canvas ref={cv} className="music-water" aria-hidden="true" />
      <div className="music-wall">
        <p className="mono">Elsewhere</p>
        <h2>ynda</h2>
        <p className="wall-title"><i>Afloat</i>, EP, 5 tracks</p>
        <p className="wall-meta">Released 13 November 2026</p>
        <div className="wall-links">
          <a href="https://open.spotify.com/artist/0zNAWv5YaQUE3mNF0f34p8" target="_blank" rel="noopener noreferrer">Spotify</a>
          <a href="https://music.apple.com/gb/album/afloat-ep/6834532038" target="_blank" rel="noopener noreferrer">Apple Music</a>
          <button type="button" onClick={() => setPlayer((v) => !v)} aria-expanded={player}>{player ? "Close player" : "Play here"}</button>
        </div>
        {player && (
          <iframe className="music-embed" title="Afloat on Apple Music" src="https://embed.music.apple.com/gb/album/afloat-ep/6834532038" height="450" allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" />
        )}
      </div>
    </section>
  );
}
