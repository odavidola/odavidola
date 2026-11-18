"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { audio, pluck, prefetchPiano, warmPiano } from "@/lib/audio-bus";

/**
 * The site's front door: a playable piano. Every key sounds (Web Audio, no samples); five of them are
 * coloured and open a section of the page. It is an enhancement only: every section is ordinary
 * HTML reachable from the header, and nothing here is needed to read the page.
 *
 * "Listen" uses the microphone to hear a note you play or hum and lights the matching key.
 * Audio never leaves the browser.
 */

const FIRST = 60; // C4
const WHITE_PCS = [0, 2, 4, 5, 7, 9, 11];
const BLACK_AFTER = new Set([0, 1, 3, 4, 5]); // a black key follows C, D, F, G, A
const NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

type Named = { id: string; label: string; color: string };
const NAMED: Record<number, Named> = {
  60: { id: "moko", label: "Moko", color: "var(--blue)" },
  64: { id: "ebb", label: "Ebb", color: "var(--green)" },
  67: { id: "work", label: "Experience", color: "var(--ink)" },
  71: { id: "music", label: "Music", color: "var(--coral)" },
  72: { id: "contact", label: "Contact", color: "var(--sun)" },
};

/** Computer-keyboard layout: A W S E D F T G Y H U J K O L P ; */
const KEYMAP: Record<string, number> = { a: 60, w: 61, s: 62, e: 63, d: 64, f: 65, t: 66, g: 67, y: 68, h: 69, u: 70, j: 71, k: 72, o: 73, l: 74, p: 75, ";": 76 };

const noteName = (m: number) => `${NAMES[m % 12]}${Math.floor(m / 12) - 1}`;

type Key = { midi: number; white: boolean; index: number };
function buildKeys(whites: number): Key[] {
  const keys: Key[] = [];
  for (let w = 0; w < whites; w++) {
    const oct = Math.floor(w / 7), deg = w % 7;
    const midi = FIRST + oct * 12 + WHITE_PCS[deg];
    keys.push({ midi, white: true, index: w });
    if (BLACK_AFTER.has(deg) && w < whites - 1) keys.push({ midi: midi + 1, white: false, index: w });
  }
  return keys;
}

export function Piano({ onPreview }: { onPreview?: (label: string | null) => void }) {
  const [down, setDown] = useState<Set<number>>(new Set());
  const [heard, setHeard] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const [hint, setHint] = useState(true);
  const preview = (m: number | null) => onPreview?.(m !== null && NAMED[m] ? NAMED[m].label : null);
  const stopMic = useRef<(() => void) | null>(null);
  const keys = buildKeys(14);

  const sound = useCallback((midi: number) => pluck(midi), []);

  const open = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }, []);

  const press = useCallback((midi: number) => {
    sound(midi);
    setHint(false);
    setDown((s) => new Set(s).add(midi));
    window.setTimeout(() => setDown((s) => { const n = new Set(s); n.delete(midi); return n; }), 180);
    const named = NAMED[midi];
    if (named) window.setTimeout(() => open(named.id), 260);
  }, [sound, open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [contenteditable]")) return;
      const midi = KEYMAP[e.key.toLowerCase()];
      if (midi !== undefined) press(midi);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [press]);

  useEffect(() => {
    // Warm the samples once the page has settled, so the first key already sounds like a piano.
    const t = window.setTimeout(() => void prefetchPiano(), 1200);
    const first = () => { warmPiano(); (["pointerdown", "keydown", "touchstart"] as const).forEach((e) => removeEventListener(e, first)); };
    (["pointerdown", "keydown", "touchstart"] as const).forEach((e) => addEventListener(e, first, { passive: true }));
    return () => { window.clearTimeout(t); (["pointerdown", "keydown", "touchstart"] as const).forEach((e) => removeEventListener(e, first)); stopMic.current?.(); };
  }, []);

  /** Hear one note at a time: autocorrelation on the microphone signal. */
  const listen = async () => {
    if (listening) { stopMic.current?.(); return; }
    try {
      const { ctx: c } = audio();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      const src = c.createMediaStreamSource(stream);
      const an = c.createAnalyser();
      an.fftSize = 2048;
      src.connect(an);
      const buf = new Float32Array(an.fftSize);
      let raf = 0, last = -1, stable = 0;
      const tick = () => {
        an.getFloatTimeDomainData(buf);
        let rms = 0;
        for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
        rms = Math.sqrt(rms / buf.length);
        let midi: number | null = null;
        if (rms > 0.015) {
          const minLag = Math.floor(c.sampleRate / 1100), maxLag = Math.floor(c.sampleRate / 100);
          let best = 0, bestLag = -1;
          for (let lag = minLag; lag < maxLag; lag++) {
            let sum = 0;
            for (let i = 0; i < buf.length - lag; i += 2) sum += buf[i] * buf[i + lag];
            if (sum > best) { best = sum; bestLag = lag; }
          }
          if (bestLag > 0) midi = Math.round(69 + 12 * Math.log2(c.sampleRate / bestLag / 440));
        }
        if (midi !== null && midi === last) stable++; else { stable = 0; last = midi ?? -1; }
        if (midi !== null && stable >= 2) setHeard(midi); else if (midi === null) setHeard(null);
        raf = requestAnimationFrame(tick);
      };
      tick();
      setListening(true);
      setHint(false);
      stopMic.current = () => {
        cancelAnimationFrame(raf);
        stream.getTracks().forEach((t) => t.stop());
        src.disconnect();
        setListening(false); setHeard(null); stopMic.current = null;
      };
    } catch {
      setListening(false);
    }
  };

  const lit = (midi: number) => down.has(midi) || heard === midi;
  const whiteCount = 14;

  return (
    <div className="piano-wrap">
      <div className="piano-bar">
        <p className="piano-hint" data-hidden={!hint}>
          <span className="blink" aria-hidden="true" /> Play it. The coloured keys open the work.
        </p>
        <button type="button" className="listen" data-on={listening} onClick={listen} aria-pressed={listening}>
          <span className="rec" aria-hidden="true" />
          {listening ? (heard !== null ? `Heard ${noteName(heard)}` : "Listening…") : "Listen: play a note"}
        </button>
      </div>
      <div className="piano" role="group" aria-label="Piano. The coloured keys jump to sections of this page." style={{ ["--whites" as string]: whiteCount }}>
        <div className="whites">
          {keys.filter((k) => k.white).map((k) => {
            const named = NAMED[k.midi];
            return (
              <button
                key={k.midi}
                type="button"
                className="key white"
                data-on={lit(k.midi)}
                data-named={!!named}
                data-mobile-hide={k.index >= 8}
                style={{ ["--c" as string]: named?.color }}
                onPointerEnter={() => preview(k.midi)}
                onPointerLeave={() => preview(null)}
                onFocus={() => preview(k.midi)}
                onBlur={() => preview(null)}
                onPointerDown={(e) => { e.preventDefault(); press(k.midi); }}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); press(k.midi); } }}
                aria-label={named ? `${noteName(k.midi)}: open ${named.label}` : noteName(k.midi)}
              >
                {named && <span className="tag">{named.label}</span>}
              </button>
            );
          })}
        </div>
        {keys.filter((k) => !k.white).map((k) => (
          <button
            key={k.midi}
            type="button"
            className="key black"
            data-on={lit(k.midi)}
            data-mobile-hide={k.index >= 7}
            style={{ ["--i" as string]: k.index }}
            onPointerDown={(e) => { e.preventDefault(); press(k.midi); }}
            aria-label={noteName(k.midi)}
            tabIndex={-1}
          />
        ))}
      </div>
    </div>
  );
}
