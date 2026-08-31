/**
 * Phone numbers.
 *
 * Nigeria is the home market, so a bare `0803…` is accepted and kept in that
 * local form. But the backend resolves a caller's country from the dialling
 * code as of v1.1 — that is what picks the payment gateway — and it already
 * serves India. Rejecting everything that is not Nigerian would lock those
 * users out at the identify step, so any number written in E.164 is accepted
 * too and passed through unchanged.
 */

const NG_LOCAL = /^0[7-9][01]\d{8}$/
/** E.164: `+` then 8-15 digits, first digit non-zero. */
const E164 = /^\+[1-9]\d{7,14}$/

/** Strips spaces, dashes, dots and parentheses. */
function strip(value: string): string {
  return value.replace(/[\s().-]/g, "")
}

/**
 * Canonical form, or `null` when unusable.
 *
 * Nigerian numbers come back as `0XXXXXXXXXX`; everything else as E.164. Both
 * are formats the backend documents as acceptable.
 */
export function normalizePhone(input: string): string | null {
  const raw = strip(input.trim())
  if (!raw) return null

  // `00` is the other common way to write an international prefix, and people
  // routinely drop the `+` from a Nigerian number written internationally.
  let candidate = raw
  if (candidate.startsWith("00")) candidate = `+${candidate.slice(2)}`
  else if (/^234\d{10}$/.test(candidate)) candidate = `+${candidate}`

  if (candidate.startsWith("+")) {
    // Nigerian numbers written internationally fold back to the local form so
    // one person always resolves to one identity however they typed it.
    if (candidate.startsWith("+234")) {
      const local = `0${candidate.slice(4)}`
      return NG_LOCAL.test(local) ? local : null
    }
    return E164.test(candidate) ? candidate : null
  }

  // Bare national number, e.g. "8034567890".
  const local = /^[7-9][01]\d{8}$/.test(candidate) ? `0${candidate}` : candidate
  return NG_LOCAL.test(local) ? local : null
}

export function isValidPhone(input: string): boolean {
  return normalizePhone(input) !== null
}

export function isNigerianPhone(input: string): boolean {
  const normalized = normalizePhone(input)
  return normalized !== null && normalized.startsWith("0")
}

/** `08034567890` → `+2348034567890`. Already-E.164 numbers pass through. */
export function toE164(input: string): string | null {
  const normalized = normalizePhone(input)
  if (!normalized) return null
  return normalized.startsWith("+")
    ? normalized
    : `+234${normalized.slice(1)}`
}

/** `08034567890` → `0803 456 7890`. International numbers are left alone. */
export function formatPhone(input: string): string {
  const normalized = normalizePhone(input)
  if (!normalized) return input
  if (normalized.startsWith("+")) return normalized

  return `${normalized.slice(0, 4)} ${normalized.slice(4, 7)} ${normalized.slice(7)}`
}

export const PHONE_ERROR =
  "Enter a valid phone number — 08034567890, or +234… / +91… for other countries"
