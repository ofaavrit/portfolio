"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ArrowDown, Send } from "lucide-react";
import FlipTiles from "@/components/flip-tiles";
import MagneticButton from "@/components/magnetic-button";
import type { HeroContent } from "@aavrit/core";

/**
 * Home hero: oversized letter-tile wordmark, masked line reveals, CTAs.
 * Reveal runs on mount; when the entry gate is playing, it waits for the
 * "aavrit:entered" event so the hero lands as the construction overlay lifts.
 */
export default function HeroBlock({
  content,
  anim = "standard",
}: {
  content: HeroContent;
  anim?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced || anim === "none") return;

      let cleanupFn: (() => void) | undefined;
      let started = false;

      (async () => {
        try {
          const { gsap } = await import("gsap");
          let already = false;
          try {
            already = sessionStorage.getItem("aavrit:entered") === "1";
          } catch {
            /* ignore */
          }
          const run = () => {
            if (started || !root.current) return;
            started = true;
            const q = gsap.utils.selector(root);
            const short = window.matchMedia("(max-width: 767px)").matches;
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.fromTo(
              q("[data-hero-tiles] [data-tile]"),
              { yPercent: 120, rotation: (i: number) => (i % 2 ? 10 : -8), autoAlpha: 0 },
              {
                yPercent: 0,
                rotation: 0,
                autoAlpha: 1,
                duration: short ? 0.5 : 0.8,
                stagger: { each: 0.06, from: "start" },
                ease: "back.out(1.5)",
              },
            )
              .fromTo(
                q("[data-hero-kicker]"),
                { autoAlpha: 0, y: 12 },
                { autoAlpha: 1, y: 0, duration: 0.4 },
                "-=0.5",
              )
              .fromTo(
                q("[data-hero-line]"),
                { yPercent: 110 },
                { yPercent: 0, duration: 0.55, stagger: 0.09, ease: "power4.out" },
                "-=0.35",
              )
              .fromTo(
                q("[data-hero-meta], [data-hero-note]"),
                { autoAlpha: 0 },
                { autoAlpha: 1, duration: 0.5, stagger: 0.1 },
                "-=0.2",
              )
              .fromTo(
                q("[data-hero-cta]"),
                { autoAlpha: 0, y: 16 },
                { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08 },
                "-=0.3",
              );
          };

          if (already) {
            run();
            return;
          }
          const onReveal = () => run();
          const onEntered = () => run();
          window.addEventListener("aavrit:reveal", onReveal, { once: true });
          window.addEventListener("aavrit:entered", onEntered, { once: true });
          const fallback = setTimeout(run, 3400); // never leave the hero hidden
          cleanupFn = () => {
            clearTimeout(fallback);
            window.removeEventListener("aavrit:reveal", onReveal);
            window.removeEventListener("aavrit:entered", onEntered);
          };
        } catch {
          /* gsap failed → CSS keeps everything visible */
        }
      })();

      return () => cleanupFn?.();
    },
    { scope: root, dependencies: [anim] },
  );

  return (
    <div ref={root} className="hero-immersive flex flex-col items-center justify-center gap-[clamp(1.2rem,3vw,2rem)] py-[clamp(4.5rem,10vh,7rem)] text-center">
      {content.kicker ? (
        <p data-hero-kicker className="pill" style={{ background: "#fff6ec" }}>
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#ff3873" }} aria-hidden="true" />
          {content.kicker}
        </p>
      ) : null}

      <h1 className="display leading-[0.9]" style={{ fontSize: "var(--text-mega)" }}>
        <span data-hero-tiles className="inline-flex flex-wrap justify-center gap-[clamp(0.3rem,1.2vw,0.9rem)]">
          <FlipTiles text={content.titleLines.join(" ")} tileClassName="text-[1em]" />
        </span>
        <span className="sr-only">{content.titleLines.join(" ")}</span>
      </h1>
      <p aria-hidden="true" className="tap-note voice-hand -mt-[clamp(0.4rem,1.5vw,1rem)] text-[clamp(1.05rem,2vw,1.4rem)] opacity-70 rotate-[-2deg]" style={{ color: "var(--foreground)" }}>
        psst — tap the letters ⇄
      </p>

      {content.subtitle ? (
        <p className="max-w-[52ch] font-hand text-[clamp(1.5rem,3.4vw,2.3rem)] leading-tight" data-hero-line style={{ overflow: "hidden" }}>
          {content.subtitle}
        </p>
      ) : null}

      {content.meta ? (
        <p data-hero-meta className="mono-label opacity-70">
          {content.meta}
        </p>
      ) : null}

      <div className="mt-2 flex flex-wrap items-center justify-center gap-4" data-hero-cta>
        <MagneticButton>
          <Link href="/about" className="btn">
            Start the story <ArrowDown size={17} aria-hidden="true" />
          </Link>
        </MagneticButton>
        <MagneticButton>
          <Link href="/contact" className="btn btn-ghost">
            Say hi <Send size={16} aria-hidden="true" />
          </Link>
        </MagneticButton>
      </div>

      {content.note ? (
        <p data-hero-note className="hand-note opacity-80" aria-hidden="true">
          {content.note}
        </p>
      ) : null}
    </div>
  );
}
