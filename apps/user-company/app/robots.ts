import type { MetadataRoute } from "next"

import { env } from "@/lib/env"
import { PUBLIC_PAGES } from "@/lib/routes"

/**
 * Only the public marketing and legal pages are crawlable. Everything behind an
 * identity — rider parcels, both portals, the payment hand-off — is disallowed,
 * and those pages also carry `robots: { index: false }` so a crawler that
 * ignores this file still gets told.
 *
 * The allow list is derived from `PUBLIC_PAGES` so it cannot drift from the
 * sitemap when a page is added.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [...PUBLIC_PAGES],
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
