import { toEmbedUrl, type EmbedContent } from "@aavrit/core";

export default function EmbedBlock({ content }: { content: EmbedContent }) {
  const embed = toEmbedUrl(content.url);
  if (!embed) return null;
  return (
    <div className="mx-auto w-full max-w-[880px]">
      {content.title ? (
        <h2 className="display text-xl mb-4" style={{ color: "var(--tone-fg)" }}>
          {content.title}
        </h2>
      ) : null}
      <div className="sticker overflow-hidden p-0">
        <div className="aspect-video w-full">
          <iframe
            src={embed}
            title={content.title ?? "Embedded video"}
            loading="lazy"
            allow="accelerometer; encrypted-media; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      </div>
      {content.caption ? (
        <p className="mt-2 font-mono text-xs" style={{ color: "var(--tone-muted)" }}>
          {content.caption}
        </p>
      ) : null}
    </div>
  );
}
