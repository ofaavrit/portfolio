import localFont from "next/font/local";

// Archivo variable (weight 100–900, width 62–125). The width axis lets headlines
// go expanded-black (the PDF's condensed-black-italic energy) while body text
// stays at normal width — one file, two personalities.
const archivo = localFont({
  src: [
    { path: "./fonts/Archivo-Variable.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/Archivo-Italic-Variable.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-archivo",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

const caveat = localFont({
  src: "./fonts/Caveat-Variable.woff2",
  weight: "400 700",
  variable: "--font-caveat",
  display: "swap",
});

const spaceMono = localFont({
  src: [
    { path: "./fonts/SpaceMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/SpaceMono-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-spacemono",
  display: "swap",
  preload: true,
});

// ── Zine voices — the exact faces the owner's PDF deck uses per page ─────────
// Barlow Condensed Black Italic → the giant stacked "AAVRIT" on the PDF cover.
const barlowCondensed = localFont({
  src: [
    { path: "./fonts/BarlowCondensed-BlackItalic.woff2", weight: "900", style: "italic" },
    { path: "./fonts/BarlowCondensed-ExtraBoldItalic.woff2", weight: "800", style: "italic" },
  ],
  variable: "--font-barlow",
  display: "swap",
});

// Special Elite → the typewriter the "digital world" chapter is typed on.
const specialElite = localFont({
  src: "./fonts/SpecialElite-Regular.woff2",
  weight: "400",
  variable: "--font-elite",
  display: "swap",
});

// Schoolbell → the pencil-scrawl annotations of the interests page.
const schoolbell = localFont({
  src: "./fonts/Schoolbell-Regular.woff2",
  weight: "400",
  variable: "--font-school",
  display: "swap",
});

// Chewy → the bubbly headers of "Introduction to the digital world".
const chewy = localFont({
  src: "./fonts/Chewy-Regular.woff2",
  weight: "400",
  variable: "--font-chewy",
  display: "swap",
});

// Permanent Marker → stand-in for the deck's grunge / marker display faces.
const permanentMarker = localFont({
  src: "./fonts/PermanentMarker-Regular.woff2",
  weight: "400",
  variable: "--font-marker",
  display: "swap",
});

export const fonts = { archivo, caveat, spaceMono };
export const fontVariables = [
  archivo.variable,
  caveat.variable,
  spaceMono.variable,
  barlowCondensed.variable,
  specialElite.variable,
  schoolbell.variable,
  chewy.variable,
  permanentMarker.variable,
].join(" ");
