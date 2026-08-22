import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kaggo - Track & Deliver",
    short_name: "Kaggo",
    description:
      "Track it with Kaggo! Send items, track packages, and manage deliveries.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#008967",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192x192.png?v=2",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png?v=2",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png?v=2",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
