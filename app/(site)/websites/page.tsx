import type { Metadata } from "next";
import StoryPage from "@/components/story-page";
import { loadStoryPage, storyMetadata } from "@/lib/pages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return storyMetadata("websites");
}

export default async function WebsitesPage() {
  const { page, settings, chapterNumber, total, next } = await loadStoryPage("websites");
  return (
    <StoryPage
      page={page}
      chapterNumber={chapterNumber}
      total={total}
      next={next}
      email={settings.email}
      socialsJson={settings.socials}
      channelsJson={settings.contactChannels}
      mood="#ceef32"
      accentBg="#ceef32"
    />
  );
}
