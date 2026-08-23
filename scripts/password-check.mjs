/**
 * Locks in the password strength thresholds.
 *
 * Run with `npm run password:check`. The scorer gates account creation — a
 * silent regression here would let weak passwords through, so the boundaries
 * are pinned rather than left to manual spot checks.
 */
import { assessPassword } from "../lib/validation/password.ts"

const CASES = [
  // rejected outright
  ["", "weak"],
  ["abc", "weak"],
  ["short1!", "weak"], // 7 chars — under the minimum
  ["password", "weak"], // top of every breach corpus
  ["Password1", "weak"], // varied-looking but still a top guess
  ["12345678", "weak"],
  ["qwertyuiop", "weak"],
  ["aaaaaaaa", "weak"], // repeated run
  ["abcdefgh", "weak"], // sequential run
  ["mykaggo1", "weak"], // 8 chars, only two character classes

  // accepted, but flagged as improvable
  ["Tr0ubador", "medium"],
  ["kaggoRider7", "medium"],

  // accepted
  ["Passw0rd!", "strong"],
  ["correcthorsebattery", "strong"], // long passphrase beats short complexity
  ["Lagos-Abuja-2026!", "strong"],
  ["S3cure#Pass2026", "strong"],
]

let failed = 0

for (const [password, expected] of CASES) {
  const { score, strength, hints } = assessPassword(password)
  const ok = strength === expected
  if (!ok) failed++
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${JSON.stringify(password).padEnd(23)} score=${score} ${strength.padEnd(6)} expected=${expected.padEnd(6)} ${hints.join(" | ")}`
  )
}

console.log(`\n${CASES.length - failed}/${CASES.length} passed`)
process.exit(failed ? 1 : 0)
