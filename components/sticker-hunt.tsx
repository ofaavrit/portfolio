"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import StickerGlyph, { type StickerName } from "./sticker-svg";
import { burstFromElement, burstConfetti } from "./confetti";
import { fsCreate } from "@/lib/fsdb";

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
const FRIEND_KEY = "aavrit:friend";

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

  // ── the heart book: Aavrit's List of friends ──
  const [bookOpen, setBookOpen] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "local">("idle");
  const [existingFriend, setExistingFriend] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FRIEND_KEY);
      if (raw) setExistingFriend(JSON.parse(raw) as string);
    } catch {
      /* no friend yet */
    }
  }, []);

  async function saveFriend(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    const name = friendName.trim().slice(0, 40);
    if (name.length < 2 || saveState === "saving") return;
    setSaveState("saving");
    const ok = await fsCreate("friends", `fr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`, {
      name,
      source: "sticker-hunt",
      createdAt: new Date().toISOString(),
    });
    try {
      localStorage.setItem(FRIEND_KEY, JSON.stringify(name));
    } catch {
      /* private mode */
    }
    setExistingFriend(name);
    window.setTimeout(() => {
      setSaveState(ok ? "saved" : "local");
      setBookOpen(false); // the book closes — the name is kept in the heart
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 40);
    }, 650);
  }

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

      {/* reward — the HEART BOOK: save your name in Aavrit's List */}
      {showReward ? (
        <div
          className="fixed inset-0 z-[120] grid place-items-center overflow-y-auto p-5"
          style={{ background: "rgba(6,0,41,0.86)" }}
          role="dialog"
          aria-modal="true"
          aria-label="Sticker hunt reward — save your name in Aavrit's List"
          onClick={() => setShowReward(false)}
        >
          <div
            className="flex w-[min(34rem,94vw)] flex-col items-center gap-5 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="voice-condensed offset-print text-3xl uppercase sm:text-4xl" style={{ color: "#fff1e1" }}>
              {title}
            </p>
            <p className="mono-label -mt-3" style={{ color: "#ffd200" }}>
              ALL {SPOTS.length} STICKERS FOUND — THE HEART IS YOURS TO SIGN
            </p>

            <div className="hb-stage">
              <div className={`hb-book ${bookOpen ? "open" : ""} ${saveState === "saved" || saveState === "local" ? "hb-saved" : ""} ${!bookOpen && saveState === "idle" ? "beat" : ""}`}>
                {/* closed cover: a beating heart-book */}
                <button
                  type="button"
                  className="hb-cover"
                  aria-label={bookOpen ? "Aavrit's List — open" : "Open Aavrit's List to save your name"}
                  onClick={() => setBookOpen((v) => !v)}
                  style={{
                    background: "linear-gradient(135deg, #ff5055 0%, #e2213f 55%, #a3122e 100%)",
                    border: "3px solid #111",
                    boxShadow: "6px 7px 0 rgba(17,17,17,0.85)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <span className="flex flex-col items-center gap-2">
                    <svg width="52" height="48" viewBox="0 0 24 22" aria-hidden="true" fill="#fff1e1">
                      <path d="M12 21s-9.5-5.7-11.3-11C-.6 6.2 2.2 2 6.2 2c2.4 0 4.4 1.3 5.8 3.2C13.4 3.3 15.4 2 17.8 2c4 0 6.8 4.2 5.5 8-1.8 5.3-11.3 11-11.3 11z" />
                    </svg>
                    <span className="voice-marker text-xl leading-none" style={{ color: "#fff1e1" }}>
                      Aavrit&apos;s List
                    </span>
                    <span className="mono-label" style={{ color: "#ffd7da" }}>
                      {bookOpen ? "TAP TO KEEP IT SAFE" : existingFriend ? `· ${existingFriend} IS IN HERE ·` : "TAP TO OPEN"}
                    </span>
                  </span>
                </button>

                {/* open pages */}
                <div className="hb-page hb-page-left">
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
                    <p className="mono-label" style={{ color: "#7a5a2f" }}>AS PROMISED — THE NAMES</p>
                    <p className="voice-marker text-[0.95rem] leading-snug sm:text-lg" style={{ color: "#060029" }}>
                      {reward}
                    </p>
                    <Link href="/websites" className="pill mt-1 border-[#111]" style={{ background: "#ffd200", color: "#111" }} onClick={() => setShowReward(false)}>
                      SEE THE WEBSITES →
                    </Link>
                  </div>
                </div>
                <div className="hb-page hb-page-right">
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
                    {existingFriend ? (
                      <>
                        <p className="voice-marker text-lg leading-snug" style={{ color: "#060029" }}>
                          You&apos;re in the List, {existingFriend} <span className="hb-heart">❤</span>
                        </p>
                        <p className="mono-label" style={{ color: "#5a6b60" }}>SAVED IN THE HEART — FOREVER</p>
                      </>
                    ) : (
                      <form onSubmit={saveFriend} className="flex w-full flex-col items-center gap-2">
                        <p className="voice-marker text-lg leading-snug" style={{ color: "#060029" }}>
                          Save your name in Aavrit&apos;s List <span className="hb-heart">❤</span>
                        </p>
                        <p className="mono-label" style={{ color: "#5a6b60" }}>THIS IS THE REWARD — BE REMEMBERED</p>
                        <input
                          value={friendName}
                          onChange={(e) => setFriendName(e.target.value)}
                          maxLength={40}
                          required
                          minLength={2}
                          placeholder="your name"
                          aria-label="Your name for Aavrit's List"
                          className="w-[min(15rem,80%)] rounded-lg border-2 border-[#111] bg-white px-3 py-2 text-center font-semibold"
                          style={{ color: "#111" }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          type="submit"
                          disabled={saveState === "saving" || friendName.trim().length < 2}
                          className="mono-label rounded-full border-2 border-[#111] px-5 py-2 disabled:opacity-50"
                          style={{ background: "#ff5055", color: "#fff" }}
                        >
                          {saveState === "saving" ? "WRITING…" : "SAVE MY NAME"}
                        </button>
                        {saveState === "local" ? (
                          <p className="mono-label" style={{ color: "#7a5a2f" }}>KEPT ON THIS DEVICE — IT FLIES TO AAVRIT&apos;S BOOK WHEN HE OPENS THE CONNECTION</p>
                        ) : null}
                      </form>
                    )}
                  </div>
                </div>
                <span className="hb-spine" aria-hidden="true" />

                {/* saved-in-the-heart flash */}
                <div className="hb-flash">
                  <span className="voice-marker text-2xl" style={{ color: "#fff", textShadow: "0 2px 0 #111" }}>
                    {saveState === "saved" || saveState === "local" ? "SAVED IN THE HEART ❤" : ""}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className="mono-label rounded-full border-2 px-4 py-2"
                style={{ background: "transparent", color: "#fff1e1", borderColor: "#fff1e1" }}
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
