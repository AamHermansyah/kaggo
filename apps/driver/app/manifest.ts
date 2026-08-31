import type { MetadataRoute } from "next"

import { buildManifest, shortcut } from "@/lib/pwa/manifest"

export default function manifest(): MetadataRoute.Manifest {
  return buildManifest({
    id: "/driver",
    name: "MyKaggo Driver",
    shortName: "Driver",
    description:
      "Driver vehicle identification, live GPS status and trip monitoring on MyKaggo.",
    startUrl: "/",
    scope: "/",
    shortcuts: [
      shortcut(
        "Find My Vehicle",
        "Vehicle",
        "Check vehicle connection and GPS status",
        "/"
      ),
    ],
  })
}
