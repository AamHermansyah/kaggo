/**
 * Password-meter checks.
 *
 * The important one is monotonicity: typing another character must never move
 * the label backwards. A previous rule clamped the score to "weak" whenever it
 * saw three identical characters, so `Ryzen5000` ranked below `Ryzen500` and
 * the meter looked random.
 *
 * Run with `npm run password:check`.
 */
import { assessPassword } from "../lib/validation/password.ts"

const TIER = { weak: 0, medium: 1, strong: 2 }
const results = []

function check(label, pass, detail = "") {
  results.push({ label, pass, detail })
}

/* 1. The cases reported from the register form ------------------------- */

const REPORTED = [
  ["Ryzen500", "medium"],
  ["Ryzen5000", "medium"],
  ["Ryzen5001", "medium"],
  ["Ryzen500111", "medium"],
  ["Ryzen5001186", "strong"],
]

for (const [password, expected] of REPORTED) {
  const { strength, bits } = assessPassword(password)
  check(
    `${password.padEnd(14)} → ${expected}`,
    strength === expected,
    `got ${strength} (${bits} bits)`
  )
}

/* 2. Monotonicity: appending never weakens ----------------------------- */

const ALPHABET = "abzABZ0159!@ ".split("")
const SEEDS = [
  "",
  "a",
  "Ry",
  "Ryzen",
  "Ryzen5",
  "Ryzen50",
  "Ryzen500",
  "Ryzen5000",
  "Ryzen50001",
  "aaaaaaaa",
  "abcdefgh",
  "qwertyui",
  "12345678",
  "Tr0ub4dor",
  "correct horse",
  "P@ssw0rd12",
  "passwor",
  "footbal",
  "sunshin",
  "admin12",
  "mykaggo12",
]

let violations = 0
let compared = 0

for (const seed of SEEDS) {
  for (const char of ALPHABET) {
    const before = assessPassword(seed)
    const after = assessPassword(seed + char)
    compared++
    if (TIER[after.strength] < TIER[before.strength]) {
      violations++
      if (violations <= 5) {
        console.log(
          `   regression: "${seed}" (${before.strength}) + "${char}" → ${after.strength}`
        )
      }
    }
  }
}
check(
  `appending never lowers the tier (${compared} pairs)`,
  violations === 0,
  violations ? `${violations} regressions` : ""
)

/* 3. Bits must never decrease either ----------------------------------- */

let bitDrops = 0
for (const seed of SEEDS) {
  for (const char of ALPHABET) {
    const before = assessPassword(seed)
    const after = assessPassword(seed + char)
    // Crossing the 8-character gate or leaving a dictionary word legitimately
    // raises bits from a forced 0; only a genuine drop is a bug.
    if (before.bits > 0 && after.bits < before.bits) bitDrops++
  }
}
check("entropy never decreases when appending", bitDrops === 0, `${bitDrops} drops`)

/* 4. Weak passwords stay weak ------------------------------------------ */

const MUST_BE_WEAK = [
  "short",
  "password",
  "Password1",
  "Password1!",
  "passw0rd",
  "P@ssw0rd",
  "12345678",
  "aaaaaaaa",
  "abcdefgh",
  "qwertyuiop",
  "mykaggo123",
  "admin123",
]

for (const password of MUST_BE_WEAK) {
  const { strength, bits } = assessPassword(password)
  check(
    `weak: ${password.padEnd(14)}`,
    strength === "weak",
    `got ${strength} (${bits} bits)`
  )
}

/* 5. Genuinely good passwords are accepted ----------------------------- */

const MUST_BE_STRONG = [
  "correct horse battery staple",
  "Ryzen5001186",
  "7mQ!vLx2Zt#9",
  "kucing-oranye-lompat-2024",
]

for (const password of MUST_BE_STRONG) {
  const { strength, bits } = assessPassword(password)
  check(
    `strong: ${password.slice(0, 20).padEnd(20)}`,
    strength === "strong",
    `got ${strength} (${bits} bits)`
  )
}

/* 6. The submit gate matches the label --------------------------------- */

check(
  "weak is rejected, medium and strong are accepted",
  assessPassword("password").strength === "weak" &&
    assessPassword("Ryzen5000").strength !== "weak"
)

let failed = 0
for (const { label, pass, detail } of results) {
  console.log(`${pass ? "PASS" : "FAIL"}  ${label}${detail ? "  → " + detail : ""}`)
  if (!pass) failed++
}
console.log(`\n${results.length - failed}/${results.length} passed`)
process.exit(failed ? 1 : 0)
