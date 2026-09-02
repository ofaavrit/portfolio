import { CSSProperties } from "react";

const TILE_TONES = ["yellow", "cyan", "pink", "lime", "lilac", "orange"] as const;
const TONE_BG: Record<string, { bg: string; shadow: string }> = {
  yellow: { bg: "#ffd200", shadow: "#1b3624" },
  cyan: { bg: "#3ef2e4", shadow: "#ff3873" },
  pink: { bg: "#ff9ec4", shadow: "#3ef2e4" },
  lime: { bg: "#ceef32", shadow: "#1b3624" },
  lilac: { bg: "#beb0fa", shadow: "#ffd200" },
  orange: { bg: "#ff7134", shadow: "#1b3624" },
};

export function letterTone(index: number) {
  return TILE_TONES[index % TILE_TONES.length];
}

export default function LetterTiles({
  text,
  className = "",
  style,
  animateIdle = false,
  tileClassName = "",
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  animateIdle?: boolean;
  tileClassName?: string;
}) {
  const letters = text.split("");
  return (
    <span className={`inline-flex ${className}`} style={style} aria-hidden="true">
      {letters.map((letter, i) => {
        const tone = TONE_BG[letterTone(i)];
        return (
          <span
            key={`${letter}-${i}`}
            data-tile={i}
            className={`tile ${tileClassName}`}
            style={
              {
                "--tile-bg": tone.bg,
                "--tile-shadow": tone.shadow,
                ...(animateIdle
                  ? {
                      animation: `float-soft ${4 + (i % 3)}s ease-in-out ${i * 0.35}s infinite`,
                      "--r": `${(i % 2 === 0 ? -1 : 1) * (1 + (i % 3))}deg`,
                    }
                  : {}),
              } as CSSProperties
            }
          >
            {letter}
          </span>
        );
      })}
    </span>
  );
}
