import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AAVRIT — the interactive autobiography of Aavrit Gupta";

const TILES: { bg: string; shadow: string; letter: string }[] = [
  { bg: "#ffd200", shadow: "#1b3624", letter: "A" },
  { bg: "#3ef2e4", shadow: "#ff3873", letter: "A" },
  { bg: "#ff9ec4", shadow: "#3ef2e4", letter: "V" },
  { bg: "#ceef32", shadow: "#1b3624", letter: "R" },
  { bg: "#beb0fa", shadow: "#ffd200", letter: "I" },
  { bg: "#ff7134", shadow: "#1b3624", letter: "T" },
];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 44,
          background: "#f5f0e3",
          backgroundImage:
            "radial-gradient(rgba(27,54,36,0.14) 1.5px, transparent 1.6px)",
          backgroundSize: "26px 26px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 18 }}>
          {TILES.map((t, i) => (
            <div
              key={i}
              style={{
                width: 148,
                height: 148,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: t.bg,
                border: "6px solid #111",
                borderRadius: 28,
                boxShadow: `10px 10px 0 ${t.shadow}`,
                color: "#111",
                fontSize: 104,
                fontWeight: 900,
                transform: i % 2 ? "rotate(2deg)" : "rotate(-2deg)",
              }}
            >
              {t.letter}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            color: "#1b3624",
            fontSize: 34,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          the interactive autobiography of Aavrit Gupta
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#5a6b60",
            fontSize: 22,
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 99,
              background: "#ff3873",
              display: "flex",
            }}
          />
          GRADE 10 · CBSE · NEPAL
        </div>
      </div>
    ),
    size,
  );
}
