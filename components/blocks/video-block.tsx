import { toEmbedUrl, type VideoContent } from "@aavrit/core";

export default function VideoBlock({ content }: { content: VideoContent }) {
  const embed = toEmbedUrl(content.url);
  if (!embed) return null;
  return (
    <div className="mx-auto w-full max-w-[880px]">
      <div className="sticker overflow-hidden p-0">
        <div className="aspect-video w-full">
          <iframe
            src={`${embed}?rel=0`}
            title={content.title}
            loading="lazy"
            allow="accelerometer; encrypted-media; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
