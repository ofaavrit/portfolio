"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, Sparkles } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export default function SiteHeader({
  items,
  displayName,
}: {
  items: NavItem[];
  displayName: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Esc closes; focus first link on open; restore focus on close; scroll lock.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`sticky top-0 z-[80] border-b-2 border-[#111] transition-all duration-300 ${
          scrolled
            ? "bg-[#f5f0e3]/92 backdrop-blur-md py-1.5"
            : "bg-[#f5f0e3]/80 backdrop-blur-sm py-2.5"
        }`}
        style={{ paddingTop: "max(0.375rem, env(safe-area-inset-top))" }}
      >
        <div className="container-x flex items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label={`${displayName} — home`}
          >
            <span className="flex gap-1" aria-hidden="true">
              <span className="tile h-9 w-9 text-[0.95rem]" style={{ "--tile-bg": "#ffd200", "--tile-shadow": "#ff3873", fontStretch: "100%" } as React.CSSProperties}>A</span>
              <span className="tile h-9 w-9 text-[0.95rem] -rotate-6 group-hover:rotate-0 transition-transform duration-300" style={{ "--tile-bg": "#3ef2e4", "--tile-shadow": "#ceef32", fontStretch: "100%" } as React.CSSProperties}>A</span>
            </span>
            <span className="font-black-exp text-lg tracking-tight" style={{ color: "#1b3624" }}>
              {displayName}
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-5">
              {items.map((item, i) =>
                item.href === "/contact" ? (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`btn h-10 min-h-10 px-4 text-sm !shadow-[3px_3px_0_#111] ${
                        isActive(item.href) ? "opacity-90" : ""
                      }`}
                      aria-current={isActive(item.href) ? "page" : undefined}
                    >
                      <Sparkles size={15} aria-hidden="true" /> {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="link-sweep group inline-flex items-baseline gap-1.5 py-1 font-semibold"
                      style={{ color: "#1b3624" }}
                    >
                      <span className="mono-label text-[0.62rem] opacity-50 group-hover:opacity-100" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#111] bg-[#ffd200] text-[#111] shadow-[3px_3px_0_#111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.21, 1] }}
            className="fixed inset-0 z-[95] flex flex-col bg-[#f5f0e3] dots lg:hidden"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            <div className="container-x flex h-16 items-center justify-between">
              <span className="mono-label opacity-60" style={{ color: "#1b3624" }}>CHAPTERS</span>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  menuButtonRef.current?.focus();
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#111] bg-[#ff9ec4] shadow-[3px_3px_0_#111]"
                aria-label="Close menu"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Mobile" className="container-x flex-1 overflow-y-auto py-6">
              <ul className="flex flex-col gap-2 pb-24">
                {items.map((item, i) => (
                  <li key={item.id}>
                    <motion.div
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.25 }}
                    >
                      <Link
                        ref={i === 0 ? firstLinkRef : undefined}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={`flex min-h-[3.5rem] items-center gap-4 rounded-2xl border-2 px-5 py-3 ${
                          isActive(item.href)
                            ? "border-[#111] bg-[#ffd200] shadow-[4px_4px_0_#111]"
                            : "border-transparent"
                        }`}
                      >
                        <span className="mono-label text-[0.65rem] opacity-50" aria-hidden="true">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="display text-[clamp(1.5rem,6vw,2.2rem)]" style={{ color: "#1b3624" }}>
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
