"use client";

import { useEffect, useRef } from "react";

/** Reading-progress bar driven by ScrollTrigger. Hidden for reduced motion. */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let cleanup: (() => void) | undefined;
    (async () => {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        gsap.registerPlugin(ScrollTrigger);
        const st = ScrollTrigger.create({
          start: 0,
          end: () => document.documentElement.scrollHeight - window.innerHeight,
          onUpdate: (self) => {
            if (ref.current) ref.current.style.transform = `scaleX(${self.progress})`;
          },
        });
        cleanup = () => st.kill();
      } catch {
        /* no bar if gsap fails */
      }
    })();
    return () => cleanup?.();
  }, []);

  return <div ref={ref} className="progress-bar" aria-hidden="true" />;
}
