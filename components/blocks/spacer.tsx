import type { SpacerContent } from "@aavrit/core";

export default function SpacerBlock({
  content,
  className = "",
}: {
  content: SpacerContent;
  className?: string;
}) {
  const h = { sm: "h-8", md: "h-16", lg: "h-28" }[content.size] ?? "h-16";
  if (content.divider) {
    return (
      <div className={`container-x flex items-center gap-4 ${h} ${className}`} aria-hidden="true">
        <span className="h-1 flex-1 rounded-full" style={{ background: "var(--tone-border)" }} />
        <span className="h-2.5 w-2.5 rotate-45" style={{ background: "var(--tone-fg)", opacity: 0.6 }} />
        <span className="h-1 flex-1 rounded-full" style={{ background: "var(--tone-border)" }} />
      </div>
    );
  }
  return <div className={h} aria-hidden="true" />;
}
