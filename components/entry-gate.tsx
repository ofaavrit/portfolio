"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import LetterTiles from "./letter-tiles";

/**
 * The name-only first screen: AAVRIT letter cards on paper. Enter by tap,
 * click, scroll (wheel/touch), Enter or Space. Once per session.
 * After entry a short construction animation assembles the page (grid →
 * labels → monogram → wipe). Reduced motion: static tiles + simple fade.
 * If anything fails the overlay removes itself — the site never stays locked.
 */

const SESSION_KEY = "aavrit:entered";
const ENTERED_EVENT = "aavrit:entered";

type Phase = "deciding" | "gate" | "constructing" | "done";

export default function EntryGate({ introEnabled }: { introEnabled: boolean }) {
  const [phase, setPhase] = useState<Phase>("deciding");
  // AAVRIT reads as ONE horizontal line on wide screens, ONE vertical line
  // on tall/narrow ones — the name always fits, never wraps, never overflows.
  const [vertical, setVertical] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLSpanElement>(null);
  const constructRef = useRef<HTMLDivElement>(null);
  const enteredRef = useRef(false);
  const cleanupFns = useRef<(() => void)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px), (max-height: 520px)");
    const sync = () => setVertical(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    // Deferred a micro-task so the curtain class is removed after first paint
    // of this effect (and so we never cascade synchronous renders).
    queueMicrotask(() => {
      if (!introEnabled) {
        document.documentElement.classList.remove("gate-pending");
        setPhase("done");
        return;
      }
      let already = false;
      try {
        already = sessionStorage.getItem(SESSION_KEY) === "1";
      } catch {
        /* private mode — treat as not entered */
      }
      // The gate owns the screen now — release the pre-hydration curtain.
      document.documentElement.classList.remove("gate-pending");
      setPhase(already ? "done" : "gate");
    });
  }, [introEnabled]);

  // Lock scroll while the gate is open.
  useEffect(() => {
    if (phase === "gate" || phase === "constructing") {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [phase]);

  const finish = useCallback((instant = false) => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent(ENTERED_EVENT, { detail: { instant } }));
    setPhase("done");
    cleanupFns.current.forEach((fn) => fn());
    cleanupFns.current = [];
  }, []);

  // The construction sequence.
  const construct = useCallback(async (instant = false) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    if (instant) {
      window.dispatchEvent(new CustomEvent("aavrit:reveal"));
      finish(true);
      return;
    }
    setPhase("constructing");
    try {
      if (reduced) {
        await new Promise<void>((resolve) => {
          const el = overlayRef.current;
          if (!el) return resolve();
          el.style.transition = "opacity .35s ease";
          el.style.opacity = "0";
          setTimeout(resolve, 380);
        });
        finish();
        return;
      }
      const { gsap } = await import("gsap");
      const overlay = overlayRef.current;
      if (!overlay) {
        finish();
        return;
      }
      const short = mobile;
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => finish(),
      });
      const kill = () => {
        tl.kill();
        finish(true);
      };
      cleanupFns.current.push(kill);
      // hard safety net — never lock the site behind a stuck animation
      const net = setTimeout(() => kill(), 3200);
      cleanupFns.current.push(() => clearTimeout(net));

      const tiles = tilesRef.current?.querySelectorAll<HTMLElement>("[data-tile]");
      const constructLayer = constructRef.current;
      const labels = constructLayer?.querySelectorAll<HTMLElement>("[data-clabel]");
      const gridLines = constructLayer?.querySelectorAll<SVGPathElement>("[data-gridline]");
      const mono = constructLayer?.querySelectorAll<HTMLElement>("[data-mono]");

      if (tiles && tiles.length) {
        tl.to(tiles, {
          yPercent: short ? -220 : -160,
          rotation: (i: number) => (i % 2 ? 14 : -12),
          autoAlpha: 0,
          duration: short ? 0.4 : 0.55,
          stagger: { each: 0.045, from: "center" },
          ease: "power2.in",
        });
      }
      tl.set(constructRef.current, { display: "block" }, "-=0.1");
      if (gridLines && gridLines.length) {
        gridLines.forEach((line) => {
          const len = line.getTotalLength?.() ?? 0;
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        });
        tl.to(gridLines, { strokeDashoffset: 0, duration: short ? 0.35 : 0.55, stagger: 0.05 });
      }
      if (labels && labels.length) {
        tl.fromTo(
          labels,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.22, stagger: 0.07 },
          "-=0.3",
        );
      }
      if (mono && mono.length) {
        tl.fromTo(
          mono,
          { autoAlpha: 0, x: (i: number) => (i === 0 ? -60 : 60), rotation: i => (i === 0 ? -8 : 8) },
          {
            autoAlpha: 1,
            x: 0,
            rotation: 0,
            duration: short ? 0.3 : 0.45,
            stagger: 0.08,
            ease: "back.out(1.8)",
          },
          "-=0.15",
        );
      }
      tl.to(overlay, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: short ? 0.4 : 0.6,
        ease: "power4.inOut",
        delay: short ? 0.1 : 0.25,
      });
      // tell the hero (and anything listening) to start revealing as the
      // overlay lifts
      tl.call(() => window.dispatchEvent(new CustomEvent("aavrit:reveal")), undefined, "-=0.45");
    } catch {
      finish(true);
    }
  }, [finish]);

  const enter = useCallback(() => {
    if (enteredRef.current || phase !== "gate") return;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    void construct(false);
  }, [phase, construct]);

  // Wheel / touch / key entry while the gate is up.
  useEffect(() => {
    if (phase !== "gate") return;
    const onWheel = () => enter();
    const onTouch = () => enter();
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [phase, enter]);

  // The opening moment: hold the big AAVRIT view for a beat, then the
  // construction animation opens the page by itself. Any interaction still
  // enters instantly, Escape skips, and reduced motion settles quickly.
  useEffect(() => {
    if (phase !== "gate") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => enter(), reduced ? 900 : 2400);
    return () => window.clearTimeout(t);
  }, [phase, enter]);

  // Escape skips the construction animation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (phase === "gate" || phase === "constructing")) {
        finish(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, finish]);

  if (phase === "done" || phase === "deciding") return null;

  return (
    <div
      ref={overlayRef}
      id="entry-gate"
      aria-hidden="true"
      className="fixed inset-0 z-[100] dots grain"
      style={{ background: "#f5f0e3", clipPath: "inset(0% 0% 0% 0%)" }}
    >
      {/* misregistered cover print — the deck's page 1, layered behind the tiles */}
      <span
        aria-hidden="true"
        className="voice-condensed pointer-events-none absolute inset-0 hidden items-center justify-center text-[38vw] leading-none opacity-[0.08] select-none sm:flex"
        style={{ color: "#ff00ff", transform: "translate(-1.2vw, -0.8vh) rotate(-4deg)" }}
      >
        AAVRIT
      </span>
      <span
        aria-hidden="true"
        className="voice-condensed pointer-events-none absolute inset-0 hidden items-center justify-center text-[38vw] leading-none opacity-[0.08] select-none sm:flex"
        style={{ color: "#00c8c8", transform: "translate(1.2vw, 0.9vh) rotate(3deg)" }}
      >
        AAVRIT
      </span>
      <button
        type="button"
        className="group absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-6 px-4"
        aria-label="AAVRIT — enter the website (press Enter, Space or tap anywhere)"
        onClick={enter}
        autoFocus
      >
        <span className="sr-only">
          AAVRIT — the interactive autobiography of Aavrit Gupta. Press Enter or Space, tap,
          or scroll to enter.
        </span>
        <span
          ref={tilesRef}
          className={
            vertical
              ? "flex flex-col items-center gap-[clamp(0.3rem,1.2vh,0.7rem)]"
              : "flex items-center gap-[clamp(0.35rem,1.4vw,1rem)]"
          }
          aria-hidden="true"
        >
          <LetterTiles
            text="AAVRIT"
            animateIdle
            vertical={vertical}
            tileClassName={
              vertical
                ? "text-[min(10.5vh,8.5vw)] w-[1.2em] h-[1.18em]"
                : "text-[clamp(2.4rem,9.6vw,8.5rem)] w-[1.18em] h-[1.16em]"
            }
          />
        </span>
        <span className="gate-loading" aria-hidden="true">
          <span className="gate-bar"><i /></span>
          <span className="gate-label">
            ENTERING AAVRIT&apos;S PORTFOLIO
            <span className="gate-dots"><b /><b /><b /></span>
          </span>
        </span>
      </button>

      {/* construction layer (revealed during the build-up) */}
      <div
        ref={constructRef}
        className="pointer-events-none absolute inset-0"
        style={{ display: "none" }}
        aria-hidden="true"
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path data-gridline d="M 2 18 H 98" stroke="#1b3624" strokeWidth="0.18" fill="none" vectorEffect="non-scaling-stroke" opacity="0.5" />
          <path data-gridline d="M 2 82 H 98" stroke="#1b3624" strokeWidth="0.18" fill="none" vectorEffect="non-scaling-stroke" opacity="0.5" />
          <path data-gridline d="M 22 4 V 96" stroke="#1b3624" strokeWidth="0.18" fill="none" vectorEffect="non-scaling-stroke" opacity="0.5" />
          <path data-gridline d="M 78 4 V 96" stroke="#1b3624" strokeWidth="0.18" fill="none" vectorEffect="non-scaling-stroke" opacity="0.5" />
        </svg>
        <span data-clabel className="mono-label absolute left-[22%] top-[13%] -translate-y-1/2 bg-[#f5f0e3] px-2 text-[#5a6b60]">
          EST. ONLINE 2023
        </span>
        <span data-clabel className="mono-label absolute right-[20%] top-[13%] -translate-y-1/2 bg-[#f5f0e3] px-2 text-[#5a6b60]">
          GRADE 10 · CBSE · NEPAL
        </span>
        <span data-clabel className="mono-label absolute bottom-[14%] left-1/2 -translate-x-1/2 bg-[#f5f0e3] px-2 text-[#5a6b60]">
          STORY BEGINS →
        </span>
        <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-3">
          <span data-mono className="tile text-[clamp(2.2rem,8vw,5rem)] h-[1.25em] w-[1.25em]" style={{ "--tile-bg": "#ffd200", "--tile-shadow": "#ff3873" } as React.CSSProperties}>
            A
          </span>
          <span data-mono className="tile text-[clamp(2.2rem,8vw,5rem)] h-[1.25em] w-[1.25em]" style={{ "--tile-bg": "#3ef2e4", "--tile-shadow": "#ceef32" } as React.CSSProperties}>
            A
          </span>
        </span>
      </div>

      {phase === "gate" ? (
        <span
          className="mono-label absolute bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] rounded-full border border-[#1b3624]/40 px-3 py-1 text-[#5a6b60] animate-[blink_3s_infinite]"
          aria-hidden="true"
        >
          TAP · SCROLL · ENTER
        </span>
      ) : (
        <button
          type="button"
          onClick={() => finish(true)}
          className="mono-label absolute bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-10 rounded-full border-2 border-[#1b3624] bg-[#ffd200] px-4 py-2 text-[#1b3624] shadow-[3px_3px_0_#111]"
        >
          SKIP ✦
        </button>
      )}
    </div>
  );
}
