"use client";

import { useEffect, useRef, useState } from "react";
import { letterTone } from "./letter-tiles";
import { burstFromElement } from "./confetti";
import StickerGlyph, { type StickerName } from "./sticker-svg";

/**
 * The hero's name as a little flip-card toy: every letter tile hides a
 * sticker doodle on its back. Pure fun, fully keyboard accessible, and the
 * front faces carry the exact same `.tile` styling + `data-tile` hooks the
 * entry animation has always targeted.
 */

const TILE_TONES: Record<string, { bg: string; shadow: string }> = {
  yellow: { bg: "#ffd200", shadow: "#1b3624" },
  cyan: { bg: "#3ef2e4", shadow: "#ff3873" },
  pink: { bg: "#ff9ec4", shadow: "#3ef2e4" },
  lime: { bg: "#ceef32", shadow: "#1b3624" },
  lilac: { bg: "#beb0fa", shadow: "#ffd200" },
  orange: { bg: "#ff7134", shadow: "#1b3624" },
};

const BACKS: StickerName[] = ["star", "bolt", "heart", "flower", "cassette", "cursor", "trophy"];
const BACK_BG = ["#fff1e1", "#3ef2e4", "#ff5055", "#ceef32", "#beb0fa", "#ffd200", "#ff9ec4"];

export default function FlipTiles({
  text,
  tileClassName = "",
}: {
  text: string;
  tileClassName?: string;
}) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [allFound, setAllFound] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const letters = text.split("");
  const celebrated = useRef(false);

  const toggle = (i: number) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  // flip every letter at least once → a tiny celebration (once)
  useEffect(() => {
    const full =
      letters.length > 0 && letters.every((_, i) => flipped.has(i));
    if (full && !celebrated.current) {
      celebrated.current = true;
      setAllFound(true);
      burstFromElement(wrapRef.current?.parentElement ?? null, 30);
    }
  }, [flipped, letters]);

  return (
    <span ref={wrapRef} className="relative inline-flex flex-wrap justify-center gap-[clamp(0.3rem,1.2vw,0.9rem)]" aria-hidden="true">
      {letters.map((letter, i) => {
        const tone = TILE_TONES[letterTone(i)];
        const isFlipped = flipped.has(i);
        return (
          <button
            key={`${letter}-${i}`}
            type="button"
            data-tile={i}
            className={`flip-tile ${isFlipped ? "flipped" : ""} ${tileClassName}`}
            style={{ width: "1.18em", height: "1.12em" }}
            aria-label={letter.trim() ? `flip the letter ${letter}` : "flip the blank tile"}
            aria-pressed={isFlipped}
            onClick={() => toggle(i)}
          >
            <span className="flip-tile-inner">
              <span className="flip-face flip-front h-full w-full">
                <span
                  className="tile text-[1em]"
                  style={{ "--tile-bg": tone.bg, "--tile-shadow": tone.shadow } as React.CSSProperties}
                >
                  {letter}
                </span>
              </span>
              <span
                className="flip-face flip-back grid h-full w-full place-items-center rounded-[0.18em] border-[0.045em] border-[#111]"
                style={{ background: BACK_BG[i % BACK_BG.length], boxShadow: "0.14em 0.14em 0 #111" }}
              >
                <StickerGlyph name={BACKS[i % BACKS.length]} size={30} className="h-[0.55em] w-[0.55em]" />
              </span>
            </span>
          </button>
        );
      })}
      {allFound ? (
        <span
          className="quest-pop pill voice-marker absolute -bottom-[1.9em] left-1/2 -translate-x-1/2 whitespace-nowrap border-[2px] border-[#111] text-[0.5em]"
          style={{ background: "#ffd200", color: "#111" }}
        >
          you flipped my whole name ★
        </span>
      ) : null}
    </span>
  );
}
