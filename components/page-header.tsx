import Reveal from "@/components/reveal";
import StickerGlyph, { type StickerName } from "./sticker-svg";

export type CoverVoice = "condensed" | "hand" | "marker" | "bubbly";

/**
 * Immersive chapter cover — fills the viewport (adapts to any aspect ratio,
 * compacts on short landscape phones), sets the chapter's mood color, and
 * gives every story page its own opening moment before the blocks begin.
 * The zine pass adds: paper grain, drifting mood blobs (scroll-driven where
 * supported), a misregistered-print kicker and hand-cut sticker accents.
 */
export default function PageHeader({
  kicker,
  title,
  note,
  accent,
  mood = "#ffd200",
  voice = "condensed",
  sticker = "tileA",
}: {
  kicker: string;
  title: string;
  note?: string;
  accent?: string;
  mood?: string;
  voice?: CoverVoice;
  sticker?: StickerName;
}) {
  return (
    <header
      className="chapter-cover grain relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* mood field — each chapter paints its own atmosphere, drifting on scroll */}
      <div
        aria-hidden="true"
        className="parallax-blob-a pointer-events-none absolute -right-[12%] -top-[18%] h-[62vmin] w-[62vmin] rounded-full opacity-25 blur-2xl"
        style={{ background: mood }}
      />
      <div
        aria-hidden="true"
        className="parallax-blob-b pointer-events-none absolute -bottom-[26%] -left-[10%] h-[46vmin] w-[46vmin] rounded-[28%] opacity-15 blur-2xl"
        style={{ background: mood }}
      />
      <div className="dots pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      {/* this chapter's own sticker doodle (follows the page accent) */}
      <div aria-hidden="true" className="pointer-events-none absolute right-[6%] top-[14%] hidden rotate-12 sm:block">
        <StickerGlyph name={sticker} size={46} />
      </div>

      <div className="container-x relative z-[2] flex min-h-[inherit] flex-col justify-center gap-5 py-[clamp(4.5rem,12vh,8rem)]">
        <Reveal className="flex flex-col gap-5" intensity="subtle" y={24}>
          <p
            className="pill w-fit border-[#111] offset-print-hover"
            style={{ background: accent ?? mood, color: "#111" }}
          >
            <span aria-hidden="true">✦</span> {kicker}
          </p>
          <h1
            className={`display chapter-title offset-print offset-print-hover text-balance cover-voice-${voice}`}
            style={
              {
                color: "var(--foreground)",
                "--print-m": mood,
                "--print-c": "#00c8c8",
              } as React.CSSProperties
            }
          >
            {title}
          </h1>
          {note ? (
            <p className="hand-note doodle-underline w-fit opacity-85" style={{ color: "var(--foreground)" }}>
              {note}
            </p>
          ) : null}
        </Reveal>
        <p
          aria-hidden="true"
          className="scroll-cue mono-label absolute bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 opacity-60"
          style={{ color: "var(--muted)" }}
        >
          ↓ SCROLL
        </p>
      </div>
    </header>
  );
}
