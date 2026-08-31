import { buildManifest, manifestResponse, shortcut } from "@/lib/pwa/manifest"
import { ROUTES } from "@/lib/routes"

/**
 * Company portal app.
 *
 * Served as a Route Handler because Next's `manifest.ts` file convention only
 * works at the app root. Installing from `/company` gives logistics staff their
 * own icon that opens on the company landing page instead of the rider home.
 *
 * `scope` is `/company`, so this app covers login, register, dashboard,
 * batches and vehicles, and nothing else.
 */
export function GET() {
  return manifestResponse(
    buildManifest({
      id: ROUTES.companyHome,
      name: "MyKaggo Business",
      shortName: "MyKaggo Biz",
      description:
        "Manage package batches, assign drivers and track your fleet on MyKaggo.",
      startUrl: ROUTES.companyHome,
      scope: ROUTES.companyHome,
      shortcuts: [
        shortcut(
          "Company dashboard",
          "Dashboard",
          "Today's packages, batches and journeys",
          ROUTES.companyDashboard
        ),
        shortcut(
          "Batch manager",
          "Batches",
          "Active batches and driver assignment",
          ROUTES.companyBatches
        ),
      ],
    })
  )
}
