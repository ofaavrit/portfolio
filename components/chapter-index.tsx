import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/reveal";
import { letterTone } from "@/components/letter-tiles";

const ACCENT_BG: Record<string, string> = {
  pink: "#ff9ec4",
  lilac: "#beb0fa",
  orange: "#ff7134",
  cyan: "#3ef2e4",
  lime: "#ceef32",
  yellow: "#ffd200",
};

/** Home: the story index — every chapter with its number and accent. */
export default function ChapterIndex({
  chapters,
}: {
  chapters: { slug: string; title: string; accent: string; seoDescription: string | null }[];
}) {
  const items = chapters.filter((c) => c.slug !== "__home__");
  return (
    <div className="container-x pad-md">
      <Reveal className="mb-10 flex items-end justify-between gap-6">
        <h2 className="display display-lg" style={{ color: "var(--foreground)" }}>
          The chapters
        </h2>
        <p className="mono-label hidden opacity-60 sm:block" style={{ color: "var(--muted)" }}>
          01 → {String(items.length).padStart(2, "0")}
        </p>
      </Reveal>
      <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((c, i) => {
          const bg = ACCENT_BG[c.accent] ?? "#ffd200";
          void letterTone;
          return (
            <Reveal key={c.slug} delay={i * 0.05}>
              <Link
                href={c.slug === "" ? "/" : `/${c.slug}`}
                className="group flex h-full flex-col"
                aria-label={`Chapter ${i + 1}: ${c.title}`}
              >
                <article className="sticker-soft flex h-full flex-col gap-3 p-5 transition-all duration-200 group-hover:-translate-y-1.5 group-hover:shadow-[8px_8px_0_rgba(17,17,17,0.85)]">
                  <div className="flex items-center justify-between">
                    <span
                      className="tile h-10 w-12 text-base"
                      style={{ "--tile-bg": bg, "--tile-shadow": "#111" } as React.CSSProperties}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight
                      size={19}
                      aria-hidden="true"
                      className="opacity-40 transition-all duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </div>
                  <h3 className="display text-[clamp(1.4rem,2.4vw,1.8rem)] leading-none" style={{ color: "var(--foreground)" }}>
                    {c.title}
                  </h3>
                  <p className="text-sm leading-snug" style={{ color: "var(--muted)" }}>
                    {(c.seoDescription ?? "").slice(0, 92)}
                    {(c.seoDescription ?? "").length > 92 ? "…" : ""}
                  </p>
                </article>
              </Link>
            </Reveal>
          );
        })}
      </ol>
    </div>
  );
}
