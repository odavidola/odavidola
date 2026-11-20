"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const LINKS = [["moko", "Moko"], ["ebb", "Ebb"], ["work", "Experience"], ["music", "Music"], ["contact", "Contact"]] as const;

/** Stays readable over every section: its colour follows the section beneath, and the current section gets a filled tab. */
export function SiteHeader() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    let raf = 0;
    const tones = [...document.querySelectorAll<HTMLElement>("[data-tone]")].filter((e) => e !== ref.current);
    const sections = LINKS.map(([id]) => [id, document.getElementById(id)] as const);
    const update = () => {
      // Read everything first, then write once: no layout thrash while scrolling.
      const h = ref.current?.offsetHeight ?? 56;
      const probe = h + 6;
      let tone: string | undefined;
      for (const e of tones) { const r = e.getBoundingClientRect(); if (r.top <= probe && r.bottom > probe) tone = e.dataset.tone; }
      const mid = window.innerHeight * 0.4;
      let id = "";
      for (const [sid, e] of sections) { if (!e) continue; const r = e.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) { id = sid; break; } }
      if (ref.current && tone && ref.current.dataset.tone !== tone) ref.current.dataset.tone = tone;
      setActive(id);
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header ref={ref} className="site-header" data-tone="light">
      <Link href="/" className="wordmark" aria-label="David Olagunju, home">David Olagunju</Link>
      <nav aria-label="Primary" className="site-nav">
        {LINKS.map(([id, label]) => (
          <a key={id} href={`#${id}`} data-active={active === id} aria-current={active === id ? "true" : undefined}>{label}</a>
        ))}
      </nav>
    </header>
  );
}
