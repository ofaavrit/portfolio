import type { AnyBlock, BlockType, BlockStyle } from "@aavrit/core";
import { defaultBlockStyle, isTone, safeParse } from "@aavrit/core";
import type { ContactChannel } from "@aavrit/core";
import { fsGet, fsList } from "./fsdb";
import snapshotJson from "../data/portfolio-snapshot.json";

/* The bundled snapshot mirrors exactly what is seeded in Firestore. It is the
 * fail-soft fallback so the public site renders the REAL story even while
 * Firestore rules are still being opened up. */
const snapshot = snapshotJson as unknown as {
  settings: Record<string, unknown>;
  pages: Row[];
  projects: Record<string, unknown>[];
  media: Record<string, unknown>[];
  navigation: Record<string, unknown>[];
};

type Row = Record<string, unknown> & {
  slug?: string;
  kind?: string;
  published?: boolean;
  position?: number;
  status?: string;
};

export interface SiteNav {
  items: { id: string; label: string; href: string; visible: boolean }[];
}

const byPosition = (a: Row, b: Row) => (Number(a.position) ?? 0) - (Number(b.position) ?? 0);

export async function getNavigation() {
  const rows = (await fsList("navigation")) ?? (snapshot.navigation as Row[]);
  return rows
    .filter((r) => r.visible !== false)
    .slice()
    .sort(byPosition) as {
    id: string;
    label: string;
    href: string;
    visible: boolean;
    position: number;
  }[];
}

export async function getSettings() {
  const live = await fsGet("settings", "default");
  return (live ?? snapshot.settings) as {
    id: string;
    displayName: string;
    fullName: string;
    monogram: string;
    email: string;
    location: string;
    availability: string;
    socials: string;
    contactChannels: string;
    defaultSeoTitle: string;
    defaultSeoDescription: string;
    ogImageId: string | null;
    accent: string;
    typography: string;
    introEnabled: boolean;
    reducedMotionFallback: boolean;
    questEnabled: boolean;
    questTitle: string;
    questReward: string;
    footerText: string;
    updatedAt: string;
  };
}

export interface PageWithBlocks {
  id: string;
  slug: string;
  title: string;
  kind: string;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
  position: number;
  accent: string;
  blocks: AnyBlock[];
}

export interface BlockRow {
  id: string;
  pageId?: string;
  type: string;
  content: unknown;
  visible: boolean;
  bgTheme: string | null;
  textTheme: string | null;
  padding: string;
  align: string;
  animation: string;
  hideDesktop: boolean;
  hideTablet: boolean;
  hideMobile: boolean;
  position: number;
}

export function toBlock(row: BlockRow): AnyBlock {
  const fallbackContent: Record<BlockType, unknown> = {
    hero: { titleLines: [] },
    text: { body: "" },
    richText: { html: "" },
    image: { alt: "" },
    gallery: { items: [], columns: 2 },
    video: { url: "", title: "" },
    projectGrid: { filter: "all" },
    timeline: { eras: [] },
    stats: { items: [] },
    quote: { text: "" },
    marquee: { items: [], tone: "ink" },
    cta: { title: "", actionLabel: "", actionHref: "/", tone: "pink" },
    embed: { url: "" },
    contact: { title: "", body: "", showSocials: true },
    coloredSection: { tone: "yellow" },
    spacer: { size: "md" },
  };
  const style: BlockStyle = {
    ...defaultBlockStyle,
    visible: row.visible,
    ...(row.bgTheme != null && isTone(row.bgTheme) ? { bgTheme: row.bgTheme } : {}),
    padding: (["sm", "md", "lg"] as const).includes(row.padding as "sm")
      ? (row.padding as BlockStyle["padding"])
      : "md",
    align: row.align === "center" ? "center" : "left",
    animation: (["none", "subtle", "standard", "full"] as const).includes(
      row.animation as "none",
    )
      ? (row.animation as BlockStyle["animation"])
      : "standard",
    hideDesktop: row.hideDesktop,
    hideTablet: row.hideTablet,
    hideMobile: row.hideMobile,
  };
  return {
    id: row.id,
    type: row.type as BlockType,
    content: safeParse(
      typeof row.content === "string" ? row.content : JSON.stringify(row.content ?? "{}"),
      fallbackContent[row.type as BlockType],
    ) as never,
    style,
    position: row.position,
  } as AnyBlock;
}

const HOME_SLUG = "__home__";

type PageRow = Row & {
  title: string;
  blocks: BlockRow[];
};

export async function getPage(slug: string): Promise<PageWithBlocks | null> {
  const key = slug === "" ? HOME_SLUG : slug;
  const rows = (await fsList("pages")) ?? (snapshot.pages as Row[]);
  const page = rows.find((p) => p.slug === key) as PageRow | undefined;
  if (!page) return null;
  const blocks = (page.blocks ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map(toBlock);
  return {
    id: String(page.id),
    slug: String(page.slug),
    title: String(page.title),
    kind: String(page.kind ?? "STORY"),
    seoTitle: (page.seoTitle as string) ?? null,
    seoDescription: (page.seoDescription as string) ?? null,
    published: page.published !== false,
    position: Number(page.position) ?? 0,
    accent: String(page.accent ?? "pink"),
    blocks,
  };
}

export async function getStoryPages() {
  const rows = (await fsList("pages")) ?? (snapshot.pages as Row[]);
  return rows
    .filter((p) => ["STORY", "SYSTEM"].includes(String(p.kind)) && p.published !== false)
    .slice()
    .sort(byPosition)
    .map((p) => ({
      slug: String(p.slug),
      title: String(p.title),
      position: Number(p.position) ?? 0,
      accent: String(p.accent ?? "pink"),
      seoDescription: (p.seoDescription as string) ?? null,
    }));
}

export async function getAllPageSlugs() {
  const rows = (await fsList("pages")) ?? (snapshot.pages as Row[]);
  return rows
    .filter((p) => p.published !== false && p.slug !== "editorial-notes")
    .map((p) => ({ slug: String(p.slug), updatedAt: String(p.updatedAt ?? "") }));
}

export async function getPublishedProjects(filter?: {
  featuredOnly?: boolean;
  limit?: number;
}) {
  const rows = (await fsList("projects")) ?? (snapshot.projects as Row[]);
  return rows
    .filter(
      (p) =>
        p.status === "PUBLISHED" &&
        (!filter?.featuredOnly || p.featured === true),
    )
    .slice()
    .sort(byPosition)
    .slice(0, filter?.limit ?? undefined)
    .map((p) => ({
      id: String(p.id),
      slug: String(p.slug),
      title: String(p.title),
      shortDescription: String(p.shortDescription ?? ""),
      category: String(p.category ?? ""),
      featured: p.featured === true,
      year: p.year == null ? null : String(p.year),
      accent: String(p.accent ?? "pink"),
      thumbnailId: (p.thumbnailId as string) ?? null,
      url: (p.url as string) ?? null,
    }));
}

export interface ProjectDetail {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string | null;
  url: string | null;
  category: string;
  status: string;
  featured: boolean;
  year: string | null;
  role: string | null;
  tools: string;
  accent: string;
  thumbnailId: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  blocks: AnyBlock[];
}

export async function getProject(slug: string): Promise<ProjectDetail | null> {
  const rows = (await fsList("projects")) ?? (snapshot.projects as Row[]);
  const project = rows.find((p) => p.slug === slug);
  if (!project || project.status !== "PUBLISHED") return null;
  const blocks: AnyBlock[] = safeParse<AnyBlock[]>(
    typeof project.blocks === "string" ? project.blocks : JSON.stringify(project.blocks ?? "[]"),
    [],
  );
  return {
    id: String(project.id),
    slug: String(project.slug),
    title: String(project.title ?? ""),
    shortDescription: String(project.shortDescription ?? ""),
    longDescription: (project.longDescription as string) ?? null,
    url: (project.url as string) ?? null,
    category: String(project.category ?? ""),
    status: String(project.status ?? "PUBLISHED"),
    featured: project.featured === true,
    year: project.year == null ? null : String(project.year),
    role: (project.role as string) ?? null,
    tools: String(project.tools ?? "[]"),
    accent: String(project.accent ?? "pink"),
    thumbnailId: (project.thumbnailId as string) ?? null,
    position: Number(project.position) || 0,
    createdAt: String(project.createdAt ?? ""),
    updatedAt: String(project.updatedAt ?? ""),
    blocks,
  };
}

export async function getAllProjectSlugs() {
  const rows = (await fsList("projects")) ?? (snapshot.projects as Row[]);
  return rows
    .filter((p) => p.status === "PUBLISHED")
    .map((p) => ({ slug: String(p.slug), updatedAt: String(p.updatedAt ?? "") }));
}

export async function getMediaUrl(id: string | null | undefined): Promise<string | null> {
  if (!id) return null;
  const rows = (await fsList("media")) ?? (snapshot.media as Row[]);
  const asset = rows.find((m) => m.id === id) as { id: string; url?: string | null } | undefined;
  if (!asset) return null;
  return asset.url ?? `/api/media/${asset.id}`;
}

export type { AnyBlock } from "@aavrit/core";

export function parseChannels(json: string | null | undefined): ContactChannel[] {
  return safeParse<ContactChannel[]>(json ?? "[]", []).filter((c) => c.value && c.href);
}
