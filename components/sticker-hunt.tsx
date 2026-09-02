"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import StickerGlyph, { type StickerName } from "./sticker-svg";
import { burstFromElement, burstConfetti } from "./confetti";

/**
 * THE STICKER HUNT — "FIND MY WEBSITES", straight from page 7 of the owner's
 * deck ("FIND MY WEBSITES. LET ME SHARE THE NAMES."). One collectible sticker
 * hides on each of the eight chapters. Find all eight and the site prints the
 * full list of website names as the reward — the PDF's own punchline.
 *
 * • Every sticker is a real <button> (keyboard + touch friendly, labelled).
 * • Progress persists in localStorage; the tray announces changes politely.
 * • Completely optional: the whole layer can be switched off in the admin
 *   Settings screen, and nothing essential lives inside it.
 * • Reduced motion: no bobbing, no confetti — the collection still works.
 */

const STORAGE_KEY = "aavrit:stickers.v1";

const COLLECT_LINES = [
  "NICE EYE!",
  "GOT ONE!",
  "SHARP!",
  "THAT'S ONE!",
  "KEEP GOING!",
  "SO CLOSE!",
  "ONE MORE!",
  "LEGEND!",
];

type Spot = {
  id: StickerName;
  label: string;
  route: string;
  /** fixed position, chosen to never block content on small screens */
  pos: { right: string; bottom: string } | { left: string; bottom: string };
  bg: string;
};

const SPOTS: Spot[] = [
  { id: "tileA", label: "the first letter", route: "/", pos: { right: "1.4rem", bottom: "6.4rem" }, bg: "#ffd200" },
  { id: "star", label: "the honest star", route: "/about", pos: { right: "1.1rem", bottom: "7.6rem" }, bg: "#ff9ec4" },
  { id: "flower", label: "the sharing flower", route: "/interests", pos: { left: "1.1rem", bottom: "7.4rem" }, bg: "#ceef32" },
  { id: "cassette", label: "the free-time cassette", route: "/hobbies", pos: { right: "1.2rem", bottom: "8.2rem" }, bg: "#beb0fa" },
  { id: "cursor", label: "the first click", route: "/digital-world", pos: { left: "1.3rem", bottom: "6.8rem" }, bg: "#3ef2e4" },
  { id: "bolt", label: "the shipped bolt", route: "/websites", pos: { right: "1.2rem", bottom: "7.1rem" }, bg: "#ff7134" },
  { id: "trophy", label: "the honest trophy", route: "/achievements", pos: { left: "1.1rem", bottom: "7.8rem" }, bg: "#ffd200" },
  { id: "heart", label: "the reach-out heart", route: "/contact", pos: { right: "1.3rem", bottom: "6.9rem" }, bg: "#ff5055" },
];

export default function StickerHunt({
  enabled,
  title,
  reward,
}: {
  enabled: boolean;
  title: string;
  reward: string;
}) {
  const pathname = usePathname();
  const [found, setFound] = useState<StickerName[]>([]);
  const [mounted, setMounted] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);
  const [justCollected, setJustCollected] = useState<StickerName | null>(null);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    // deferred a micro-task so state updates never cascade synchronously
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setFound(JSON.parse(raw) as StickerName[]);
      } catch {
        /* fresh hunt */
      }
      setMounted(true);
    });
  }, []);

  const persist = useCallback((next: StickerName[]) => {
    setFound(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* private mode — session-only hunt */
    }
  }, []);

  const spot = useMemo(
    () => SPOTS.find((s) => s.route === (pathname === "/" ? "/" : pathname)) ?? null,
    [pathname]
  );
  const collect = useCallback(
    (id: StickerName) => {
      if (found.includes(id)) return;
      const next = [...found, id];
      persist(next);
      setJustCollected(id);
      window.setTimeout(() => setJustCollected(null), 2600);
      if (next.length === SPOTS.length) {
        // THE MOMENT — full deck collected: print the website names.
        window.setTimeout(() => setShowReward(true), 650);
        burstConfetti(window.innerWidth / 2, window.innerHeight * 0.42, 64);
      } else {
        const el = document.querySelector<HTMLElement>(`[data-sticker="${id}"]`);
        burstFromElement(el, 22);
      }
    },
    [found, persist]
  );

  // The tray jiggles every few seconds while this chapter still hides a
  // sticker — a gentle "you're warm" signal.
  const hintHere = Boolean(spot && !found.includes(spot.id));
  useEffect(() => {
    if (!hintHere) return;
    const id = window.setInterval(() => {
      const el = document.querySelector<HTMLElement>("[data-quest-tray]");
      if (!el) return;
      el.classList.remove("tray-jiggle");
      void el.offsetWidth; // restart the animation
      el.classList.add("tray-jiggle");
    }, 6500);
    return () => window.clearInterval(id);
  }, [hintHere]);

  if (!enabled || !mounted) return null;

  const complete = found.length === SPOTS.length;

  return (
    <>
      {/* hidden collectible for the current chapter */}
      {spot && !found.includes(spot.id) ? (
        <button
          type="button"
          data-sticker={spot.id}
          className="quest-sticker"
          style={{ background: spot.bg, ...spot.pos }}
          aria-label={`Sticker hunt: collect ${spot.label}`}
          onClick={() => collect(spot.id)}
        >
          <StickerGlyph name={spot.id} size={30} />
        </button>
      ) : null}

      {/* collected pop confirmation */}
      {justCollected ? (
        <p
          aria-live="polite"
          className="quest-tray quest-pop mono-label"
          style={{ left: "auto", right: "1rem", bottom: "1rem" }}
        >
          <span
            className="pill"
            style={{ background: "#ffd200", color: "#111", borderColor: "#111" }}
          >
            ★ {COLLECT_LINES[(found.length - 1) % COLLECT_LINES.length]} — {found.length}/{SPOTS.length}
          </span>
        </p>
      ) : null}

      {/* progress tray */}
      <div className="quest-tray" data-quest-tray>
        <button
          type="button"
          onClick={() => setTrayOpen((v) => !v)}
          aria-expanded={trayOpen}
          aria-label={`Sticker hunt progress: ${found.length} of ${SPOTS.length} found${complete ? " — complete!" : ""}`}
          className="mono-label flex items-center gap-2 rounded-full border-2 px-3 py-2"
          style={{
            background: complete ? "#ffd200" : "#fff6ec",
            color: "#111",
            borderColor: "#111",
            boxShadow: "3px 4px 0 rgba(17,17,17,0.8)",
          }}
        >
          ★ {found.length}/{SPOTS.length}
          <span aria-hidden="true">{trayOpen ? "×" : "?"}</span>
        </button>

        {trayOpen ? (
          <div
            className="quest-pop sticker-cut absolute bottom-[calc(100%+0.6rem)] left-0 w-[min(19rem,78vw)] p-4"
            style={{ rotate: "-1deg" }}
            role="dialog"
            aria-label="Sticker hunt progress"
          >
            <div className="tape-strip" style={{ top: "-13px", left: "30%", rotate: "-4deg" }} aria-hidden="true" />
            <p className="voice-marker mb-1 text-lg leading-tight" style={{ color: "#111" }}>
              {title}
            </p>
            <p className="mono-label mb-3" style={{ color: "#333" }}>
              {complete ? "DECK COMPLETE — NAMES UNLOCKED" : "ONE STICKER HIDES ON EVERY CHAPTER"}
            </p>
            <ul className="grid grid-cols-4 gap-2" style={{ color: "#111" }}>
              {SPOTS.map((s) => {
                const got = found.includes(s.id);
                return (
                  <li
                    key={s.id}
                    className="grid place-items-center gap-1 rounded-lg border-2 p-1.5"
                    style={{
                      borderColor: got ? "#111" : "rgba(17,17,17,0.25)",
                      background: got ? s.bg : "transparent",
                      opacity: got ? 1 : 0.45,
                    }}
                    title={got ? s.label : "not found yet"}
                  >
                    {got ? <StickerGlyph name={s.id} size={26} /> : <span aria-hidden="true">?</span>}
                    <span className="sr-only">{got ? `${s.label} — found` : `${s.label} — not found yet`}</span>
                  </li>
                );
              })}
            </ul>
            {complete ? (
              <button
                type="button"
                className="mono-label mt-3 w-full rounded-full border-2 py-2"
                style={{ background: "#111", color: "#ffd200", borderColor: "#111" }}
                onClick={() => setShowReward(true)}
              >
                ★ OPEN THE REWARD
              </button>
            ) : (
              <p className="hand-note mt-2 text-base" style={{ color: "#333" }}>
                {SPOTS.length - found.length} more and I&apos;ll share the names…
              </p>
            )}
          </div>
        ) : null}
      </div>

      {/* reward modal — the names, at last */}
      {showReward ? (
        <div
          className="fixed inset-0 z-[120] grid place-items-center p-5"
          style={{ background: "rgba(6,0,41,0.82)" }}
          role="dialog"
          aria-modal="true"
          aria-label="Sticker hunt reward"
          onClick={() => setShowReward(false)}
        >
          <div
            className="sticker-cut relative w-[min(34rem,92vw)] p-7 text-center"
            style={{ background: "#fff1e1", rotate: "-1.2deg" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tape-strip" style={{ top: "-13px", left: "24%", rotate: "-6deg" }} aria-hidden="true" />
            <div className="tape-strip" style={{ top: "-13px", right: "24%", rotate: "5deg" }} aria-hidden="true" />
            <div className="mb-3 flex justify-center gap-2" aria-hidden="true">
              {SPOTS.map((s) => (
                <StickerGlyph key={s.id} name={s.id} size={30} />
              ))}
            </div>
            <p className="voice-condensed offset-print text-4xl uppercase sm:text-5xl" style={{ color: "#111" }}>
              {title}
            </p>
            <p className="mono-label mt-2" style={{ color: "#444" }}>
              ALL {SPOTS.length} STICKERS FOUND — AS PROMISED, THE NAMES:
            </p>
            <p className="voice-marker mt-3 text-xl leading-snug sm:text-2xl" style={{ color: "#060029" }}>
              {reward}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/websites"
                className="pill border-[#111]"
                style={{ background: "#ffd200", color: "#111" }}
                onClick={() => setShowReward(false)}
              >
                SEE THE WEBSITES →
              </Link>
              <button
                type="button"
                className="mono-label rounded-full border-2 border-[#111] px-4 py-2"
                style={{ background: "transparent", color: "#111" }}
                onClick={() => setShowReward(false)}
              >
                KEEP READING
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
