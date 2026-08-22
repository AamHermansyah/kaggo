/**
 * Nigerian phone numbers.
 *
 * The backend accepts both the local `0XXXXXXXXXX` form and E.164
 * `+234XXXXXXXXXX`. Everything is normalised to the local form before it
 * leaves the browser so the same person always resolves to the same identity.
 */

const NG_LOCAL = /^0[7-9][01]\d{8}$/

/** Strips spaces, dashes, dots and parentheses. */
function strip(value: string): string {
  return value.replace(/[\s().-]/g, "")
}

/** Returns the canonical `0XXXXXXXXXX` form, or `null` when unusable. */
export function normalizePhone(input: string): string | null {
  const raw = strip(input.trim())
  if (!raw) return null

  let local = raw
  if (local.startsWith("+234")) local = `0${local.slice(4)}`
  else if (local.startsWith("234")) local = `0${local.slice(3)}`
  else if (/^[7-9][01]\d{8}$/.test(local)) local = `0${local}`

  return NG_LOCAL.test(local) ? local : null
}

export function isValidPhone(input: string): boolean {
  return normalizePhone(input) !== null
}

/** `08034567890` → `+2348034567890`, for `tel:` links. */
export function toE164(input: string): string | null {
  const local = normalizePhone(input)
  return local ? `+234${local.slice(1)}` : null
}

/** `08034567890` → `0803 456 7890`. */
export function formatPhone(input: string): string {
  const local = normalizePhone(input)
  if (!local) return input
  return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`
}

export const PHONE_ERROR =
  "Enter a valid Nigerian phone number, e.g. 08034567890"
