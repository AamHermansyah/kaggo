/**
 * Guards against open redirects.
 *
 * `?next=` values arrive from the URL bar, so they are attacker-controlled.
 * Only same-origin absolute paths are honoured: anything protocol-relative
 * (`//evil.com`), absolute (`https://evil.com`) or backslash-smuggled falls
 * back to the caller's default.
 */
export function safeInternalPath(
  value: string | null | undefined,
  fallback: string
): string {
  if (!value) return fallback

  const candidate = value.trim()
  if (!candidate.startsWith("/")) return fallback
  if (candidate.startsWith("//")) return fallback
  if (candidate.includes("\\")) return fallback
  if (/^\/[a-z][a-z0-9+.-]*:/i.test(candidate)) return fallback

  return candidate
}

/** Builds an absolute URL for callbacks that leave and re-enter the site. */
export function absoluteUrl(path: string, origin: string): string {
  return new URL(path, origin).toString()
}
