"use client";

import { useEffect, useState } from "react";

/**
 * AAVRIT's local clock — Kathmandu time (UTC+5:45), ticking live. A small
 * "he's real, he's somewhere" signal: visitors see the exact time where the
 * story was written. Renders nothing until mounted (no hydration mismatch),
 * degrades to nothing without JS.
 */
export default function NepalClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kathmandu",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  if (!time) return null;
  return (
    <span className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      🇳🇵 KATHMANDU {time}
    </span>
  );
}
