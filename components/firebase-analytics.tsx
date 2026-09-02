"use client";

import { useEffect } from "react";
import { FIREBASE_CONFIG } from "@/lib/fsdb";

/**
 * Firebase Analytics — initialised with the project's public web config.
 * Guarded: analytics stays silent where measurement is unavailable
 * (local previews, sandboxed iframes, ad-blockers).
 */
export function FirebaseAnalytics() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { initializeApp, getApps } = await import("firebase/app");
        const { getAnalytics, isSupported } = await import("firebase/analytics");
        if (cancelled) return;
        if (!(await isSupported())) return;
        const app = getApps()[0] ?? initializeApp(FIREBASE_CONFIG);
        getAnalytics(app);
      } catch {
        /* measurement is optional — never break the site for it */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
