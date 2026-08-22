import type { MetadataRoute } from "next"

import { env } from "@/lib/env"

/**
 * Only the two marketing pages are crawlable. Everything behind an identity —
 * rider parcels, both portals, the payment hand-off — is disallowed, and the
 * pages themselves also carry `robots: { index: false }` so a crawler that
 * ignores this file still gets told.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/company", "/company/register"],
        disallow: [
          "/dashboard",
          "/onboarding",
          "/list-item",
          "/send-item",
          "/track",
          "/payment",
          "/company/login",
          "/company/dashboard",
          "/company/batches",
          "/company/vehicles",
          "/company/submitted",
          // Service-worker fallback, not a real destination.
          "/offline",
        ],
      },
    ],
    sitemap: new URL("/sitemap.xml", env.NEXT_PUBLIC_SITE_URL).toString(),
  }
}
