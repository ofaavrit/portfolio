import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlockRenderer from "@/components/blocks/block-renderer";
import PageHeader, { type CoverVoice } from "@/components/page-header";
import type { StickerName } from "@/components/sticker-svg";
import type { PageWithBlocks } from "@/lib/content";

const ACCENT_BG: Record<string, string> = {
  pink: "#ff9ec4",
  lilac: "#beb0fa",
  orange: "#ff7134",
  cyan: "#3ef2e4",
  lime: "#ceef32",
  yellow: "#ffd200",
};

/* Every chapter speaks in its own PDF typeface and pins its own sticker —
   both derived from the page accent, so changing the accent in the admin
   page editor restyles the whole cover (color + voice + doodle). */
const ACCENT_VOICE: Record<string, CoverVoice> = {
  pink: "hand",      // interests — the pencil-scrawl page
  lilac: "hand",     // about — the script page
  orange: "marker",  // hobbies — the graffiti page
  cyan: "bubbly",    // digital world — the Chewy page
  lime: "condensed", // websites — the heavy poster page
  yellow: "condensed", // achievements — the bold scoreboard
};
const ACCENT_STICKER: Record<string, StickerName> = {
  pink: "heart",
  lilac: "star",
  orange: "cassette",
  cyan: "cursor",
  lime: "bolt",
  yellow: "trophy",
};

/** Shared frame for story chapter routes. */
export default function StoryPage({
  page,
  chapterNumber,
  total,
  next,
  email,
  socialsJson,
  channelsJson,
  accentBg,
  mood,
}: {
  page: PageWithBlocks;
  chapterNumber: number | null;
  total: number;
  next: { label: string; href: string } | null;
  email: string;
  socialsJson: string;
  channelsJson: string;
  accentBg?: string;
  mood?: string;
}) {
  return (
    <>
      <PageHeader
        kicker={
          chapterNumber
            ? `CHAPTER ${String(chapterNumber).padStart(2, "0")} / ${String(total).padStart(2, "0")}`
            : "CHAPTER"
        }
        title={page.title}
        accent={accentBg ?? ACCENT_BG[page.accent] ?? "#ffd200"}
        mood={mood ?? ACCENT_BG[page.accent] ?? "#ffd200"}
        voice={ACCENT_VOICE[page.accent] ?? "condensed"}
        sticker={ACCENT_STICKER[page.accent] ?? "tileA"}
      />
      <BlockRenderer
        blocks={page.blocks}
        firstHeadingAsH1={false}
        contactEmail={email}
        socialsJson={socialsJson}
        channelsJson={channelsJson}
      />
      {next && next.href !== `/${page.slug}` ? (
        <nav
          aria-label="Next chapter"
          className="container-x flex justify-end pb-4"
        >
          <Link
            href={next.href}
            className="group flex items-center gap-4 rounded-full border-2 border-[#111] bg-[var(--background)] py-2 pl-6 pr-2 shadow-[4px_4px_0_#111] transition-transform duration-200 hover:-translate-y-1"
          >
            <span className="mono-label opacity-60" style={{ color: "var(--muted)" }}>
              NEXT UP
            </span>
            <span className="display text-xl" style={{ color: "var(--foreground)" }}>
              {next.label}
            </span>
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#111] transition-transform duration-200 group-hover:translate-x-1"
              style={{ background: ACCENT_BG[page.accent] ?? "#ffd200" }}
            >
              <ArrowRight size={18} aria-hidden="true" />
            </span>
          </Link>
        </nav>
      ) : null}
    </>
  );
}
