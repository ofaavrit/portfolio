// ── Shared block content model ─────────────────────────────────────────────
// Every editable region of the public site is a list of typed blocks.
// Blocks are stored in PageBlock.content / Project.blocks as JSON strings and
// validated here before use.

export const BLOCK_TYPES = [
  "hero",
  "text",
  "richText",
  "image",
  "gallery",
  "video",
  "projectGrid",
  "timeline",
  "stats",
  "quote",
  "marquee",
  "cta",
  "embed",
  "contact",
  "coloredSection",
  "spacer",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export type Tone =
  | "paper"
  | "ink"
  | "cream"
  | "accent"
  | "cyan"
  | "yellow"
  | "lilac"
  | "lime"
  | "orange"
  | "navy";

export type AnimationIntensity = "none" | "subtle" | "standard" | "full";

export interface BlockStyle {
  visible: boolean;
  bgTheme: Tone;
  textTheme: "auto" | "forceLight" | "forceDark";
  padding: "sm" | "md" | "lg";
  align: "left" | "center";
  animation: AnimationIntensity;
  hideDesktop: boolean;
  hideTablet: boolean;
  hideMobile: boolean;
}

export const defaultBlockStyle: BlockStyle = {
  visible: true,
  bgTheme: "paper",
  textTheme: "auto",
  padding: "md",
  align: "left",
  animation: "standard",
  hideDesktop: false,
  hideTablet: false,
  hideMobile: false,
};

export interface HeroContent {
  kicker?: string;
  titleLines: string[];
  subtitle?: string;
  meta?: string;
  note?: string;
}
export interface TextContent {
  title?: string;
  lead?: string;
  body: string;
  note?: string;
  scrapbook?: boolean; // render as a taped-in scrapbook cut-out
}
export type ZineVoice = "editorial" | "hand" | "typewriter" | "marker" | "bubbly";
export interface RichTextContent {
  title?: string;
  html: string;
  typewriter?: boolean; // word-by-word reveal with a blinking caret
  voice?: ZineVoice; // which deck typeface this column speaks in
}
export interface ImageContent {
  mediaId?: string | null;
  externalUrl?: string | null;
  alt: string;
  caption?: string;
  ratio: "wide" | "video" | "square" | "tall";
  rounded?: boolean;
}
export interface GalleryItem {
  mediaId?: string | null;
  externalUrl?: string | null;
  alt: string;
  caption?: string;
}
export interface GalleryContent {
  items: GalleryItem[];
  columns: 2 | 3 | 4;
}
export interface VideoContent {
  url: string; // YouTube / Vimeo watch URL, converted to a privacy-friendly embed
  title: string;
}
export interface ProjectGridContent {
  filter: "all" | "featured" | string; // "all" | "featured" | a category name
  limit?: number;
}
export interface TimelineEra {
  label: string;
  title: string;
  accent: Tone;
  items: string[];
}
export interface TimelineContent {
  intro?: string;
  eras: TimelineEra[];
}
export interface StatItem {
  value: string;
  label: string;
  note?: string;
  accent?: Tone;
}
export interface StatsContent {
  title?: string;
  items: StatItem[];
}
export interface QuoteContent {
  text: string;
  attribution?: string;
}
export interface MarqueeContent {
  items: string[];
  tone: string;
  speed?: "slow" | "normal" | "fast";
}
export interface CtaContent {
  title: string;
  body?: string;
  actionLabel: string;
  actionHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  tone: string;
}
export interface EmbedContent {
  title?: string;
  url: string; // youtube/vimeo watch URL → sanitized iframe
  caption?: string;
}
export interface ContactContent {
  title: string;
  body: string;
  showSocials: boolean;
}
export interface ColoredSectionContent {
  tone: string;
  word?: string;
  title?: string;
  body?: string;
  doodle?: "star" | "spark" | "ring" | "squiggle" | "grid";
}
export interface SpacerContent {
  size: "sm" | "md" | "lg";
  divider?: boolean;
}

export type BlockContentMap = {
  hero: HeroContent;
  text: TextContent;
  richText: RichTextContent;
  image: ImageContent;
  gallery: GalleryContent;
  video: VideoContent;
  projectGrid: ProjectGridContent;
  timeline: TimelineContent;
  stats: StatsContent;
  quote: QuoteContent;
  marquee: MarqueeContent;
  cta: CtaContent;
  embed: EmbedContent;
  contact: ContactContent;
  coloredSection: ColoredSectionContent;
  spacer: SpacerContent;
};

export interface Block<T extends BlockType = BlockType> {
  id: string;
  type: T;
  content: BlockContentMap[T];
  style: BlockStyle;
  position: number;
}

/** Discriminated union of all blocks — switch on `type` narrows `content`. */
export type AnyBlock = {
  [K in BlockType]: {
    id: string;
    type: K;
    content: BlockContentMap[K];
    style: BlockStyle;
    position: number;
  };
}[BlockType];

// ── Projects / settings / nav shapes ───────────────────────────────────────

export interface SocialLink {
  label: string;
  url: string;
}

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
}

export interface ProjectSummary {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  status: string;
  featured: boolean;
  year: string | null;
  accent: string;
  thumbnailId: string | null;
  url: string | null;
}

export const RESERVED_SLUGS = [
  "admin",
  "api",
  "work",
  "fonts",
  "art",
  "favicon.ico",
  "sitemap.xml",
  "robots.txt",
  "opengraph-image",
  "login",
  "settings",
  "pages",
  "projects",
  "media",
  "messages",
  "navigation",
  "revisions",
  "dashboard",
];

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug);
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function safeParse<T>(json: string, fallback: T): T {
  try {
    const v = JSON.parse(json);
    return (v ?? fallback) as T;
  } catch {
    return fallback;
  }
}

export const TONES: Tone[] = [
  "paper",
  "ink",
  "cream",
  "accent",
  "cyan",
  "yellow",
  "lilac",
  "lime",
  "orange",
  "navy",
];

export function isTone(v: string): v is Tone {
  return (TONES as string[]).includes(v);
}
