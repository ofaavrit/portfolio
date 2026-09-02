import { NextResponse } from "next/server";
import { fsPing } from "@/lib/fsdb";

export const dynamic = "force-dynamic";

/** Deployment health check — open /api/health to see where content comes from:
 *  { "mode": "live" }      → reading from Firebase Firestore
 *  { "mode": "fallback" }  → Firestore not public yet; serving the bundled
 *                            snapshot (the real story, identical content). */
export async function GET() {
  const mode = await fsPing();
  return NextResponse.json({
    mode,
    source: mode === "live" ? "Firebase Firestore (project a-a-v-r-i-t)" : "bundled snapshot",
  });
}
