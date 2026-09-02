import Link from "next/link";

export default function NotFound() {
  return (
    <main className="dots flex min-h-[80svh] flex-col items-center justify-center gap-8 px-6 text-center">
      <p className="display text-[clamp(4rem,20vw,12rem)] leading-none" style={{ color: "#1b3624" }}>
        4<span className="tile inline-grid h-[1em] w-[1em] align-[-0.12em] text-[0.8em]" style={{ "--tile-bg": "#ffd200", "--tile-shadow": "#ff3873" } as React.CSSProperties}>0</span>4
      </p>
      <p className="hand-note text-3xl" style={{ color: "#1b3624" }}>
        this page fell out of the scrapbook
      </p>
      <Link href="/" className="btn">
        Back to the story
      </Link>
    </main>
  );
}
