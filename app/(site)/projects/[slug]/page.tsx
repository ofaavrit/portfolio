import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import BlockRenderer from "@/components/blocks/block-renderer";
import Reveal from "@/components/reveal";
import { getProject, getPublishedProjects, getMediaUrl, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { safeParse, sanitizeUrl } from "@aavrit/core";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return pageMetadata({
    title: `${project.title} — project`,
    description: project.shortDescription,
    slug: `projects/${slug}`,
  });
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const [project, settings, all] = await Promise.all([
    getProject(slug),
    getSettings(),
    getPublishedProjects({}),
  ]);
  if (!project) notFound();

  const index = all.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? all[index - 1] : null;
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : null;
  const thumbUrl = await getMediaUrl(project.thumbnailId);
  const tools = safeParse<string[]>(project.tools, []);
  const liveUrl = sanitizeUrl(project.url);

  return (
    <article>
      {/* case-study header */}
      <header className="container-x pt-[clamp(2.5rem,7vh,5rem)]">
        <Reveal className="flex flex-col gap-6" y={22} intensity="subtle">
          <p className="mono-label opacity-60" style={{ color: "var(--muted)" }}>
            <Link href="/websites" className="link-sweep">
              ← ALL WEBSITES
            </Link>
          </p>
          <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col gap-4">
              <h1 className="display display-hero" style={{ color: "var(--foreground)" }}>
                {project.title}
              </h1>
              <p className="max-w-[48ch] text-[var(--text-md)]" style={{ color: "var(--muted)" }}>
                {project.shortDescription}
              </p>
              {liveUrl ? (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn w-fit"
                >
                  Visit site <ExternalLink size={15} aria-hidden="true" />
                </a>
              ) : null}
            </div>
            {thumbUrl ? (
              <div className="crop-hover sticker overflow-hidden p-0 aspect-[4/3]">
                <Image
                  src={thumbUrl}
                  alt={`${project.title} — visual preview`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>

          {/* meta table */}
          <dl className="grid grid-cols-2 gap-4 border-t-2 pt-6 sm:grid-cols-4" style={{ borderColor: "var(--border)" }}>
            {[
              ["Category", project.category],
              ["Year", project.year ?? "—"],
              ["Role", project.role ?? "Creator"],
              ["Tools", tools.join(" · ") || "AI · Free hosting"],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1">
                <dt className="mono-label opacity-60" style={{ color: "var(--muted)" }}>{k}</dt>
                <dd className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </header>

      {/* case-study body blocks */}
      <div className="mt-10">
        <BlockRenderer
          blocks={project.blocks}
          firstHeadingAsH1={false}
          contactEmail={settings.email}
          socialsJson={settings.socials}
          channelsJson={settings.contactChannels}
        />
      </div>

      {project.longDescription ? (
        <div className="container-x pad-sm">
          <Reveal className="max-w-[62ch] text-[1.05rem] leading-relaxed" style={{ color: "var(--muted)" }}>
            {project.longDescription}
          </Reveal>
        </div>
      ) : null}

      {/* prev / next */}
      <nav aria-label="More websites" className="container-x pad-md grid gap-5 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/projects/${prev.slug}`}
            className="sticker-soft group flex items-center gap-4 p-5 transition-transform duration-200 hover:-translate-y-1"
          >
            <ArrowLeft size={20} aria-hidden="true" className="transition-transform group-hover:-translate-x-1" />
            <span>
              <span className="mono-label block text-[0.62rem] opacity-60" style={{ color: "var(--muted)" }}>PREVIOUS</span>
              <span className="display text-xl" style={{ color: "var(--foreground)" }}>{prev.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className="sticker-soft group flex items-center justify-end gap-4 p-5 text-right transition-transform duration-200 hover:-translate-y-1"
          >
            <span>
              <span className="mono-label block text-[0.62rem] opacity-60" style={{ color: "var(--muted)" }}>NEXT</span>
              <span className="display text-xl" style={{ color: "var(--foreground)" }}>{next.title}</span>
            </span>
            <ArrowRight size={20} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
          </Link>
        ) : null}
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.shortDescription,
            creator: { "@type": "Person", name: settings.fullName },
            dateCreated: project.year ?? undefined,
            keywords: tools.join(", "),
          }),
        }}
      />
    </article>
  );
}
