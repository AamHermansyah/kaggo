export type PasswordStrength = "weak" | "medium" | "strong"

export interface PasswordAssessment {
  /** 0–4. Drives the meter width as well as the label. */
  score: number
  strength: PasswordStrength
  /** What would make this password stronger, most useful first. */
  hints: string[]
}

export const PASSWORD_MIN_LENGTH = 8

/**
 * The handful of passwords that top every breach corpus. Not a substitute for a
 * real breached-password check, but it stops the most common choices from being
 * scored on character variety alone — "Password1!" looks varied and is still
 * the first thing an attacker tries.
 */
const COMMON = new Set([
  "password",
  "password1",
  "password123",
  "passw0rd",
  "p@ssw0rd",
  "12345678",
  "123456789",
  "1234567890",
  "qwerty123",
  "qwertyuiop",
  "iloveyou",
  "admin123",
  "welcome1",
  "letmein1",
  "abc12345",
  "sunshine",
  "football",
  "monkey123",
  "kaggo123",
  "mykaggo123",
])

const CHARACTER_CLASSES: Array<{ test: RegExp; missing: string }> = [
  { test: /[a-z]/, missing: "a lowercase letter" },
  { test: /[A-Z]/, missing: "an uppercase letter" },
  { test: /\d/, missing: "a number" },
  { test: /[^A-Za-z0-9]/, missing: "a symbol" },
]

/** Three or more of the same character in a row, e.g. "aaa". */
function hasRepeatRun(password: string): boolean {
  return /(.)\1{2,}/.test(password)
}

/** Four or more consecutive characters, e.g. "abcd", "4321". */
function hasSequence(password: string): boolean {
  const lower = password.toLowerCase()
  let ascending = 1
  let descending = 1

  for (let i = 1; i < lower.length; i++) {
    const delta = lower.charCodeAt(i) - lower.charCodeAt(i - 1)
    ascending = delta === 1 ? ascending + 1 : 1
    descending = delta === -1 ? descending + 1 : 1
    if (ascending >= 4 || descending >= 4) return true
  }

  return /qwer|wert|erty|asdf|sdfg|zxcv/.test(lower)
}

/**
 * Scores a password without any network call or third-party library.
 *
 * Length is weighted deliberately more heavily than character variety: a long
 * passphrase beats a short password with one of everything substituted in.
 */
export function assessPassword(password: string): PasswordAssessment {
  const value = password ?? ""
  const hints: string[] = []

  if (value.length === 0) {
    return { score: 0, strength: "weak", hints: [] }
  }

  const missing = CHARACTER_CLASSES.filter((c) => !c.test.test(value))
  const classCount = CHARACTER_CLASSES.length - missing.length

  let score = 0
  if (value.length >= PASSWORD_MIN_LENGTH) score++
  if (value.length >= 12) score++
  if (classCount >= 3) score++
  if (classCount >= 4 || value.length >= 16) score++

  if (value.length < PASSWORD_MIN_LENGTH) {
    hints.push(`Use at least ${PASSWORD_MIN_LENGTH} characters`)
    score = 0
  } else if (value.length < 12) {
    hints.push("Longer is stronger — aim for 12 or more characters")
  }

  if (missing.length > 0 && missing.length <= 3) {
    hints.push(`Add ${missing.map((c) => c.missing).join(", ")}`)
  }

  if (COMMON.has(value.toLowerCase())) {
    hints.unshift("This is one of the most guessed passwords")
    score = 0
  } else if (hasRepeatRun(value) || hasSequence(value)) {
    hints.unshift("Avoid repeated characters and keyboard runs")
    score = Math.min(score, 1)
  }

  score = Math.max(0, Math.min(4, score))

  const strength: PasswordStrength =
    score <= 1 ? "weak" : score === 2 ? "medium" : "strong"

  return { score, strength, hints }
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
