import type { Metadata } from "next";
import BlockRenderer from "@/components/blocks/block-renderer";
import { getPage, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("contact");
  return pageMetadata({
    title: page?.seoTitle ?? "Contact",
    description: page?.seoDescription,
    slug: "contact",
  });
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getPage("contact"), getSettings()]);
  if (!page || !page.published) {
    return (
      <div className="container-x pad-lg">
        <h1 className="display display-xl">Contact</h1>
        <p className="mt-4">
          This page is not published yet. Reach me at{" "}
          <a className="link-sweep" href={`mailto:${settings.email}`}>
            {settings.email}
          </a>
          .
        </p>
      </div>
    );
  }
  return (
    <BlockRenderer
      blocks={page.blocks}
      firstHeadingAsH1
      contactEmail={settings.email}
      socialsJson={settings.socials}
      channelsJson={settings.contactChannels}
    />
  );
}
