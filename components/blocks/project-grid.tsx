"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { ProjectGridContent } from "@aavrit/core";

export interface GridProject {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  featured: boolean;
  year: string | null;
  accent: string;
  url: string | null;
  thumbUrl: string | null;
}

const ACCENT_TILE: Record<string, { bg: string; fg: string }> = {
  pink: { bg: "#ff9ec4", fg: "#33021a" },
  cyan: { bg: "#3ef2e4", fg: "#01444f" },
  yellow: { bg: "#ffd200", fg: "#1b3624" },
  lime: { bg: "#ceef32", fg: "#1b3624" },
  lilac: { bg: "#beb0fa", fg: "#1f123a" },
  orange: { bg: "#ff7134", fg: "#331100" },
};

export default function ProjectGridBlock({
  content,
  projects,
}: {
  content: ProjectGridContent;
  projects: GridProject[];
}) {
  const categories = useMemo(() => {
    const set = new Map<string, number>();
    projects.forEach((p) => set.set(p.category, (set.get(p.category) ?? 0) + 1));
    return Array.from(set.entries());
  }, [projects]);

  const [active, setActive] = useState<string>(() =>
    content.filter === "featured" ? "__featured" : "all",
  );

  const visible = useMemo(() => {
    if (content.filter === "featured" && active === "__featured")
      return projects.filter((p) => p.featured);
    if (active === "all") return projects;
    if (active === "__featured") return projects.filter((p) => p.featured);
    return projects.filter((p) => p.category === active);
  }, [projects, active, content.filter]);

  const select = (key: string) => {
    setActive(key);
    // keep filter state in the URL (shareable, back-button friendly)
    const url = new URL(window.location.href);
    if (key === "all") url.searchParams.delete("filter");
    else url.searchParams.set("filter", key);
    window.history.replaceState(null, "", url.toString());
  };

  return (
    <div className="flex flex-col gap-8">
      <div
        role="group"
        aria-label="Filter projects by category"
        className="flex flex-wrap gap-2.5"
      >
        {[["all", "All"], ...categories.map(([c]) => [c, c]), ["__featured", "Featured"]].map(
          ([key, label]) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => select(key)}
                aria-pressed={isActive}
                className={`min-h-11 rounded-full border-2 border-[#111] px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-all duration-150 ${
                  isActive
                    ? "translate-x-[2px] translate-y-[2px] bg-[#ffd200] shadow-none"
                    : "bg-[var(--tone-card)] shadow-[3px_3px_0_#111] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_#111]"
                }`}
                style={{ color: "#111" }}
              >
                {label}
              </button>
            );
          },
        )}
      </div>

      <ul className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => {
            const tone = ACCENT_TILE[p.accent] ?? ACCENT_TILE.pink;
            return (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 24, rotate: i % 2 ? 1.5 : -1.5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.32, ease: [0.22, 0.61, 0.21, 1] }}
              >
                <Link
                  href={`/projects/${p.slug}`}
                  data-preview-src={p.thumbUrl ?? undefined}
                  data-preview-label={p.title}
                  className="group flex h-full flex-col"
                  aria-label={`${p.title} — ${p.shortDescription}`}
                >
                  <article className="tilt-card sticker flex h-full flex-col overflow-hidden p-0">
                    <div className="crop-hover relative aspect-[4/3] w-full overflow-hidden border-b-2 border-[#111]">
                      {p.thumbUrl ? (
                        <Image
                          src={p.thumbUrl}
                          alt={`${p.title} preview`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div
                          className="flex h-full w-full items-center justify-center dots"
                          style={{ background: tone.bg }}
                        >
                          <span className="display text-5xl" style={{ color: tone.fg }}>
                            {p.title.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {p.featured ? (
                        <span
                          className="pill absolute right-3 top-3 gap-1.5 border-[#111] text-[0.62rem]"
                          style={{ background: "#ffd200", color: "#111" }}
                        >
                          <Sparkles size={12} aria-hidden="true" /> DREAM
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-5" style={{ background: "var(--tone-card)" }}>
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="display text-2xl" style={{ color: "var(--tone-oncard)" }}>
                          {p.title}
                        </h3>
                        <ArrowUpRight
                          size={20}
                          aria-hidden="true"
                          className="shrink-0 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1"
                          style={{ color: "var(--tone-oncard)" }}
                        />
                      </div>
                      <p className="text-sm leading-snug" style={{ color: "var(--tone-muted)" }}>
                        {p.shortDescription}
                      </p>
                      <p className="mono-label mt-auto pt-2 text-[0.62rem]" style={{ color: "var(--tone-muted)" }}>
                        {p.category} {p.year ? `· ${p.year}` : ""}
                      </p>
                    </div>
                  </article>
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      {visible.length === 0 ? (
        <p className="hand-note text-center text-2xl opacity-70" style={{ color: "var(--tone-fg)" }}>
          nothing here yet — check another shelf
        </p>
      ) : null}
    </div>
  );
}
