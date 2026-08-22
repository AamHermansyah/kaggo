/**
 * Regenerates the manifest screenshots that power Chrome's richer install UI.
 *
 *   npm run build && npm start        # in one terminal
 *   npm run shots                     # in another
 *   npm run shots -- http://localhost:3001   # against a different port
 *
 * Uses the locally installed Chrome rather than a bundled browser, so nothing
 * extra has to be downloaded.
 *
 * Two quirks this works around:
 * - Chrome's `--screenshot` always writes PNG, whatever the filename says, so
 *   the captures are converted to JPEG afterwards (~85KB instead of ~430KB).
 * - Windows clamps a headless window to about 500px wide, so a narrow capture
 *   is taken at 500px and the centred app column (`max-w-107.5` = 430px) is
 *   cropped out. The pixels are the real rendered app either way.
 */
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import sharp from "sharp"

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
]

const CHROME = CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate))
if (!CHROME) {
  console.error(
    "No Chrome or Edge binary found. Checked:\n  " +
      CHROME_CANDIDATES.join("\n  ")
  )
  process.exit(1)
}

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/+$/, "")
const OUT = path.resolve("public/screenshots")
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "kaggo-shots-"))

const NARROW = { width: 430, height: 892 }
const WIDE = { width: 1280, height: 800 }
const CAPTURE_WIDTH = 500 // Windows' minimum headless window width
const JPEG = { quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" }

const TARGETS = [
  { name: "mobile-home", url: "/", form: "narrow" },
  { name: "mobile-company", url: "/company", form: "narrow" },
  { name: "desktop-home", url: "/", form: "wide" },
  { name: "desktop-company", url: "/company", form: "wide" },
]

fs.mkdirSync(OUT, { recursive: true })

function capture(file, width, height, url) {
  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--virtual-time-budget=8000",
      `--window-size=${width},${height}`,
      `--screenshot=${file}`,
      url,
    ],
    { stdio: "ignore" }
  )
}

/** Left edge of the app column, found by skipping the muted body gutter. */
async function appColumnLeft(file) {
  const { data, info } = await sharp(file)
    .raw()
    .toBuffer({ resolveWithObject: true })

  const y = Math.floor(info.height / 2)
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * info.channels
    const isGutter =
      Math.abs(data[i] - 241) < 8 &&
      Math.abs(data[i + 1] - 243) < 8 &&
      Math.abs(data[i + 2] - 243) < 8
    if (!isGutter) return x
  }
  return 0
}

async function verify(file, note) {
  const meta = await sharp(file).metadata()
  const ratio =
    Math.max(meta.width, meta.height) / Math.min(meta.width, meta.height)
  const ok =
    meta.width >= 320 &&
    meta.height >= 320 &&
    meta.width <= 3840 &&
    meta.height <= 3840 &&
    ratio <= 2.3

  console.log(
    `${path.basename(file).padEnd(24)} ${`${meta.width}x${meta.height}`.padEnd(10)} ratio ${ratio.toFixed(2)}  ${`${(fs.statSync(file).size / 1024).toFixed(0)}KB`.padEnd(7)} ${ok ? "ok" : "OUT OF CHROME'S RANGE"}  (${note})`
  )
  return ok
}

let allOk = true

for (const target of TARGETS) {
  const raw = path.join(TMP, `${target.name}.png`)
  const out = path.join(OUT, `${target.name}.jpg`)
  const url = `${BASE}${target.url}`

  if (target.form === "narrow") {
    capture(raw, CAPTURE_WIDTH, NARROW.height, url)
    const left = await appColumnLeft(raw)
    await sharp(raw)
      .extract({ left, top: 0, width: NARROW.width, height: NARROW.height })
      .jpeg(JPEG)
      .toFile(out)
    allOk = (await verify(out, `narrow, cropped from x=${left}`)) && allOk
  } else {
    capture(raw, WIDE.width, WIDE.height, url)
    await sharp(raw).jpeg(JPEG).toFile(out)
    allOk = (await verify(out, "wide, full viewport")) && allOk
  }
}

fs.rmSync(TMP, { recursive: true, force: true })

console.log(
  `\n${TARGETS.length} screenshots written to public/screenshots/. ` +
    "Keep the sizes in app/manifest.ts in sync."
)
process.exit(allOk ? 0 : 1)
