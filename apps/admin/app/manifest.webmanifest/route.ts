import { buildManifest, manifestResponse, shortcut } from "@/lib/pwa/manifest"

export function GET() {
  return manifestResponse(
    buildManifest({
      id: "/admin",
      name: "MyKaggo Admin",
      shortName: "Admin",
      description:
        "Operations console for MyKaggo staff: shipments, users, vehicles, revenue and pricing.",
      startUrl: "/",
      scope: "/",
      shortcuts: [
        shortcut(
          "Companies",
          "Companies",
          "Logistics companies management",
          "/companies"
        ),
        shortcut(
          "Vehicles",
          "Vehicles",
          "Fleet and GPS device status",
          "/vehicles"
        ),
        shortcut(
          "Shipments",
          "Shipments",
          "Every parcel listed on MyKaggo",
          "/shipments"
        ),
        shortcut(
          "Revenue",
          "Revenue",
          "Settled payments and revenue analytics",
          "/revenue"
        ),
      ],
    })
  )
}
