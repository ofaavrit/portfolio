import Image from "next/image";
import Reveal from "@/components/reveal";
import type { GalleryContent } from "@aavrit/core";

export default function GalleryBlock({
  content,
  resolvedUrls,
}: {
  content: GalleryContent;
  resolvedUrls: Record<number, string | null>;
}) {
  if (!content.items.length) return null;
  const cols = `sm:grid-cols-2 ${content.columns >= 3 ? "lg:grid-cols-3" : ""}`;
  return (
    <div className={`grid grid-cols-1 gap-6 ${cols}`}>
      {content.items.map((item, i) => {
        const src = resolvedUrls[i] ?? item.externalUrl ?? null;
        if (!src) return null;
        return (
          <Reveal key={i} delay={i * 0.06}>
            <figure>
              <div className="crop-hover sticker-soft overflow-hidden p-0 aspect-[4/3]">
                <Image
                  src={src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              {item.caption ? (
                <figcaption
                  className="mt-2 font-mono text-xs"
                  style={{ color: "var(--tone-muted)" }}
                >
                  {item.caption}
                </figcaption>
              ) : null}
            </figure>
          </Reveal>
        );
      })}
    </div>
  );
}
