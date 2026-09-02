// Contact-form rate limiting — in-memory (per server instance), max
// `maxMessages` per `windowMs` per (hashed) IP. No raw IPs are stored.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export async function rateLimitContact(
  ip: string | null,
  maxMessages = 5,
  windowMs = 60 * 60 * 1000,
): Promise<{ ok: boolean; retryAfterSeconds?: number }> {
  const key = ip ?? "anonymous";
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (bucket.count >= maxMessages) {
    return { ok: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true };
}
