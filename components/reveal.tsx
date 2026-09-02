"use client";

import { useRef, type ReactNode, type ElementType } from "react";
import { useGSAP } from "@gsap/react";

/**
 * Scroll-into-view reveal. Content is fully visible by default — GSAP applies
 * the "from" state only when JS + GSAP are running, so nothing is ever hidden
 * if scripts fail. Reduced-motion users get no animation at all.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  style,
  y = 36,
  delay = 0,
  intensity = "standard",
  once = true,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  y?: number;
  delay?: number;
  intensity?: "none" | "subtle" | "standard" | "full";
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced || intensity === "none") return;
      let cleanup: (() => void) | undefined;
      (async () => {
        try {
          const [{ gsap }, { ScrollTrigger }] = await Promise.all([
            import("gsap"),
            import("gsap/ScrollTrigger"),
          ]);
          gsap.registerPlugin(ScrollTrigger);
          const distance = intensity === "subtle" ? y * 0.5 : intensity === "full" ? y * 1.4 : y;
          const tween = gsap.fromTo(
            el,
            { autoAlpha: 0, y: distance },
            {
              autoAlpha: 1,
              y: 0,
              duration: intensity === "full" ? 1.05 : 0.8,
              delay,
              ease: "power3.out",
              scrollTrigger: once
                ? { trigger: el, start: "top 88%", once: true }
                : { trigger: el, start: "top 88%" },
            },
          );
          cleanup = () => {
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        } catch {
          /* gsap failed → element stays visible */
        }
      })();
      return () => cleanup?.();
    },
    { scope: ref, dependencies: [intensity, delay, y, once] },
  );

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
