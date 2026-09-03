import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import EntryGate from "@/components/entry-gate";
import CursorPreview from "@/components/cursor-preview";
import ScrollProgress from "@/components/scroll-progress";
import { getNavigation, getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [nav, settings] = await Promise.all([getNavigation(), getSettings()]);
  const navItems = nav.filter((n) => n.visible).map((n) => ({ id: n.id, label: n.label, href: n.href }));

  return (
    <>
      <EntryGate introEnabled={settings.introEnabled} />
      <ScrollProgress />
      <CursorPreview />
      <SiteHeader items={navItems} displayName={settings.displayName} monogram={settings.monogram || "AA"} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer
        displayName={settings.displayName}
        fullName={settings.fullName}
        email={settings.email}
        footerText={settings.footerText}
        socialsJson={settings.socials}
        channelsJson={settings.contactChannels}
        navItems={navItems}
      />
    </>
  );
}
