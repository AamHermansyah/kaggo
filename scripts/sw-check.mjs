/**
 * Runs public/sw.js inside a mock ServiceWorkerGlobalScope and asserts the
 * decision tree — mainly that no HTML or RSC response can reach the cache.
 */
import fs from "node:fs"
import vm from "node:vm"

const ORIGIN = "https://kaggo.app"

const cachePuts = []
const cacheStore = new Map([["/offline", "OFFLINE_PAGE_HTML"]])

let fetchShouldFail = false
const listeners = {}

function makeResponse(body, init = {}) {
  return {
    body,
    ok: init.ok ?? true,
    status: init.status ?? 200,
    type: init.type ?? "basic",
    headers: { get: () => null },
    clone() {
      return this
    },
  }
}

const scope = {
  location: { origin: ORIGIN },
  registration: { navigationPreload: { enable: () => Promise.resolve() } },
  clients: { claim: () => {} },
  skipWaiting: () => {},
  addEventListener: (type, fn) => {
    listeners[type] = fn
  },
}
scope.self = scope

const sandbox = {
  self: scope,
  URL,
  Response: function (body, init) {
    return makeResponse(body, init)
  },
  Promise,
  console,
  caches: {
    open: async () => ({
      add: async () => {},
      // Records what the worker tries to persist; the body is irrelevant here.
      put: async (req) => cachePuts.push(req.url ?? String(req)),
    }),
    keys: async () => [],
    delete: async () => true,
    match: async (req) => {
      const key = typeof req === "string" ? req : req.url
      const path = key.startsWith("http") ? new URL(key).pathname : key
      const hit = cacheStore.get(path)
      return hit ? makeResponse(hit) : undefined
    },
  },
  fetch: async () => {
    if (fetchShouldFail) throw new Error("offline")
    return makeResponse("NETWORK")
  },
}
sandbox.globalThis = sandbox

vm.createContext(sandbox)
vm.runInContext(fs.readFileSync("apps/user-company/public/sw.js", "utf8"), sandbox)


function request({ url, method = "GET", mode = "no-cors", headers = {} }) {
  return {
    url,
    method,
    mode,
    headers: { get: (k) => headers[k] ?? null },
  }
}

async function run(req, { preload = undefined } = {}) {
  let responded = null
  const event = {
    request: req,
    preloadResponse: Promise.resolve(preload),
    respondWith: (p) => {
      responded = p
    },
  }
  await listeners.fetch(event)
  const value = responded ? await responded : null
  // let queued cache.put microtasks settle
  await new Promise((r) => setImmediate(r))
  return { intercepted: responded !== null, response: value }
}

const results = []
function check(label, pass, detail = "") {
  results.push({ label, pass, detail })
}

// 1. Server Action POST must reach the network untouched.
{
  const r = await run(
    request({ url: `${ORIGIN}/send-item`, method: "POST", mode: "navigate" })
  )
  check("POST (Server Action) not intercepted", !r.intercepted)
}

// 2. Navigation is intercepted but never cached.
{
  cachePuts.length = 0
  const r = await run(
    request({ url: `${ORIGIN}/track`, mode: "navigate" })
  )
  check("navigation intercepted", r.intercepted)
  check("navigation response NOT written to cache", cachePuts.length === 0, cachePuts.join(","))
  check("navigation served from network", r.response?.body === "NETWORK")
}

// 3. Navigation while offline falls back to the precached offline page.
{
  fetchShouldFail = true
  cachePuts.length = 0
  const r = await run(request({ url: `${ORIGIN}/dashboard/users`, mode: "navigate" }))
  check("offline navigation returns fallback", r.response?.body === "OFFLINE_PAGE_HTML")
  check("offline navigation writes nothing to cache", cachePuts.length === 0)
  fetchShouldFail = false
}

// 4. RSC payloads are never intercepted.
{
  const a = await run(
    request({ url: `${ORIGIN}/track`, headers: { RSC: "1" } })
  )
  const b = await run(request({ url: `${ORIGIN}/track?_rsc=abc123` }))
  check("RSC header request not intercepted", !a.intercepted)
  check("?_rsc= request not intercepted", !b.intercepted)
}

// 5. Static assets are cache-first and DO get cached.
{
  cachePuts.length = 0
  const r = await run(request({ url: `${ORIGIN}/_next/static/chunks/main.js` }))
  check("static asset intercepted", r.intercepted)
  check("static asset written to cache", cachePuts.length === 1, cachePuts.join(","))
}

// 6. Cross-origin (Paystack checkout) is never touched.
{
  const r = await run(
    request({ url: "https://checkout.paystack.com/abc", mode: "navigate" })
  )
  check("cross-origin request not intercepted", !r.intercepted)
}

// 7. An API-shaped same-origin GET that is not a known asset is left alone.
{
  cachePuts.length = 0
  const r = await run(request({ url: `${ORIGIN}/dashboard/logout` }))
  check("non-asset same-origin GET not intercepted", !r.intercepted)
  check("nothing cached for it", cachePuts.length === 0)
}

let failed = 0
for (const { label, pass, detail } of results) {
  console.log(`${pass ? "PASS" : "FAIL"}  ${label}${detail ? "  → " + detail : ""}`)
  if (!pass) failed++
}
console.log(`\n${results.length - failed}/${results.length} passed`)
process.exit(failed ? 1 : 0)
