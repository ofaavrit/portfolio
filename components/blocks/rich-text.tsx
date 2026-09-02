import Reveal from "@/components/reveal";
import WordReveal from "./word-reveal";
import { sanitizeRichText, type RichTextContent, type ZineVoice } from "@aavrit/core";

/** Editorial block. On dark tones it switches to the quieter serif-style
 *  reading mode with gold accents and a glitching title. The optional
 *  typewriter mode reveals the text word by word with a blinking caret,
 *  and the `voice` field lets each column speak in one of the deck's own
 *  typefaces (pencil scrawl, typewriter, marker or bubbly). */

const VOICE_CLASS: Record<ZineVoice, string> = {
  editorial: "",
  hand: "voice-hand",
  typewriter: "voice-type",
  marker: "voice-marker",
  bubbly: "voice-chewy",
};

export default function RichTextBlock({
  content,
  heading = "h2",
  tone = "paper",
  anim = "standard",
  center = false,
}: {
  content: RichTextContent;
  heading?: "h1" | "h2";
  tone?: string;
  anim?: string;
  center?: boolean;
}) {
  const H = heading;
  const dark = tone === "navy" || tone === "ink";
  const html = sanitizeRichText(content.html);
  const voice = VOICE_CLASS[content.voice ?? "editorial"];
  return (
    <Reveal
      className={`flex flex-col gap-7 ${center ? "items-center text-center" : ""} ${dark ? "editorial" : ""}`}
      intensity={anim === "none" ? "none" : (anim as "subtle")}
    >
      {content.title ? (
        <H
          className={`display display-lg ${dark ? "glitch" : ""} ${
            content.voice === "marker" ? "voice-marker" : content.voice === "bubbly" ? "voice-chewy" : ""
          }`}
          data-text={content.title}
          style={{ color: dark ? "var(--gold)" : "var(--tone-fg)", letterSpacing: "0.01em" }}
        >
          {content.title}
        </H>
      ) : null}
      {content.typewriter ? (
        <WordReveal
          html={html}
          className={`richtext voice-type max-w-[64ch] text-[clamp(1.15rem,1vw+0.95rem,1.45rem)] leading-[1.8] ${voice === "voice-type" ? "" : voice}`}
          style={{ color: dark ? "#fff1e1" : "var(--tone-fg)" }}
        />
      ) : (
        <div
          className={`richtext max-w-[64ch] text-[clamp(1.15rem,1vw+0.95rem,1.45rem)] leading-[1.75] ${
            dark ? "font-hand" : ""
          } ${voice}`}
          style={{ color: dark ? "#fff1e1" : "var(--tone-fg)" }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </Reveal>
  );
}
