/**
 * Kaggo service worker.
 *
 * SECURITY: this never caches HTML or RSC responses.
 *
 * An earlier version cached every navigation, which meant a signed-in rider's
 * parcels — and, worse, the admin dashboard's user list and revenue — were
 * written to the Cache API and served back to whoever opened the app next on
 * that device, signed in or not.
 *
 * Offline support is provided instead by one precached, session-free fallback
 * page: real pages always go to the network, and only the failure path is
 * served from cache.
 */
const CACHE_NAME = "kaggo-v5"

const OFFLINE_URL = "/offline"

const PRECACHE = [
  OFFLINE_URL,
  "/icons/icon-192x192.png?v=3",
  "/icons/icon-512x512.png?v=3",
  "/icons/icon-maskable-192x192.png?v=3",
  "/icons/icon-maskable-512x512.png?v=3",
  "/images/logo.png",
  "/images/logo-with-text.png",
  "/images/hero.jpg",
]

/** Immutable, identity-free assets. Everything else is network-only. */
const CACHEABLE_PREFIXES = ["/icons/", "/images/", "/_next/static/"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      // One missing file must not abort the whole install.
      .then((cache) =>
        Promise.allSettled(PRECACHE.map((asset) => cache.add(asset)))
      )
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .keys()
        .then((names) =>
          Promise.all(
            names
              .filter((name) => name !== CACHE_NAME)
              .map((name) => caches.delete(name))
          )
        ),
      // Lets the browser answer navigations from its own HTTP cache without
      // waking this worker first.
      self.registration.navigationPreload?.enable(),
    ])
  )
  self.clients.claim()
})

function isCacheableAsset(url) {
  return CACHEABLE_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))
}

const OFFLINE_FALLBACK_HTML =
  "<!doctype html><meta charset=utf-8><title>You are offline</title>" +
  "<body style=\"font-family:system-ui;margin:0;display:grid;place-items:center;height:100vh;text-align:center\">" +
  "<div><h1>You are offline</h1><p>Reconnect and try again.</p></div>"

self.addEventListener("fetch", (event) => {
  const { request } = event

  // Mutations (Server Actions, logout posts) must always reach the server.
  if (request.method !== "GET") return

  const url = new URL(request.url)

  // Only same-origin, only http(s).
  if (url.origin !== self.location.origin) return
  if (!url.protocol.startsWith("http")) return

  /**
   * Navigations: network-first with NO caching of the response. On failure the
   * precached offline page is shown. The address bar keeps the requested URL,
   * so the page's "Try again" simply reloads it.
   */
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloaded = await event.preloadResponse
          if (preloaded) return preloaded
          return await fetch(request)
        } catch {
          const cached = await caches.match(OFFLINE_URL)
          return (
            cached ??
            new Response(OFFLINE_FALLBACK_HTML, {
              status: 503,
              headers: { "Content-Type": "text/html; charset=utf-8" },
            })
          )
        }
      })()
    )
    return
  }

  // RSC payloads are session-scoped: never cached, never served from cache.
  if (request.headers.get("RSC") || url.searchParams.has("_rsc")) return

  if (!isCacheableAsset(url)) return

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached

      return fetch(request).then((response) => {
        // Opaque and error responses are not worth persisting.
        if (response.ok && response.type === "basic") {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        }
        return response
      })
    })
  )
})
