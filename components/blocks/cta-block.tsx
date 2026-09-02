import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/reveal";
import MagneticButton from "@/components/magnetic-button";
import type { CtaContent } from "@aavrit/core";

const BTN: Record<string, string> = {
  pink: "",
  yellow: "btn-yellow",
  cyan: "btn-cyan",
  ink: "btn-ink",
};

export default function CtaBlock({
  content,
  center = false,
}: {
  content: CtaContent;
  center?: boolean;
}) {
  return (
    <Reveal
      className={`flex flex-col gap-6 ${center ? "items-center text-center" : ""}`}
      intensity="subtle"
    >
      <h2 className="display display-lg max-w-[22ch]" style={{ color: "var(--tone-fg)" }}>
        {content.title}
      </h2>
      {content.body ? (
        <p className="max-w-[52ch] text-[var(--text-md)]" style={{ color: "var(--tone-muted)" }}>
          {content.body}
        </p>
      ) : null}
      <div className={`flex flex-wrap gap-4 ${center ? "justify-center" : ""}`}>
        <MagneticButton>
          <Link href={content.actionHref} className={`btn ${BTN[content.tone] ?? ""}`}>
            {content.actionLabel} <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </MagneticButton>
        {content.secondaryLabel && content.secondaryHref ? (
          <MagneticButton>
            <Link href={content.secondaryHref} className="btn btn-ghost">
              {content.secondaryLabel}
            </Link>
          </MagneticButton>
        ) : null}
      </div>
    </Reveal>
  );
}
