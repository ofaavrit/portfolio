"use client";

/**
 * Confetti — DOM particles with CSS physics. Self-cleaning, zero deps,
 * and a strict no-op under prefers-reduced-motion.
 */

const COLORS = ["#ff3873", "#3ef2e4", "#ffd200", "#ceef32", "#beb0fa", "#ff7134", "#ff5055"];

export function burstConfetti(x: number, y: number, count = 26) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof document === "undefined") return;

  const fragment = document.createDocumentFragment();
  const parts: HTMLElement[] = [];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "confetti-bit";
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
    const dist = 90 + Math.random() * 190;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist * 0.62 + 120 + Math.random() * 190;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.background = COLORS[i % COLORS.length];
    el.style.setProperty("--dx", `${dx.toFixed(0)}px`);
    el.style.setProperty("--dy", `${dy.toFixed(0)}px`);
    el.style.setProperty("--rot", `${(Math.random() < 0.5 ? -1 : 1) * (420 + Math.random() * 620)}deg`);
    el.style.setProperty("--dur", `${(1.15 + Math.random() * 0.85).toFixed(2)}s`);
    if (Math.random() < 0.3) el.style.borderRadius = "50%";
    fragment.appendChild(el);
    parts.push(el);
  }
  document.body.appendChild(fragment);
  window.setTimeout(() => parts.forEach((p) => p.remove()), 2200);
}

export function burstFromElement(el: HTMLElement | null, count = 26) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  burstConfetti(r.left + r.width / 2, r.top + r.height / 2, count);
}
