import type { Metadata } from "next";
import StoryPage from "@/components/story-page";
import { loadStoryPage, storyMetadata } from "@/lib/pages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return storyMetadata("digital-world");
}

export default async function DigitalWorldPage() {
  const { page, settings, chapterNumber, total, next } = await loadStoryPage("digital-world");
  return (
    <StoryPage
      page={page}
      chapterNumber={chapterNumber}
      total={total}
      next={next}
      email={settings.email}
      socialsJson={settings.socials}
      channelsJson={settings.contactChannels}
      mood="#3ef2e4"
      accentBg="#3ef2e4"
    />
  );
}
