"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Desktop-only cursor-following project preview. Activates on fine pointers
 * with hover; entirely absent on touch devices.
 */
export default function CursorPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let visible = false;

    const loop = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      el.style.transform = `translate(${cx + 22}px, ${cy - 60}px) rotate(${(tx - cx) * 0.05}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-preview-src]");
      if (target) {
        const nextSrc = target.dataset.previewSrc ?? null;
        const nextLabel = target.dataset.previewLabel ?? null;
        if (nextSrc !== src) setSrc(nextSrc);
        if (nextLabel !== label) setLabel(nextLabel);
        if (!visible) {
          visible = true;
          el.style.opacity = "1";
        }
      } else if (visible) {
        visible = false;
        el.style.opacity = "0";
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [src, label]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden w-56 opacity-0 transition-opacity duration-200 [@media(pointer:fine)]:block"
    >
      <div className="sticker overflow-hidden p-0">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-32 w-full object-cover" loading="lazy" />
        ) : null}
        {label ? (
          <p className="mono-label border-t-2 border-[#111] px-3 py-2 text-[#111]" style={{ background: "#ffd200" }}>
            {label}
          </p>
        ) : null}
      </div>
    </div>
  );
}
