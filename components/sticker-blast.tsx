"use client";

import { useCallback, useRef } from "react";
import StickerGlyph, { STICKER_NAMES } from "./sticker-svg";
import { burstConfetti } from "./confetti";

/**
 * STICKER BLAST — a tiny toy for the footer: press the big red button and a
 * handful of the deck's stickers rains over the page. No state, no purpose,
 * pure joy. Reduced motion → nothing spawns (the button still clicks).
 */
export default function StickerBlast() {
  const layerRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);

  const blast = useCallback(() => {
    if (busyRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const layer = layerRef.current;
    if (!layer || reduced) return;
    busyRef.current = true;

    const count = 14;
    const parts: HTMLElement[] = [];
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "confetti-bit";
      el.style.left = `${8 + Math.random() * 84}vw`;
      el.style.top = `${-8 - Math.random() * 18}vh`;
      el.style.width = "38px";
      el.style.height = "38px";
      const name = STICKER_NAMES[Math.floor(Math.random() * STICKER_NAMES.length)];
      el.innerHTML = new XMLSerializer().serializeToString(
        // inline sticker SVGs cloned from a hidden template layer
        (layer.querySelector(`[data-blast-template="${name}"]`) as HTMLElement)?.firstElementChild as SVGElement
      );
      el.style.setProperty("--dx", `${(Math.random() - 0.5) * 240}px`);
      el.style.setProperty("--dy", `${105 + Math.random() * 30}vh`);
      el.style.setProperty("--rot", `${(Math.random() < 0.5 ? -1 : 1) * (300 + Math.random() * 500)}deg`);
      el.style.setProperty("--dur", `${(1.5 + Math.random() * 1.2).toFixed(2)}s`);
      el.style.background = "transparent";
      document.body.appendChild(el);
      parts.push(el);
    }
    burstConfetti(window.innerWidth / 2, window.innerHeight * 0.3, 18);
    window.setTimeout(() => {
      parts.forEach((p) => p.remove());
      busyRef.current = false;
    }, 3000);
  }, []);

  return (
    <>
      {/* templates for cloning (never visible) */}
      <div ref={layerRef} aria-hidden="true" className="pointer-events-none fixed -left-[9999px] top-0">
        {STICKER_NAMES.map((n) => (
          <span key={n} data-blast-template={n}>
            <StickerGlyph name={n} size={38} />
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={blast}
        className="group mono-label inline-flex items-center gap-2 rounded-full border-[2.5px] border-[#111] px-5 py-2.5 transition-transform active:scale-95"
        style={{ background: "#ff5055", color: "#111", boxShadow: "3px 4px 0 rgba(17,17,17,0.8)" }}
        aria-label="Sticker blast — rain stickers over the page (just for fun)"
      >
        <span aria-hidden="true" className="inline-block transition-transform group-hover:rotate-[18deg]">
          <StickerGlyph name="star" size={18} />
        </span>
        STICKER BLAST
        <span aria-hidden="true">✸</span>
      </button>
    </>
  );
}
