import type { Metadata } from "next";
import StoryPage from "@/components/story-page";
import { loadStoryPage, storyMetadata } from "@/lib/pages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return storyMetadata("achievements");
}

export default async function AchievementsPage() {
  const { page, settings, chapterNumber, total, next } = await loadStoryPage("achievements");
  return (
    <StoryPage
      page={page}
      chapterNumber={chapterNumber}
      total={total}
      next={next}
      email={settings.email}
      socialsJson={settings.socials}
      channelsJson={settings.contactChannels}
      mood="#ffd200"
      accentBg="#ffd200"
    />
  );
}
