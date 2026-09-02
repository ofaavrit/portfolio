"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import type { ColoredSectionContent } from "@aavrit/core";

function Doodle({ kind }: { kind: NonNullable<ColoredSectionContent["doodle"]> }) {
  const stroke = "var(--tone-fg)";
  switch (kind) {
    case "star":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          <path d="M50 6 L60 38 L94 38 L67 58 L77 92 L50 71 L23 92 L33 58 L6 38 L40 38 Z" fill="none" stroke={stroke} strokeWidth="5" strokeLinejoin="round" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          <path d="M50 4 V40 M50 60 V96 M4 50 H40 M60 50 H96" stroke={stroke} strokeWidth="7" strokeLinecap="round" />
          <path d="M18 18 L34 34 M66 66 L82 82 M82 18 L66 34 M34 66 L18 82" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "ring":
      return (
        <div className="neon-ring h-full w-full" style={{ animation: "spin-slow 24s linear infinite" }} aria-hidden="true" />
      );
    case "squiggle":
      return (
        <svg viewBox="0 0 200 40" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
          <path d="M4 20 Q 24 4 44 20 T 84 20 T 124 20 T 164 20 T 196 20" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case "grid":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          {[20, 40, 60, 80].map((p) => (
            <g key={p} stroke={stroke} strokeWidth="3" opacity="0.7">
              <line x1={p} y1="8" x2={p} y2="92" />
              <line x1="8" y1={p} x2="92" y2={p} />
            </g>
          ))}
        </svg>
      );
  }
}

/** A loud color moment: giant word, doodle, optional copy. On navy it becomes
 *  the glowing ARCT-style statement. */
export default function ColoredSectionBlock({
  content,
  anim = "standard",
}: {
  content: ColoredSectionContent;
  anim?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const navy = content.tone === "navy";

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced || anim === "none") return;
      let cleanup: (() => void) | undefined;
      (async () => {
        try {
          const { gsap } = await import("gsap");
          const q = gsap.utils.selector(root);
          const parallax = q("[data-doodle]")[0];
          const disposers: (() => void)[] = [];
          if (parallax && window.matchMedia("(min-width: 768px)").matches) {
            const tw = gsap.to(parallax, {
              yPercent: -18,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 },
            });
            disposers.push(() => { tw.scrollTrigger?.kill(); tw.kill(); });
          }
          const word = q("[data-word]")[0];
          if (word) {
            const tw = gsap.fromTo(
              word,
              { autoAlpha: 0, scale: 0.92, letterSpacing: "0.2em" },
              {
                autoAlpha: 1,
                scale: 1,
                letterSpacing: "-0.01em",
                duration: 1.0,
                ease: "power4.out",
                scrollTrigger: { trigger: el, start: "top 80%", once: true },
              },
            );
            disposers.push(() => { tw.scrollTrigger?.kill(); tw.kill(); });
          }
          cleanup = () => disposers.forEach((d) => d());
        } catch {
          /* stay visible */
        }
      })();
      return () => cleanup?.();
    },
    { scope: root, dependencies: [anim] },
  );

  return (
    <div ref={root} className="container-x relative flex flex-col items-center gap-6 py-[clamp(2rem,6vw,4.5rem)] text-center">
      {content.doodle ? (
        <div
          data-doodle
          className={`pointer-events-none absolute opacity-25 ${navy ? "opacity-40" : ""} ${
            content.doodle === "squiggle"
              ? "left-[8%] top-[10%] h-8 w-40"
              : content.doodle === "ring"
                ? "-right-10 top-1/2 h-56 w-56 -translate-y-1/2 md:h-72 md:w-72"
                : "left-[6%] bottom-[8%] h-16 w-16"
          }`}
        >
          <Doodle kind={content.doodle} />
        </div>
      ) : null}
      {content.word ? (
        <p
          data-word
          className={`display ${navy ? "glitch" : ""} max-w-[16ch] text-[clamp(2.6rem,9vw,7rem)] leading-[0.95]`}
          data-text={content.word}
          style={{ color: navy ? "#fff1e1" : "var(--tone-fg)" }}
        >
          {content.word}
        </p>
      ) : null}
      {content.title ? (
        <p className="mono-label" style={{ color: navy ? "var(--gold)" : "var(--tone-muted)" }}>
          {content.title}
        </p>
      ) : null}
      {content.body ? (
        <p className="max-w-[48ch] text-[var(--text-md)]" style={{ color: "var(--tone-fg)", opacity: 0.9 }}>
          {content.body}
        </p>
      ) : null}
    </div>
  );
}
