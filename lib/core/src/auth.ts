import { createHash } from "node:crypto";

// Authentication is Supabase Auth only. This module keeps the small
// crypto helpers shared by both apps (no passwords are stored here).

function pepper(v: string): string {
  return `${v}::${process.env.AUTH_SECRET ?? "insecure-dev-pepper"}`;
}

/** Privacy-conscious: truncated hash, never reversible to a full IP. */
export function hashIp(ip: string): string {
  return createHash("sha256").update(pepper(ip)).digest("hex").slice(0, 24);
}

/** Default admin identity used for provisioning + local preview login. */
export function defaultAdminEmail(): string {
  return (process.env.ADMIN_EMAIL ?? "admin@aavrit.test").toLowerCase();
}

export function defaultAdminName(): string {
  return process.env.ADMIN_NAME ?? "Aavrit";
}
