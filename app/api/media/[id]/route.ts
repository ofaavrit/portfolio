import { NextResponse } from "next/server";
import { fsList } from "@/lib/fsdb";

export const runtime = "nodejs";

/** Serves media stored in Firestore (admin uploads). Seeded assets simply
 *  redirect to their static URL. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[a-zA-Z0-9_-]{5,40}$/.test(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const rows = (await fsList("media")) ?? [];
  const asset = rows.find((m) => m.id === id) as
    | { id: string; url?: string | null; data?: string | null; mimeType?: string; filename?: string }
    | undefined;
  if (!asset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (asset.url && !asset.data) {
    return NextResponse.redirect(
      new URL(asset.url, process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    );
  }
  if (!asset.data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const bytes = Buffer.from(asset.data, "base64");
  return new NextResponse(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": asset.mimeType ?? "application/octet-stream",
      "Content-Length": String(bytes.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename="${encodeURIComponent(asset.filename ?? id)}"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
