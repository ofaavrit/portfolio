"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Page-transition veil: three AAVRIT tiles sweep across on every chapter
 * change — the site's signature move between pages. Purely decorative;
 * skipped entirely for reduced-motion users.
 */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;
  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.32, delay: 0.24, ease: "easeIn" }}
      >
        {[
          { bg: "#ffd200", shadow: "#ff3873", d: 0.0, x: "-30vw", r: -14 },
          { bg: "#3ef2e4", shadow: "#ceef32", d: 0.06, x: "-18vw", r: 10 },
          { bg: "#ff9ec4", shadow: "#ffd200", d: 0.12, x: "-26vw", r: -8 },
        ].map((t, i) => (
          <motion.span
            key={i}
            className="absolute top-[38%] h-24 w-24 rounded-2xl border-[3px] border-[#111] md:h-32 md:w-32"
            style={{ background: t.bg, boxShadow: `8px 8px 0 ${t.shadow}` }}
            initial={{ x: "110vw", y: `${i * 9 - 9}vh`, rotate: 0 }}
            animate={{ x: t.x, rotate: t.r }}
            transition={{ duration: 0.42, delay: t.d, ease: [0.76, 0, 0.24, 1] }}
          />
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34, delay: 0.1, ease: [0.22, 0.61, 0.21, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
