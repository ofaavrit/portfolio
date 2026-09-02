"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import type { StatsContent } from "@aavrit/core";

const TILES: Record<string, { bg: string; shadow: string; rot: string }> = {
  yellow: { bg: "#ffd200", shadow: "#1b3624", rot: "-1.5deg" },
  cyan: { bg: "#3ef2e4", shadow: "#ff3873", rot: "1deg" },
  pink: { bg: "#ff9ec4", shadow: "#3ef2e4", rot: "-1deg" },
  lime: { bg: "#ceef32", shadow: "#1b3624", rot: "1.5deg" },
  lilac: { bg: "#beb0fa", shadow: "#ffd200", rot: "-1deg" },
  orange: { bg: "#ff7134", shadow: "#1b3624", rot: "1deg" },
};

/** Stat cards — sticker collage with slight rotations. Purely numeric values
 *  (like 100+) count up when scrolled into view. */
export default function StatsBlock({
  content,
  heading = "h2",
  anim = "standard",
}: {
  content: StatsContent;
  heading?: "h1" | "h2";
  anim?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const H = heading;

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
          const disposers: (() => void)[] = [];
          q("[data-stat-card]").forEach((card, i) => {
            const tw = gsap.fromTo(
              card,
              { autoAlpha: 0, y: 40, rotation: i % 2 ? 4 : -4 },
              {
                autoAlpha: 1,
                y: 0,
                rotation: 0,
                duration: 0.7,
                delay: i * 0.08,
                ease: "back.out(1.6)",
                scrollTrigger: { trigger: card, start: "top 88%", once: true },
              },
            );
            disposers.push(() => { tw.scrollTrigger?.kill(); tw.kill(); });
          });
          // count-up for numeric values
          q("[data-count]").forEach((node) => {
            const el2 = node as HTMLElement;
            const target = Number(el2.dataset.count ?? "0");
            if (!Number.isFinite(target) || target === 0) return;
            const suffix = el2.dataset.suffix ?? "";
            const obj = { v: 0 };
            const tw = gsap.to(obj, {
              v: target,
              duration: 1.4,
              ease: "power2.out",
              scrollTrigger: { trigger: el2, start: "top 88%", once: true },
              onUpdate: () => {
                el2.textContent = `${Math.round(obj.v)}${suffix}`;
              },
            });
            disposers.push(() => { tw.scrollTrigger?.kill(); tw.kill(); });
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
    <div ref={root} className="flex flex-col gap-8">
      {content.title ? (
        <H className="display display-lg" style={{ color: "var(--tone-fg)" }}>
          {content.title}
        </H>
      ) : null}
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {content.items.map((item, i) => {
          const tile = TILES[item.accent ?? "yellow"] ?? TILES.yellow;
          const numeric = item.value.match(/^(\d+)\s*(\+)?$/);
          return (
            <li key={i} data-stat-card>
              <div
                className="sticker flex h-full flex-col gap-2.5 p-[clamp(1.1rem,2vw,1.6rem)] transition-transform duration-200 hover:-translate-y-1.5"
                style={{ background: tile.bg, transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}
              >
                {numeric ? (
                  <p className="display text-[clamp(2.4rem,5vw,3.4rem)] leading-none" style={{ color: "#111" }}>
                    <span data-count={numeric[1]} data-suffix={numeric[2] ? "+" : ""}>
                      {item.value}
                    </span>
                  </p>
                ) : (
                  <p className="display text-[clamp(1.8rem,3.5vw,2.5rem)] leading-none break-words" style={{ color: "#111" }}>
                    {item.value}
                  </p>
                )}
                <p className="text-[0.95rem] font-semibold leading-snug" style={{ color: "#111" }}>
                  {item.label}
                </p>
                {item.note ? (
                  <p className="font-hand text-lg leading-tight opacity-80" style={{ color: "#111" }}>
                    {item.note}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
