import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";
import { getSettings } from "@/lib/content";
import StickerHunt from "@/components/sticker-hunt";
import { FirebaseAnalytics } from "@/components/firebase-analytics";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: s.defaultSeoTitle,
      template: `%s — ${s.displayName}`,
    },
    description: s.defaultSeoDescription,
    applicationName: s.displayName,
    authors: [{ name: s.fullName }],
    openGraph: {
      type: "website",
      siteName: s.displayName,
      title: s.defaultSeoTitle,
      description: s.defaultSeoDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: s.defaultSeoTitle,
      description: s.defaultSeoDescription,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f0e3" },
    { media: "(prefers-color-scheme: dark)", color: "#060029" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const accentVar: Record<string, string> = {
    pink: "#ff3873",
    cyan: "#0fb8ac",
    yellow: "#e6b800",
    lime: "#9dc422",
    lilac: "#8d78e8",
    orange: "#ff7134",
  };
  const accent = accentVar[s.accent] ?? "#ff3873";
  return (
    <html
      lang="en"
      className={fontVariables}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body
        className={s.typography === "balanced" ? "type-balanced" : undefined}
        style={{ "--accent": accent, "--accent-ink": accent } as React.CSSProperties}
      >
        <FirebaseAnalytics />
        {/* Mark JS availability before first paint. The entry screen and reveal
            animations only run when this class exists — with JavaScript
            disabled the full content renders immediately, nothing is hidden. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
var d=document.documentElement;
d.classList.add("js");
/* Clipboard guard: some browsers/extensions call writeText under a
   permissions policy that blocks it, surfacing a runtime error. Wrap it so
   any such call resolves silently instead of throwing. */
try{
  var cp=navigator.clipboard;
  if(cp&&typeof cp.writeText==="function"){
    var orig=cp.writeText.bind(cp);
    cp.writeText=function(t){try{return orig(t).catch(function(){})}catch(e){return Promise.resolve()}};
  }
}catch(e){}
function reveal(){try{d.classList.remove("gate-pending")}catch(e){}}
/* guaranteed reveal — registered BEFORE anything that could throw */
setTimeout(reveal,1500);
window.addEventListener("error",reveal,true);
try{
if(!sessionStorage.getItem("aavrit:entered"))d.classList.add("gate-pending");
}catch(e){}
})();`,
          }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        {/* the sticker hunt — one collectible per chapter, fully optional */}
        <StickerHunt
          enabled={s.questEnabled !== false}
          title={s.questTitle || "FIND MY WEBSITES"}
          reward={s.questReward || "AND MANY MORE"}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: s.fullName,
              alternateName: s.displayName,
              description: s.defaultSeoDescription,
              email: `mailto:${s.email}`,
              knowsAbout: ["Web development", "AI prompting", "Video editing"],
              address: { "@type": "PostalAddress", addressCountry: s.location },
            }),
          }}
        />
      </body>
    </html>
  );
}
