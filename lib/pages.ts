import { notFound } from "next/navigation";
import { getPage, getSettings, getNavigation } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

/** Shared loader for the seeded story routes. */
export async function loadStoryPage(slug: string) {
  const page = await getPage(slug);
  if (!page || !page.published || page.kind === "CUSTOM") notFound();
  const [settings, nav] = await Promise.all([getSettings(), getNavigation()]);
  const index = nav
    .filter((n) => n.visible)
    .findIndex((n) => n.href === `/${slug}`);
  const chapterNumber = index >= 0 ? index + 1 : null;
  const total = nav.filter((n) => n.visible).length;
  const next = index >= 0 && index + 1 < total ? nav.filter((n) => n.visible)[index + 1] : null;
  return { page, settings, chapterNumber, total, next };
}

export async function storyMetadata(slug: string) {
  const page = await getPage(slug);
  return pageMetadata({
    title: page?.seoTitle ?? page?.title ?? "Page",
    description: page?.seoDescription,
    slug,
  });
}
