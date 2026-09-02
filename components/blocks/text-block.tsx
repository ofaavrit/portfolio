import Reveal from "@/components/reveal";
import type { TextContent } from "@aavrit/core";

/** Editorial text block — or, with `scrapbook: true`, a taped-in paper
 *  cut-out straight from the owner's PDF pages: white sticker border,
 *  hard offset shadow, a strip of tape, and a slight human rotation. */
export default function TextBlock({
  content,
  heading = "h2",
  anim = "standard",
  center = false,
}: {
  content: TextContent;
  heading?: "h1" | "h2";
  anim?: string;
  center?: boolean;
}) {
  const H = heading;
  const inner = (
    <>
      {content.title ? (
        <H className="display display-xl" style={{ color: "var(--tone-fg)" }}>
          {content.title}
        </H>
      ) : null}
      {content.lead ? (
        <p className="text-[var(--text-md)] font-semibold leading-snug" style={{ color: "var(--tone-fg)" }}>
          {content.lead}
        </p>
      ) : null}
      <p
        className={`max-w-[62ch] leading-relaxed ${content.scrapbook ? "voice-hand text-[1.35rem]" : ""}`}
        style={{ color: "var(--tone-muted)" }}
      >
        {content.body}
      </p>
      {content.note ? (
        <p className="hand-note self-start pt-1" style={{ color: "var(--tone-fg)" }} aria-hidden="true">
          ✍ {content.note}
        </p>
      ) : null}
    </>
  );

  if (content.scrapbook) {
    return (
      <Reveal
        className={`relative my-2 w-fit max-w-full ${center ? "mx-auto" : ""}`}
        intensity={anim === "none" ? "none" : (anim as "subtle")}
      >
        <div
          className="sticker-cut grain relative flex max-w-[min(46rem,92vw)] flex-col gap-5 px-7 py-7 sm:px-10"
          style={{ rotate: "-1.6deg" }}
        >
          <span className="tape-strip" style={{ top: "-13px", left: "12%", rotate: "-5deg" }} aria-hidden="true" />
          <span className="tape-strip" style={{ bottom: "-12px", right: "10%", rotate: "4deg" }} aria-hidden="true" />
          {inner}
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal
      className={`flex max-w-[72ch] flex-col gap-5 ${center ? "mx-auto items-center text-center" : ""}`}
      intensity={anim === "none" ? "none" : (anim as "subtle")}
    >
      {inner}
    </Reveal>
  );
}
