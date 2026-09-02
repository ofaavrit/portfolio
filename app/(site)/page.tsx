import type { Metadata } from "next";
import BlockRenderer from "@/components/blocks/block-renderer";
import ChapterIndex from "@/components/chapter-index";
import { getPage, getSettings, getStoryPages } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("");
  const s = await getSettings();
  return pageMetadata({
    title: page?.seoTitle ?? s.defaultSeoTitle,
    description: page?.seoDescription ?? s.defaultSeoDescription,
    slug: "",
  });
}

export default async function HomePage() {
  const [page, chapters, settings] = await Promise.all([
    getPage(""),
    getStoryPages(),
    getSettings(),
  ]);
  if (!page || !page.published) {
    const dbConfigured = Boolean(process.env.DATABASE_URL);
    return (
      <div className="container-x pad-lg">
        <h1 className="display display-xl">Coming soon</h1>
        {dbConfigured ? (
          <p className="mt-4 opacity-70">This story has not been published yet.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            <p className="opacity-70">The story is one environment variable away.</p>
            <p className="max-w-[52ch] rounded-xl border-2 border-[#111] bg-[#ffd200] p-4 text-sm font-semibold" style={{ color: "#111" }}>
              Owner setup: add <code>DATABASE_URL</code> (the Supabase session-pooler URL) to this
              project&apos;s environment variables, then redeploy. The full story is already waiting
              in the database.
            </p>
          </div>
        )}
      </div>
    );
  }
  return (
    <>
      <BlockRenderer blocks={page.blocks} firstHeadingAsH1 contactEmail={settings.email} socialsJson={settings.socials} channelsJson={settings.contactChannels} />
      <ChapterIndex chapters={chapters} />
    </>
  );
}
