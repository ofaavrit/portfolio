import type { MetadataRoute } from "next";
import { getAllPageSlugs, getAllProjectSlugs } from "@/lib/content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try {
    const [pages, projects] = await Promise.all([
      getAllPageSlugs(),
      getAllProjectSlugs(),
    ]);
    return [
      ...pages.map((p) => ({
        url: p.slug === "__home__" ? `${base}/` : `${base}/${p.slug}`,
        lastModified: p.updatedAt || undefined,
        changeFrequency: "monthly" as const,
        priority: p.slug === "__home__" ? 1 : 0.8,
      })),
      ...projects.map((p) => ({
        url: `${base}/projects/${p.slug}`,
        lastModified: p.updatedAt || undefined,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return [{ url: `${base}/`, changeFrequency: "monthly" as const, priority: 1 }];
  }
}
