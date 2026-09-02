import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { rateLimitContact, hashIp } from "@aavrit/core";
import { fsCreate } from "@/lib/fsdb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,24}$/;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: if the hidden field was filled, pretend success and store nothing.
  if (str(payload.website)) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const name = str(payload.name);
  const email = str(payload.email).toLowerCase();
  const subject = str(payload.subject);
  const body = str(payload.body);

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: "Please enter your name (2–80 characters)." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 120) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  }
  if (subject.length > 120) {
    return NextResponse.json({ error: "Subject is too long (max 120 characters)." }, { status: 400 });
  }
  if (body.length < 10 || body.length > 4000) {
    return NextResponse.json(
      { error: "Message should be between 10 and 4000 characters." },
      { status: 400 },
    );
  }

  // Rate limit per hashed IP (privacy-conscious: only a truncated hash is stored)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;
  const limit = await rateLimitContact(ip, 5);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many messages right now — please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds ?? 3600) } },
    );
  }

  const saved = await fsCreate("messages", randomUUID(), {
    name,
    email,
    subject: subject || null,
    body,
    ipHash: ip ? hashIp(ip) : null,
    userAgent: (req.headers.get("user-agent") ?? "").slice(0, 250),
    read: false,
    archived: false,
    createdAt: new Date().toISOString(),
  });

  if (saved) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }
  return NextResponse.json(
    { error: "Could not deliver the message right now. Please email me directly." },
    { status: 500 },
  );
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
