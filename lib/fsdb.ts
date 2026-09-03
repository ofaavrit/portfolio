/**
 * Firestore data layer for the public site.
 *
 * Reads go through the public Firestore REST API using the web API key —
 * the key is public by design (it identifies the project, it is not a
 * secret), so the site needs **zero environment variables** to build and
 * run on Vercel.
 *
 * Every read is fail-soft: if Firestore is unreachable or its security
 * rules have not been opened for public reads yet, we fall back to the
 * bundled snapshot (`data/portfolio-snapshot.json`) — the real, seeded
 * content — so the site never renders empty.
 */

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDlRbLCFCXk9uigcUqNckKfVn_HyOSYm40",
  authDomain: "a-a-v-r-i-t.firebaseapp.com",
  projectId: "a-a-v-r-i-t",
  storageBucket: "a-a-v-r-i-t.firebasestorage.app",
  messagingSenderId: "633500686388",
  appId: "1:633500686388:web:61424b21a66487ac1d9261",
  measurementId: "G-KW4GG09TBQ",
} as const;

const BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents`;

/* ── REST value codec ─────────────────────────────────────────────── */

type FsValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  timestampValue?: string;
  nullValue?: null;
  arrayValue?: { values?: FsValue[] };
  mapValue?: { fields?: Record<string, FsValue> };
};

function decodeValue(v: FsValue): unknown {
  if (v == null) return null;
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return Number(v.doubleValue);
  if ("booleanValue" in v) return v.booleanValue;
  if ("timestampValue" in v) return v.timestampValue;
  if ("arrayValue" in v) return (v.arrayValue?.values ?? []).map(decodeValue);
  if ("mapValue" in v) return decodeFields(v.mapValue?.fields ?? {});
  return null;
}

function decodeFields(fields: Record<string, FsValue>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) out[k] = decodeValue(v);
  return out;
}

export function encodeValue(value: unknown): FsValue {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number")
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  if (typeof value === "string") return { stringValue: value };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeValue) } };
  const fields: Record<string, FsValue> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>))
    fields[k] = encodeValue(v);
  return { mapValue: { fields } };
}

/** Create a Firestore document over REST (used by the contact endpoint). */
export async function fsCreate(
  collectionId: string,
  docId: string,
  data: Record<string, unknown>,
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/${collectionId}/${docId}?key=${FIREBASE_CONFIG.apiKey}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: encodeValue(data) }),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

/* ── Reads with graceful degradation ───────────────────────────────── */
/* A 5-second micro-cache keeps repeat renders instant while admin edits
 * still appear on the very next refresh — "instantly visible". */
const microCache = new Map<string, { at: number; data: unknown }>();
const MICRO_TTL_MS = 5_000;

async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = microCache.get(key);
  const now = Date.now();
  if (hit && now - hit.at < MICRO_TTL_MS) return hit.data as T;
  const data = await load();
  microCache.set(key, { at: now, data });
  return data;
}

export function clearContentCache() {
  microCache.clear();
}

export type FsDoc = Record<string, unknown> & { id: string };

export function decodeDoc(doc: { name?: string; fields?: Record<string, FsValue> }): FsDoc {
  const id = doc.name?.split("/").pop() ?? "";
  return { id, ...decodeFields(doc.fields ?? {}) };
}

/** List a collection. Returns null when unreachable — and when the collection
 *  is missing/empty (Firestore answers 200 `{}` for a non-existent
 *  collection), so callers fall back to the bundled snapshot until the
 *  database is seeded. */
export async function fsList(collectionId: string): Promise<FsDoc[] | null> {
  return cached(`list:${collectionId}`, async () => {
    try {
      const res = await fetch(`${BASE}/${collectionId}?key=${FIREBASE_CONFIG.apiKey}&pageSize=500`, {
        cache: "no-store",
      } as RequestInit);
      if (!res.ok) return null;
      const data = (await res.json()) as { documents?: { name?: string; fields?: Record<string, FsValue> }[] };
      if (!Array.isArray(data.documents) || data.documents.length === 0) return null;
      return data.documents.map(decodeDoc);
    } catch {
      return null;
    }
  });
}

/** Read one document. Returns null when missing or unreachable. */
export async function fsGet(collectionId: string, docId: string): Promise<FsDoc | null> {
  return cached(`get:${collectionId}:${docId}`, async () => {
    try {
      const res = await fetch(`${BASE}/${collectionId}/${docId}?key=${FIREBASE_CONFIG.apiKey}`, {
        cache: "no-store",
      } as RequestInit);
      if (!res.ok) return null;
      const data = (await res.json()) as { name?: string; fields?: Record<string, FsValue> };
      return decodeDoc(data);
    } catch {
      return null;
    }
  });
}

/** Ping Firestore — used by /api/health to report which mode the site is in. */
export async function fsPing(): Promise<"live" | "fallback"> {
  const doc = await fsGet("settings", "default");
  return doc && doc.displayName ? "live" : "fallback";
}
