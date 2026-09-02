import type { Metadata } from "next";

export function pageMetadata(opts: {
  title: string;
  description?: string | null;
  slug?: string;
  ogTitle?: string;
}): Metadata {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = opts.slug !== undefined ? new URL(opts.slug, base).toString() : undefined;
  return {
    title: opts.title,
    description: opts.description ?? undefined,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title: opts.ogTitle ?? opts.title,
      description: opts.description ?? undefined,
      ...(url ? { url } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.ogTitle ?? opts.title,
      description: opts.description ?? undefined,
    },
  };
}
