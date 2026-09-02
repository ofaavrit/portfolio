import type { Metadata } from "next";
import StoryPage from "@/components/story-page";
import { loadStoryPage, storyMetadata } from "@/lib/pages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return storyMetadata("hobbies");
}

export default async function HobbiesPage() {
  const { page, settings, chapterNumber, total, next } = await loadStoryPage("hobbies");
  return (
    <StoryPage
      page={page}
      chapterNumber={chapterNumber}
      total={total}
      next={next}
      email={settings.email}
      socialsJson={settings.socials}
      channelsJson={settings.contactChannels}
      mood="#ff7134"
      accentBg="#ff7134"
    />
  );
}
