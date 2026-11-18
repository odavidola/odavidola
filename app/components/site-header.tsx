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
    const update = () => {
      const el = document.elementFromPoint(window.innerWidth / 2, 22)?.closest<HTMLElement>("[data-tone]");
      if (el && ref.current) ref.current.dataset.tone = el.dataset.tone ?? "light";
      const mid = window.innerHeight * 0.4;
      const current = LINKS.map(([id]) => document.getElementById(id)).find((s) => s && s.getBoundingClientRect().top <= mid && s.getBoundingClientRect().bottom > mid);
      setActive(current?.id ?? "");
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
