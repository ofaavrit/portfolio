import Image from "next/image";
import Reveal from "@/components/reveal";
import type { ImageContent } from "@aavrit/core";

const RATIOS: Record<string, string> = {
  wide: "aspect-[16/9]",
  video: "aspect-video",
  square: "aspect-square",
  tall: "aspect-[3/4]",
};

export default function ImageBlock({
  content,
  resolvedUrl,
}: {
  content: ImageContent;
  resolvedUrl?: string | null;
}) {
  const src = resolvedUrl ?? content.externalUrl ?? null;
  if (!src) return null;
  return (
    <Reveal intensity="standard">
      <figure className="mx-auto w-full max-w-[880px]">
        <div
          className={`crop-hover sticker overflow-hidden p-0 ${RATIOS[content.ratio] ?? RATIOS.wide}`}
        >
          <Image
            src={src}
            alt={content.alt}
            fill
            sizes="(max-width: 900px) 100vw, 880px"
            className="object-cover"
          />
        </div>
        {content.caption ? (
          <figcaption
            className="mt-3 flex items-center gap-2 font-mono text-xs tracking-wide"
            style={{ color: "var(--tone-muted)" }}
          >
            <span aria-hidden="true">↳</span> {content.caption}
          </figcaption>
        ) : null}
      </figure>
    </Reveal>
  );
}
