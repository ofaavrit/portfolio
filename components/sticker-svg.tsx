import type { SVGProps, ReactElement } from "react";

/**
 * The sticker box — cut-out doodles in the spirit of the owner's PDF deck.
 * Inline SVG only (no network, no fonts); every glyph is safe to reuse
 * anywhere including the sticker hunt, the footer blast and admin previews.
 */

export type StickerName =
  | "tileA"
  | "star"
  | "flower"
  | "cassette"
  | "bolt"
  | "cursor"
  | "trophy"
  | "heart";

const G: Record<StickerName, (p: SVGProps<SVGSVGElement>) => ReactElement> = {
  tileA: (p) => (
    <svg viewBox="0 0 48 48" fill="none" {...p}>
      <rect x="4" y="6" width="34" height="34" rx="6" fill="#ffd200" stroke="#111" strokeWidth="3" />
      <path d="M12 33 L21 14 L30 33 M15.5 27 H26.5" stroke="#111" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="33" y="26" width="11" height="11" rx="3" fill="#3ef2e4" stroke="#111" strokeWidth="2.6" />
    </svg>
  ),
  star: (p) => (
    <svg viewBox="0 0 48 48" fill="none" {...p}>
      <path d="M24 4 L29.6 18.2 L44.8 19.4 L33.2 29.2 L36.9 44 L24 35.8 L11.1 44 L14.8 29.2 L3.2 19.4 L18.4 18.2 Z" fill="#ff9ec4" stroke="#111" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="19" cy="22" r="2.4" fill="#111" />
      <circle cx="29" cy="22" r="2.4" fill="#111" />
      <path d="M20 28 Q24 31.5 28 28" stroke="#111" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  ),
  flower: (p) => (
    <svg viewBox="0 0 48 48" fill="none" {...p}>
      <circle cx="24" cy="13" r="8" fill="#ceef32" stroke="#111" strokeWidth="3" />
      <circle cx="35" cy="24" r="8" fill="#7ed957" stroke="#111" strokeWidth="3" />
      <circle cx="24" cy="35" r="8" fill="#ceef32" stroke="#111" strokeWidth="3" />
      <circle cx="13" cy="24" r="8" fill="#7ed957" stroke="#111" strokeWidth="3" />
      <circle cx="24" cy="24" r="6.6" fill="#ffd200" stroke="#111" strokeWidth="3" />
    </svg>
  ),
  cassette: (p) => (
    <svg viewBox="0 0 48 48" fill="none" {...p}>
      <rect x="3" y="9" width="42" height="30" rx="5" fill="#beb0fa" stroke="#111" strokeWidth="3" />
      <rect x="9" y="15" width="30" height="12" rx="3" fill="#fff6ec" stroke="#111" strokeWidth="2.6" />
      <circle cx="16" cy="21" r="3.4" fill="#111" />
      <circle cx="32" cy="21" r="3.4" fill="#111" />
      <path d="M14 33 Q24 39 34 33" stroke="#111" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  bolt: (p) => (
    <svg viewBox="0 0 48 48" fill="none" {...p}>
      <path d="M27 3 L10 28 H22 L19 45 L38 18 H25 Z" fill="#ff7134" stroke="#111" strokeWidth="3" strokeLinejoin="round" />
      <path d="M23 12 L15 24" stroke="#fff6ec" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  ),
  cursor: (p) => (
    <svg viewBox="0 0 48 48" fill="none" {...p}>
      <path d="M10 5 L38 24 L26 26 L32 41 L26 43.5 L20 28.5 L10 36 Z" fill="#3ef2e4" stroke="#111" strokeWidth="3" strokeLinejoin="round" />
      <path d="M14 10 L22 16" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  ),
  trophy: (p) => (
    <svg viewBox="0 0 48 48" fill="none" {...p}>
      <path d="M12 6 H36 V18 C36 26 31 31 24 31 C17 31 12 26 12 18 Z" fill="#ffd200" stroke="#111" strokeWidth="3" />
      <path d="M12 10 H5 C5 18 8 22 13 23 M36 10 H43 C43 18 40 22 35 23" stroke="#111" strokeWidth="3" fill="none" />
      <path d="M20 31 L19 38 H29 L28 31 M15 42 H33" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 12 L25.8 16.2 L30 17 L27 20 L27.8 24.4 L24 22.2 L20.2 24.4 L21 20 L18 17 L22.2 16.2 Z" fill="#ff3873" />
    </svg>
  ),
  heart: (p) => (
    <svg viewBox="0 0 48 48" fill="none" {...p}>
      <path d="M24 42 C10 32 4 25 4 17 C4 10 9 6 15 6 C19 6 22.4 8.2 24 12 C25.6 8.2 29 6 33 6 C39 6 44 10 44 17 C44 25 38 32 24 42 Z" fill="#ff5055" stroke="#111" strokeWidth="3" />
      <path d="M12 14 Q14 11 17.5 11.6" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </svg>
  ),
};

export const STICKER_NAMES = Object.keys(G) as StickerName[];

export default function StickerGlyph({
  name,
  size = 34,
  ...rest
}: { name: StickerName; size?: number } & SVGProps<SVGSVGElement>) {
  const C = G[name];
  return <C width={size} height={size} aria-hidden="true" {...rest} />;
}
