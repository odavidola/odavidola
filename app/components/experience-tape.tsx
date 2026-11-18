"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TAPE = [
  { when: "2025 — now", co: "Marex", role: "Vice President, Software Developer", n: 188000, fmt: "n", unit: "products, queried server-side", extra: "15 s to under 1 s on 10,000+ rows." },
  { when: "2021 — 2024", co: "JPMorgan Asset Management", role: "Senior Software Engineer", n: 100000, fmt: "n+", unit: "rows, live over WebSocket", extra: "~$850B AUM platform. Regression time down ~40%." },
  { when: "2017 — 2021", co: "BNP Paribas", role: "Frontend Developer, Cortex", n: 12, fmt: "n+", unit: "internal tools on one framework", extra: "Angular to React. Manual regression down ~66%." },
];

const SKILLS = "TypeScript · JavaScript · Python · Swift · C# · SQL · React · Next.js · Node.js · FastAPI · PostgreSQL · PyTorch · Docker · Playwright · AWS Certified Cloud Practitioner";

export function ExperienceTape() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>(".tape-row").forEach((row) => {
        const out = row.querySelector<HTMLElement>(".tape-n b")!;
        const target = Number(row.dataset.n), plus = row.dataset.fmt === "n+";
        const set = (v: number) => { out.textContent = Math.round(v).toLocaleString("en-GB") + (plus && v >= target ? "+" : ""); };
        if (reduce) { set(target); return; }
        set(0);
        gsap.from(row, { opacity: 0, y: 40, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 88%" } });
        const o = { v: 0 };
        ScrollTrigger.create({ trigger: row, start: "top 80%", once: true, onEnter: () => gsap.to(o, { v: target, duration: 1.6, ease: "power2.out", onUpdate: () => set(o.v) }) });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="work" className="work" data-tone="dark">
      <div className="work-head">
        <p className="mono">Track record</p>
        <h2><span>8</span><i>years of production systems</i></h2>
      </div>
      <div className="tape">
        {TAPE.map((r) => (
          <article className={`tape-row${r.co === "Marex" ? " featured" : ""}`} key={r.co} data-n={r.n} data-fmt={r.fmt}>
            <p className="mono tape-when">{r.when}</p>
            <div className="tape-n"><b>{r.n.toLocaleString("en-GB")}</b><span>{r.unit}</span></div>
            <div className="tape-who"><h3>{r.co}</h3><p>{r.role}</p><p className="tape-extra">{r.extra}</p>
              {r.co === "Marex" && (
                <div className="arch" aria-label="Architecture: browser, backend-for-frontend with cache and worker threads, upstream API with no pagination">
                  <span>Browser</span><i aria-hidden="true">↑</i><span>BFF · cache · worker threads</span><i aria-hidden="true">↑</i><span>Upstream API, no pagination</span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
      <p className="work-skills mono">{SKILLS}</p>
    </section>
  );
}
