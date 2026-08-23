import { buildManifest, manifestResponse, shortcut } from "@/lib/pwa/manifest"
import { ROUTES } from "@/lib/routes"

/**
 * Admin portal app.
 *
 * Staff install it once from the browser; afterwards the icon opens straight
 * into the dashboard. There is deliberately no public link to it anywhere in
 * the rider or company UI.
 *
 * The manifest itself must stay readable while signed out — the browser fetches
 * it to offer the install prompt, which happens before anyone logs in. It is
 * therefore listed in `ADMIN_PUBLIC_PATHS`; it contains no data.
 */
export function GET() {
  return manifestResponse(
    buildManifest({
      id: "/dashboard",
      name: "MyKaggo Admin",
      shortName: "MyKaggo Admin",
      description:
        "Operations console for MyKaggo staff: shipments, users, vehicles, revenue and pricing.",
      startUrl: ROUTES.adminHome,
      scope: "/dashboard",
      shortcuts: [
        shortcut(
          "Shipments",
          "Shipments",
          "Every parcel listed on MyKaggo",
          ROUTES.adminShipments
        ),
        shortcut(
          "Vehicles",
          "Vehicles",
          "Fleet and GPS device status",
          ROUTES.adminVehicles
        ),
      ],
    })
  )
}
