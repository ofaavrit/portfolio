"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";

/**
 * Word-by-word typewriter reveal (with blinking caret). The full text stays in
 * the HTML — GSAP only animates word spans into view, so nothing is hidden if
 * JS fails and reduced-motion users simply see the text.
 */
export default function WordReveal({
  html,
  className,
  style,
}: {
  html: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
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
          const words = el.querySelectorAll("[data-word]");
          if (!words.length) return;
          const tween = gsap.fromTo(
            words,
            { autoAlpha: 0.08 },
            {
              autoAlpha: 1,
              duration: 0.18,
              stagger: 0.028,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 82%", once: true },
            },
          );
          const caret = el.querySelector("[data-caret]");
          if (caret) {
            gsap.set(caret, { autoAlpha: 0 });
            gsap.to(caret, {
              autoAlpha: 1,
              duration: 0.2,
              scrollTrigger: { trigger: el, start: "top 82%", once: true },
              delay: words.length * 0.028 + 0.1,
            });
          }
          cleanup = () => {
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        } catch {
          /* words stay visible */
        }
      })();
      return () => cleanup?.();
    },
    { scope: ref, dependencies: [html] },
  );

  // split sanitized HTML into word spans (tags stay intact per word chunk)
  const parts = html.split(/(?<=\s)(?=[^<])/);
  return (
    <div ref={ref} className={`type-caret ${className ?? ""}`} style={style}>
      {parts.map((chunk, i) => (
        <span key={i} data-word dangerouslySetInnerHTML={{ __html: chunk }} />
      ))}
      <span data-caret aria-hidden="true" />
    </div>
  );
}
