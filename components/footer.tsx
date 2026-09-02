import Link from "next/link";
import LetterTiles from "./letter-tiles";
import StickerBlast from "./sticker-blast";
import NepalClock from "./nepal-clock";
import type { ContactChannel, SocialLink } from "@aavrit/core";
import { safeParse } from "@aavrit/core";

export default function Footer({
  displayName,
  fullName,
  email,
  footerText,
  socialsJson,
  channelsJson,
  navItems,
}: {
  displayName: string;
  fullName: string;
  email: string;
  footerText: string;
  socialsJson: string;
  channelsJson: string;
  navItems: { id: string; label: string; href: string }[];
}) {
  const socials = safeParse<SocialLink[]>(socialsJson, []).filter((s) => s.url);
  const channels = safeParse<ContactChannel[]>(channelsJson, []).filter((c) => c.value && c.href);
  return (
    <footer
      className="tone-navy mt-[var(--section-gap)] border-t-[3px] border-[#111]"
      style={{ background: "#060029" }}
    >
      <div className="container-x pad-md flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="mono-label mb-4" style={{ color: "#b9b1e0" }}>
              THE STORY ENDS WHERE IT STARTS · <NepalClock />
            </p>
            <Link
              href="/contact"
              className="display display-lg leading-none transition-transform duration-300 hover:-translate-y-1"
              style={{ color: "#fff6ec" }}
            >
              Say hi <span aria-hidden="true">→</span>
            </Link>
          </div>
          <LetterTiles text={displayName.slice(0, 6)} tileClassName="text-2xl h-12 w-12" />
        </div>

        <div className="grid gap-8 border-t pt-8 sm:grid-cols-3" style={{ borderColor: "var(--tone-border)" }}>
          <div>
            <h2 className="mono-label mb-3" style={{ color: "#b9b1e0" }}>REACH ME</h2>
            <ul className="flex flex-col gap-1">
              {channels.map((c) => (
                <li key={c.value}>
                  <a href={c.href} className="link-sweep text-[0.95rem] font-semibold" style={{ color: "#fff6ec" }}>
                    {c.value}
                  </a>
                </li>
              ))}
              {channels.length === 0 ? (
                <li>
                  <a href={`mailto:${email}`} className="link-sweep text-[0.95rem] font-semibold" style={{ color: "#fff6ec" }}>
                    {email}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
          <div>
            <h2 className="mono-label mb-3" style={{ color: "#b9b1e0" }}>CHAPTERS</h2>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {navItems.map((n) => (
                <li key={n.id}>
                  <Link href={n.href} className="link-sweep text-[0.95rem]" style={{ color: "#fff6ec" }}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mono-label mb-3" style={{ color: "#b9b1e0" }}>ELSEWHERE</h2>
            {socials.length > 0 ? (
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-sweep text-[0.95rem]"
                      style={{ color: "#fff6ec" }}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm" style={{ color: "var(--tone-muted)" }}>
                Social links coming soon.
              </p>
            )}
          </div>
        </div>

        <div
          className="flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-sm"
          style={{ borderColor: "rgba(185,177,224,0.35)", color: "#b9b1e0" }}
        >
          <p>{footerText}</p>
          <div className="flex items-center gap-4">
            <StickerBlast />
            <p className="font-hand text-lg" style={{ color: "var(--gold)" }}>
              — {fullName}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
