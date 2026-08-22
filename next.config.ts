import type { NextConfig } from "next"

const isProduction = process.env.NODE_ENV === "production"

/**
 * Content Security Policy.
 *
 * `'unsafe-inline'` is required for scripts because Next.js injects its inline
 * bootstrap. The nonce-based alternative would force every route to render
 * dynamically, which is not worth it here — no user-supplied HTML is ever
 * rendered, and `object-src`/`base-uri`/`frame-ancestors` close the routes that
 * actually matter. `connect-src` stays same-origin because the browser never
 * talks to the Kaggo API directly; all of that happens server-side.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'" + (isProduction ? "" : " 'unsafe-eval'"),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  // The service worker is same-origin; without this it would only be allowed
  // by the `default-src` fallback, which is easy to tighten by accident.
  "worker-src 'self'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "manifest-src 'self'",
  ...(isProduction ? ["upgrade-insecure-requests"] : []),
].join("; ")

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  ...(isProduction
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Files in `public/` are served with a long-lived cache by default.
        // A stale service worker would keep the old caching rules alive on
        // devices that already installed the PWA, so this one must always be
        // revalidated.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ]
  },
}

export default nextConfig
