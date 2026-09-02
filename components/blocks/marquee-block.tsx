import type { MarqueeContent } from "@aavrit/core";

const DUR: Record<string, string> = { slow: "38s", normal: "26s", fast: "16s" };

export default function MarqueeBlock({
  content,
  className = "",
}: {
  content: MarqueeContent;
  className?: string;
}) {
  if (!content.items.length) return null;
  const row = (hidden: boolean) => (
    <span className="flex shrink-0 items-center" aria-hidden={hidden}>
      {content.items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span
            className="display px-[clamp(1rem,2.5vw,2rem)] text-[clamp(1.3rem,3vw,2.2rem)] whitespace-nowrap"
            style={{ color: "var(--tone-fg)" }}
          >
            {item}
          </span>
          <span
            aria-hidden="true"
            className="inline-block h-[0.5em] w-[0.5em] rounded-full border-2"
            style={{ background: "var(--tone-card)", borderColor: "var(--tone-fg)" }}
          />
        </span>
      ))}
    </span>
  );
  return (
    <div className={`marquee tone-${content.tone} py-4 ${className}`}>
      <div className="marquee-track" style={{ "--marquee-dur": DUR[content.speed ?? "normal"] } as React.CSSProperties}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
