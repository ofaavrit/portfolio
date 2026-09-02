import type { Metadata } from "next";
import StoryPage from "@/components/story-page";
import { loadStoryPage, storyMetadata } from "@/lib/pages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return storyMetadata("interests");
}

export default async function InterestsPage() {
  const { page, settings, chapterNumber, total, next } = await loadStoryPage("interests");
  return (
    <StoryPage
      page={page}
      chapterNumber={chapterNumber}
      total={total}
      next={next}
      email={settings.email}
      socialsJson={settings.socials}
      channelsJson={settings.contactChannels}
      mood="#ff9ec4"
      accentBg="#ff9ec4"
    />
  );
}
