import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlockRenderer from "@/components/blocks/block-renderer";
import PageHeader from "@/components/page-header";
import { getPage, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { isReservedSlug } from "@aavrit/core";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (isReservedSlug(slug)) return {};
  const page = await getPage(slug);
  if (!page) return {};
  return pageMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription,
    slug,
  });
}

/** Custom pages created from the admin panel land here. */
export default async function CustomPage({ params }: Params) {
  const { slug } = await params;
  if (isReservedSlug(slug)) notFound();
  const [page, settings] = await Promise.all([getPage(slug), getSettings()]);
  if (!page || !page.published) notFound();
  return (
    <>
      <PageHeader kicker="FROM THE NOTEBOOK" title={page.title} />
      <BlockRenderer
        blocks={page.blocks}
        firstHeadingAsH1={false}
        contactEmail={settings.email}
        socialsJson={settings.socials}
        channelsJson={settings.contactChannels}
      />
    </>
  );
}
