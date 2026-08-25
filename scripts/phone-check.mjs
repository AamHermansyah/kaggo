/**
 * Phone normalisation checks.
 *
 * Backend v1.1 resolves a caller's country from the dialling code, so the
 * frontend must stop rejecting anything that is not Nigerian — while still
 * folding the many ways a Nigerian number can be typed into one identity.
 *
 * Run with `npm run phone:check`.
 */
import {
  formatPhone,
  isNigerianPhone,
  isValidPhone,
  normalizePhone,
  toE164,
} from "../lib/validation/phone.ts"

const results = []
const check = (label, pass, detail = "") =>
  results.push({ label, pass, detail })

/* Nigerian input, however it is written, folds to one local form ---------- */

const NIGERIAN = [
  "08034567890",
  "0803 456 7890",
  "0803-456-7890",
  "+2348034567890",
  "+234 803 456 7890",
  "2348034567890",
  "008034567890".replace("00", ""), // plain 08034567890
  "8034567890",
]

for (const input of NIGERIAN) {
  const out = normalizePhone(input)
  check(
    `NG ${input.padEnd(18)} → 08034567890`,
    out === "08034567890",
    `got ${out}`
  )
}

/* International numbers are accepted and kept in E.164 -------------------- */

const INTERNATIONAL = [
  ["+919876543210", "+919876543210"], // India — the Razorpay path
  ["+1 415 555 0132", "+14155550132"],
  ["+44 20 7946 0958", "+442079460958"],
  ["0091 9876543210", "+919876543210"], // 00 prefix
]

for (const [input, expected] of INTERNATIONAL) {
  const out = normalizePhone(input)
  check(`INTL ${input.padEnd(18)} → ${expected}`, out === expected, `got ${out}`)
}

/* Rubbish stays rejected -------------------------------------------------- */

const INVALID = [
  "",
  "123",
  "0803456789", // one digit short
  "080345678901", // one digit long
  "01034567890", // invalid NG prefix
  "+0123456789", // E.164 cannot start with 0
  "+123", // too short
  "not a phone",
]

for (const input of INVALID) {
  check(
    `reject ${JSON.stringify(input).padEnd(18)}`,
    normalizePhone(input) === null,
    `got ${normalizePhone(input)}`
  )
}

/* Helpers stay consistent with normalisation ------------------------------ */

check("toE164 folds NG local", toE164("08034567890") === "+2348034567890")
check("toE164 passes E.164 through", toE164("+919876543210") === "+919876543210")
check("formatPhone groups NG", formatPhone("08034567890") === "0803 456 7890")
check(
  "formatPhone leaves intl alone",
  formatPhone("+919876543210") === "+919876543210"
)
check("isNigerianPhone true for NG", isNigerianPhone("+2348034567890"))
check("isNigerianPhone false for IN", !isNigerianPhone("+919876543210"))
check("isValidPhone agrees with normalize", isValidPhone("+919876543210"))

/* Normalisation is idempotent — re-running must not change the answer ----- */

let unstable = 0
for (const input of [...NIGERIAN, ...INTERNATIONAL.map(([i]) => i)]) {
  const once = normalizePhone(input)
  if (once && normalizePhone(once) !== once) unstable++
}
check("normalizePhone is idempotent", unstable === 0, `${unstable} unstable`)

let failed = 0
for (const { label, pass, detail } of results) {
  console.log(`${pass ? "PASS" : "FAIL"}  ${label}${detail ? "  → " + detail : ""}`)
  if (!pass) failed++
}
console.log(`\n${results.length - failed}/${results.length} passed`)
process.exit(failed ? 1 : 0)
