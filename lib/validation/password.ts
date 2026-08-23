export type PasswordStrength = "weak" | "medium" | "strong"

export interface PasswordAssessment {
  /** 0–4. Drives the meter width as well as the label. */
  score: number
  strength: PasswordStrength
  /** Estimated bits of entropy. Exposed mainly so the checks can assert on it. */
  bits: number
  /** What would make this password stronger, most useful first. */
  hints: string[]
}

export const PASSWORD_MIN_LENGTH = 8

/**
 * Base words that top every breach corpus, stored without the digits and
 * symbols people bolt on. `Password1!`, `passw0rd`, and `password123` all
 * reduce to `password` before the lookup.
 */
const COMMON_BASES = new Set([
  "password",
  "passwort",
  "qwerty",
  "qwertyuiop",
  "asdfgh",
  "zxcvbn",
  "iloveyou",
  "admin",
  "administrator",
  "welcome",
  "letmein",
  "sunshine",
  "football",
  "baseball",
  "monkey",
  "dragon",
  "master",
  "login",
  "superman",
  "princess",
  "shadow",
  "michael",
  "abc",
  "test",
  "secret",
  "kaggo",
  "mykaggo",
])

const LEET: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "8": "b",
  "@": "a",
  $: "s",
  "!": "i",
}

function deleet(value: string): string {
  return value
    .split("")
    .map((char) => LEET[char] ?? char)
    .join("")
}

const lettersOnly = (value: string) => value.replace(/[^a-z]/g, "")
const stripEdges = (value: string) =>
  value.replace(/^[^a-z]+/, "").replace(/[^a-z]+$/, "")

/**
 * The forms an attacker's dictionary would hold.
 *
 * Two different manglings are needed and one cannot do both: leetspeak has to
 * be undone to catch `P@ssw0rd`, but applying it to trailing filler turns
 * `Password1` into `passwordi` and misses it. So the padding is stripped and
 * the substitution applied separately, and any candidate matching counts.
 *
 * Matching is exact, so a passphrase that merely contains a common word
 * (`password-correct-horse-battery`) is not caught by it.
 */
function baseWordCandidates(password: string): string[] {
  const raw = password.toLowerCase()
  const trimmed = stripEdges(raw)

  return [
    raw,
    trimmed,
    lettersOnly(raw),
    lettersOnly(deleet(raw)),
    lettersOnly(deleet(trimmed)),
  ]
}

function isCommonPassword(password: string): boolean {
  return baseWordCandidates(password).some((candidate) =>
    COMMON_BASES.has(candidate)
  )
}

const CHARACTER_CLASSES: Array<{
  test: RegExp
  pool: number
  missing: string
}> = [
  { test: /[a-z]/, pool: 26, missing: "a lowercase letter" },
  { test: /[A-Z]/, pool: 26, missing: "an uppercase letter" },
  { test: /\d/, pool: 10, missing: "a number" },
  { test: /[^A-Za-z0-9]/, pool: 33, missing: "a symbol" },
]

/** Rows an attacker walks along: `qwer`, `asdf`, `1234`. */
const KEYBOARD_ROWS = [
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
  "1234567890",
]

function isKeyboardNeighbour(previous: string, current: string): boolean {
  for (const row of KEYBOARD_ROWS) {
    const a = row.indexOf(previous)
    const b = row.indexOf(current)
    if (a !== -1 && b !== -1 && Math.abs(a - b) === 1) return true
  }
  return false
}

/**
 * How much each character really adds.
 *
 * A character that simply repeats or continues the previous one is nearly free
 * for an attacker, so it counts for a fraction instead of cancelling the whole
 * score. Because every weight is positive, a longer password can never score
 * lower than its own prefix — which is exactly what the previous
 * "clamp to weak on any triple" rule got wrong: `Ryzen5000` ranked below
 * `Ryzen500`.
 */
const REPEAT_WEIGHT = 0.4
const SEQUENCE_WEIGHT = 0.5

function effectiveLength(password: string): number {
  let total = 0

  for (let i = 0; i < password.length; i++) {
    if (i === 0) {
      total += 1
      continue
    }

    const previous = password[i - 1].toLowerCase()
    const current = password[i].toLowerCase()

    if (current === previous) {
      total += REPEAT_WEIGHT
      continue
    }

    const alphabetStep = Math.abs(
      current.charCodeAt(0) - previous.charCodeAt(0)
    )
    if (alphabetStep === 1 || isKeyboardNeighbour(previous, current)) {
      total += SEQUENCE_WEIGHT
      continue
    }

    total += 1
  }

  return total
}

/** Entropy thresholds, in bits. */
const MEDIUM_BITS = 36
const STRONG_BITS = 55

/**
 * Scores a password without any network call or third-party library.
 *
 * The model is `effectiveLength × log2(alphabet size)`: length dominates, and
 * predictable characters are discounted rather than penalised. That keeps the
 * meter monotonic — typing another character never moves the label backwards.
 */
export function assessPassword(password: string): PasswordAssessment {
  const value = password ?? ""

  if (value.length === 0) {
    return { score: 0, strength: "weak", bits: 0, hints: [] }
  }

  const present = CHARACTER_CLASSES.filter((c) => c.test.test(value))
  const missing = CHARACTER_CLASSES.filter((c) => !c.test.test(value))
  const poolSize = present.reduce((sum, c) => sum + c.pool, 0) || 26

  const length = effectiveLength(value)
  let bits = length * Math.log2(poolSize)

  const hints: string[] = []
  const tooShort = value.length < PASSWORD_MIN_LENGTH
  const isCommon = isCommonPassword(value)

  // Two hard overrides. Both describe passwords an attacker gets for free
  // regardless of how the arithmetic came out.
  if (tooShort || isCommon) bits = 0

  if (isCommon) {
    hints.push("This is one of the most guessed passwords")
  }
  if (tooShort) {
    hints.push(`Use at least ${PASSWORD_MIN_LENGTH} characters`)
  }

  if (!tooShort && !isCommon) {
    // Ordered by how much each would actually add.
    if (missing.length >= 2) {
      hints.push(`Add ${missing.map((c) => c.missing).join(" and ")}`)
    }
    if (value.length < 12) {
      hints.push("Longer is stronger — aim for 12 or more characters")
    }
    if (length < value.length - 0.5) {
      hints.push("Repeated characters and keyboard runs add very little")
    }
    if (missing.length === 1) {
      hints.push(`Add ${missing[0].missing}`)
    }
  }

  const strength: PasswordStrength =
    bits >= STRONG_BITS ? "strong" : bits >= MEDIUM_BITS ? "medium" : "weak"

  const score = Math.max(0, Math.min(4, Math.floor(bits / 16)))

  return { score, strength, bits: Math.round(bits * 10) / 10, hints }
}

/** Minimum accepted strength. Anything weaker is rejected by the schema. */
export function isAcceptablePassword(password: string): boolean {
  return assessPassword(password).strength !== "weak"
}

export const PASSWORD_TOO_WEAK =
  "Password is too weak. Mix upper and lower case, numbers or symbols, and make it longer."

export const STRENGTH_LABEL: Record<PasswordStrength, string> = {
  weak: "Weak",
  medium: "Medium",
  strong: "Strong",
}
