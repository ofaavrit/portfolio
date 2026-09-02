import type { AnyBlock, ContactChannel, SocialLink } from "@aavrit/core";
import { safeParse } from "@aavrit/core";
import HeroBlock from "./hero";
import TextBlock from "./text-block";
import RichTextBlock from "./rich-text";
import ImageBlock from "./image-block";
import GalleryBlock from "./gallery";
import VideoBlock from "./video-block";
import ProjectGridBlock from "./project-grid";
import TimelineBlock from "./timeline";
import StatsBlock from "./stats";
import QuoteBlock from "./quote";
import MarqueeBlock from "./marquee-block";
import CtaBlock from "./cta-block";
import EmbedBlock from "./embed";
import ContactBlock from "./contact-block";
import ColoredSectionBlock from "./colored-section";
import SpacerBlock from "./spacer";
import { getMediaUrl, getPublishedProjects } from "@/lib/content";

const PAD: Record<string, string> = {
  sm: "pad-sm",
  md: "pad-md",
  lg: "pad-lg",
};

function visibilityClasses(block: AnyBlock): string {
  return [
    block.style.hideDesktop ? "block-hide-desktop" : "",
    block.style.hideTablet ? "block-hide-tablet" : "",
    block.style.hideMobile ? "block-hide-mobile" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export default async function BlockRenderer({
  blocks,
  firstHeadingAsH1 = false,
  contactEmail,
  socialsJson = "[]",
  channelsJson = "[]",
}: {
  blocks: AnyBlock[];
  firstHeadingAsH1?: boolean;
  contactEmail?: string;
  socialsJson?: string;
  channelsJson?: string;
}) {
  const socials = safeParse<SocialLink[]>(socialsJson, []).filter((s) => s.url);
  const channels = safeParse<ContactChannel[]>(channelsJson, []).filter((c) => c.value && c.href);
  const visibleBlocks = blocks.filter((b) => b.style.visible);
  // The first visible block carries the h1 when the page has no header above it.
  const h1Index = firstHeadingAsH1 && visibleBlocks.length > 0 ? 0 : -1;

  const rendered = await Promise.all(
    visibleBlocks.map(async (block, blockIndex) => {
        const heading: "h1" | "h2" = blockIndex === h1Index ? "h1" : "h2";

        const shellClass = [
          "tone-" + block.style.bgTheme,
          PAD[block.style.padding] ?? "pad-md",
          block.style.align === "center" ? "text-center" : "text-left",
          visibilityClasses(block),
          "cv-auto",
        ].join(" ");
        const shellStyle = {
          color: "var(--tone-fg)",
          background: "var(--tone-bg)",
        } as React.CSSProperties;
        const key = block.id;
        const anim = block.style.animation;

        switch (block.type) {
          case "hero":
            return (
              <section key={key} className={shellClass} style={shellStyle}>
                <div className="container-x">
                  <HeroBlock content={block.content} anim={anim} />
                </div>
              </section>
            );
          case "text":
            return (
              <section key={key} className={shellClass} style={shellStyle}>
                <div className="container-x">
                  <TextBlock
                    content={block.content}
                    heading={heading}
                    anim={anim}
                    center={block.style.align === "center"}
                  />
                </div>
              </section>
            );
          case "richText":
            return (
              <section key={key} className={shellClass} style={shellStyle}>
                <div className="container-x">
                  <RichTextBlock
                    content={block.content}
                    heading={heading}
                    tone={block.style.bgTheme}
                    anim={anim}
                    center={block.style.align === "center"}
                  />
                </div>
              </section>
            );
          case "image": {
            const resolvedUrl = await getMediaUrl(block.content.mediaId);
            return (
              <section key={key} className={shellClass} style={shellStyle}>
                <div className="container-x">
                  <ImageBlock content={block.content} resolvedUrl={resolvedUrl} />
                </div>
              </section>
            );
          }
          case "gallery": {
            const resolvedUrls: Record<number, string | null> = {};
            await Promise.all(
              block.content.items.map(async (item, i) => {
                resolvedUrls[i] = await getMediaUrl(item.mediaId);
              }),
            );
            return (
              <section key={key} className={shellClass} style={shellStyle}>
                <div className="container-x">
                  <GalleryBlock content={block.content} resolvedUrls={resolvedUrls} />
                </div>
              </section>
            );
          }
          case "video":
            return (
              <section key={key} className={shellClass} style={shellStyle}>
                <div className="container-x">
                  <VideoBlock content={block.content} />
                </div>
              </section>
            );
          case "projectGrid": {
            const projects = await getPublishedProjects({});
            const withThumbs = await Promise.all(
              projects.map(async (p) => ({
                ...p,
                thumbUrl: await getMediaUrl(p.thumbnailId),
              })),
            );
            return (
              <section key={key} className={shellClass} style={shellStyle}>
                <div className="container-x">
                  <ProjectGridBlock content={block.content} projects={withThumbs} />
                </div>
              </section>
            );
          }
          case "timeline":
            return (
              <section key={key} className={shellClass} style={shellStyle}>
                <div className="container-x">
                  <TimelineBlock content={block.content} anim={anim} />
                </div>
              </section>
            );
          case "stats":
            return (
              <section key={key} className={shellClass} style={shellStyle}>
                <div className="container-x">
                  <StatsBlock content={block.content} heading={heading} anim={anim} />
                </div>
              </section>
            );
          case "quote":
            return (
              <section key={key} className={shellClass} style={shellStyle}>
                <div className="container-x">
                  <QuoteBlock
                    content={block.content}
                    tone={block.style.bgTheme}
                    anim={anim}
                    center={block.style.align === "center"}
                  />
                </div>
              </section>
            );
          case "marquee":
            return (
              <MarqueeBlock
                key={key}
                content={block.content}
                className={visibilityClasses(block)}
              />
            );
          case "cta":
            return (
              <section key={key} className={shellClass} style={shellStyle}>
                <div className="container-x">
                  <CtaBlock content={block.content} center={block.style.align === "center"} />
                </div>
              </section>
            );
          case "embed":
            return (
              <section key={key} className={shellClass} style={shellStyle}>
                <div className="container-x">
                  <EmbedBlock content={block.content} />
                </div>
              </section>
            );
          case "contact":
            return (
              <section key={key} className={shellClass} style={shellStyle}>
                <div className="container-x">
                  <ContactBlock
                    content={block.content}
                    heading={heading}
                    email={contactEmail ?? "hello@aavrit.test"}
                    socials={socials}
                    channels={channels}
                  />
                </div>
              </section>
            );
          case "coloredSection":
            return (
              <section key={key} className={shellClass} style={shellStyle}>
                <ColoredSectionBlock content={block.content} anim={anim} />
              </section>
            );
          case "spacer":
            return <SpacerBlock key={key} content={block.content} className={visibilityClasses(block)} />;
          default:
            return null;
        }
      }),
  );
  return <>{rendered}</>;
}
