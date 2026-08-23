import type { MetadataRoute } from "next"

import { buildManifest, shortcut } from "@/lib/pwa/manifest"
import { ROUTES } from "@/lib/routes"

/**
 * Rider app — the one installed from the public site.
 *
 * The company and admin portals ship their own manifests
 * (`/company/manifest.webmanifest`, `/dashboard/manifest.webmanifest`) so each
 * installs as a separate app opening on its own start page. See
 * `lib/pwa/manifest.ts`.
 */
export default function manifest(): MetadataRoute.Manifest {
  return buildManifest({
    id: "/",
    name: "MyKaggo",
    shortName: "MyKaggo",
    description:
      "Track your parcel from departure to destination. MyKaggo gives senders and receivers live visibility over intercity road deliveries across Nigeria.",
    startUrl: ROUTES.home,
    // Deliberately the whole origin: a rider who follows the "for logistics
    // companies" link should stay in the app rather than being thrown into a
    // browser tab.
    scope: "/",
    shortcuts: [
      shortcut(
        "Track my parcels",
        "Track",
        "See where your packages are right now",
        ROUTES.track
      ),
      shortcut(
        "List an item",
        "List",
        "Send a parcel and start tracking it",
        ROUTES.riderIdentify
      ),
    ],
  })
}
