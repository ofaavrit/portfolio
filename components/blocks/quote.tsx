import Reveal from "@/components/reveal";
import type { QuoteContent } from "@aavrit/core";

/** Big typographic statement. Quiet tones get an oversized quote treatment. */
export default function QuoteBlock({
  content,
  tone = "paper",
  anim = "standard",
  center = false,
}: {
  content: QuoteContent;
  tone?: string;
  anim?: string;
  center?: boolean;
}) {
  const dark = tone === "navy" || tone === "ink";
  return (
    <Reveal
      className={`flex flex-col gap-6 ${center ? "items-center text-center" : ""}`}
      intensity={anim === "none" ? "none" : (anim as "subtle")}
    >
      <span
        aria-hidden="true"
        className="display leading-none"
        style={{ fontSize: "clamp(3rem,8vw,6rem)", color: dark ? "var(--gold)" : "var(--tone-fg)", opacity: 0.5 }}
      >
        “
      </span>
      <blockquote className="max-w-[24ch] display display-xl" style={{ color: "var(--tone-fg)" }}>
        {content.text}
      </blockquote>
      {content.attribution ? (
        <footer className="font-hand text-[clamp(1.3rem,2vw,1.6rem)] opacity-80" style={{ color: "var(--tone-fg)" }}>
          — {content.attribution}
        </footer>
      ) : null}
    </Reveal>
  );
}
