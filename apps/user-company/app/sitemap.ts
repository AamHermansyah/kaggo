import type { MetadataRoute } from "next"

import { env } from "@/lib/env"
import { ROUTES } from "@/lib/routes"

/** Public, indexable pages only — everything else needs a session. */
export default function sitemap(): MetadataRoute.Sitemap {
  const absolute = (path: string) =>
    new URL(path, env.NEXT_PUBLIC_SITE_URL).toString()

  return [
    {
      url: absolute(ROUTES.home),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absolute(ROUTES.companyHome),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absolute(ROUTES.companyRegister),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absolute(ROUTES.about),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absolute(ROUTES.privacy),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absolute(ROUTES.terms),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]
}
