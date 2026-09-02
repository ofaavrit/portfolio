"use client";

import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Fine-pointer-only magnetic wrapper. Falls back to a plain element on touch
 * devices and reduced-motion preferences.
 */
export default function MagneticButton({
  children,
  className = "",
  strength = 0.28,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.6 });
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const pointerMq = window.matchMedia("(pointer: fine) and (hover: hover)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setFine(pointerMq.matches && !motionMq.matches);
    update();
    pointerMq.addEventListener("change", update);
    motionMq.addEventListener("change", update);
    return () => {
      pointerMq.removeEventListener("change", update);
      motionMq.removeEventListener("change", update);
    };
  }, []);

  const onMove = (e: MouseEvent) => {
    if (!fine || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength * 0.9);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!fine) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.span>
  );
}
