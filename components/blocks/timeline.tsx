"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import type { TimelineContent } from "@aavrit/core";

const ERA_TILE: Record<string, string> = {
  cyan: "#3ef2e4",
  pink: "#ff9ec4",
  yellow: "#ffd200",
  lime: "#ceef32",
  lilac: "#beb0fa",
  orange: "#ff7134",
};

/** Two-era storytelling timeline with a drawing spine (desktop) and simple
 *  stacked reveals (mobile / reduced motion). */
export default function TimelineBlock({
  content,
  anim = "standard",
}: {
  content: TimelineContent;
  anim?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced || anim === "none") return;
      let cleanup: (() => void) | undefined;
      (async () => {
        try {
          const [{ gsap }, { ScrollTrigger }] = await Promise.all([
            import("gsap"),
            import("gsap/ScrollTrigger"),
          ]);
          gsap.registerPlugin(ScrollTrigger);
          const q = gsap.utils.selector(root);
                    const disposers: (() => void)[] = [];

          // spine draw
          const spine = q("[data-spine]")[0] as unknown as SVGPathElement | undefined;
          if (spine) {
            const len = spine.getTotalLength();
            gsap.set(spine, { strokeDasharray: len, strokeDashoffset: len });
            const tw = gsap.to(spine, {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 60%", scrub: 0.6 },
            });
            disposers.push(() => { tw.scrollTrigger?.kill(); tw.kill(); });
            disposers.push(() => tw.scrollTrigger?.kill());
          }
          q("[data-era]").forEach((era) => {
            const tw = gsap.fromTo(
              era,
              { autoAlpha: 0, y: 44 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.75,
                ease: "power3.out",
                scrollTrigger: { trigger: era, start: "top 85%", once: true },
              },
            );
            disposers.push(() => { tw.scrollTrigger?.kill(); tw.kill(); });
            disposers.push(() => tw.scrollTrigger?.kill());
          });
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
    <div ref={root} className="relative flex flex-col gap-14">
      {content.intro ? (
        <p className="mono-label opacity-70" style={{ color: "var(--tone-muted)" }}>
          {content.intro}
        </p>
      ) : null}
      {/* spine (desktop only) */}
      <svg
        className="timeline-draw pointer-events-none absolute left-[calc(50%-1px)] top-0 hidden h-full w-2 md:block"
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ transformOrigin: "top center" }}
      >
        <path data-spine d="M 1 0 V 100" stroke="var(--tone-fg)" strokeWidth="2.5" opacity="0.35" vectorEffect="non-scaling-stroke" fill="none" />
      </svg>

      {content.eras.map((era, i) => {
        const bg = ERA_TILE[era.accent] ?? "#ffd200";
        const left = i % 2 === 0;
        return (
          <div
            key={era.label}
            data-era
            className={`relative md:w-[calc(50%-2.5rem)] ${left ? "md:self-start md:text-right" : "md:self-end"}`}
          >
            <span
              aria-hidden="true"
              className={`absolute top-8 hidden h-4 w-4 rounded-full border-[3px] border-[#111] md:block ${
                left ? "-right-[2.6rem]" : "-left-[2.6rem]"
              }`}
              style={{ background: bg }}
            />
            <article className="sticker-soft flex flex-col gap-4 p-[clamp(1.25rem,2.5vw,2rem)]">
              <div className={`flex flex-wrap items-center gap-3 ${left ? "md:justify-end" : ""}`}>
                <span className="tile h-10 px-3 text-lg" style={{ "--tile-bg": bg, "--tile-shadow": "#111" } as React.CSSProperties}>
                  {era.label}
                </span>
                <h3 className="display text-lg" style={{ color: "var(--tone-fg)" }}>
                  {era.title}
                </h3>
              </div>
              <ul className={`flex flex-col gap-2.5 ${left ? "md:items-end" : ""}`}>
                {era.items.map((item, j) => (
                  <li
                    key={j}
                    className={`flex max-w-[52ch] items-start gap-2.5 text-[0.98rem] leading-snug ${
                      left ? "md:flex-row-reverse md:text-right" : ""
                    }`}
                    style={{ color: "var(--tone-fg)" }}
                  >
                    <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: bg, outline: "2px solid #111" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        );
      })}
    </div>
  );
}
