// Tiny allow-list sanitizer for admin-authored rich text and embeds.
// No dependencies; everything outside the allow-list is escaped away.

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "a",
  "span",
  "blockquote",
  "code",
  "h2",
  "h3",
  "h4",
]);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strip everything except a safe subset of inline HTML. */
export function sanitizeRichText(html: string): string {
  if (!html) return "";
  let out = "";
  let i = 0;
  const src = html;
  while (i < src.length) {
    const lt = src.indexOf("<", i);
    if (lt === -1) {
      out += escapeHtml(src.slice(i));
      break;
    }
    out += escapeHtml(src.slice(i, lt));
    const gt = src.indexOf(">", lt);
    if (gt === -1) break;
    const raw = src.slice(lt, gt + 1);
    const closing = raw.startsWith("</");
    const nameMatch = raw.match(/^<\/?\s*([a-zA-Z0-9-]+)/);
    const name = nameMatch ? nameMatch[1].toLowerCase() : "";
    if (name && ALLOWED_TAGS.has(name)) {
      if (closing) {
        out += `</${name}>`;
      } else if (name === "a") {
        const hrefMatch = raw.match(/href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
        let href = hrefMatch
          ? hrefMatch[2] ?? hrefMatch[3] ?? hrefMatch[4] ?? ""
          : "";
        if (!/^(https?:|mailto:|\/|#)/i.test(href)) href = "";
        out += `<a href="${escapeHtml(href)}" rel="noopener noreferrer">`;
      } else if (name === "br") {
        out += "<br />";
      } else {
        out += `<${name}>`;
      }
    }
    // else: drop the tag entirely (its text content is kept below)
    i = gt + 1;
  }
  return out;
}

/** Convert a YouTube/Vimeo watch URL into a safe embed URL, or null. */
export function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = u.searchParams.get("v");
      if (v && /^[\w-]{6,20}$/.test(v)) return `https://www.youtube-nocookie.com/embed/${v}`;
    } else if (host === "youtu.be") {
      const v = u.pathname.slice(1);
      if (/^[\w-]{6,20}$/.test(v)) return `https://www.youtube-nocookie.com/embed/${v}`;
    } else if (host === "vimeo.com") {
      const v = u.pathname.replace(/\D/g, "");
      if (/^\d{4,12}$/.test(v)) return `https://player.vimeo.com/video/${v}`;
    }
    return null;
  } catch {
    return null;
  }
}

/** Only http(s) or mailto URLs, used for admin-entered links. */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^(https?:\/\/|mailto:|\/)/i.test(trimmed)) return trimmed;
  return null;
}
