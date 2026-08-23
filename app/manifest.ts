import type { MetadataRoute } from "next"

/**
 * Web app manifest.
 *
 * `?v=3` busts the icon cache: installed PWAs hold on to their icons very
 * aggressively, and the maskable variants below are new.
 *
 * Two icon sets on purpose:
 * - `purpose: "any"` — the full-bleed brand icon, used as-is.
 * - `purpose: "maskable"` — the same mark with padding, so Android's adaptive
 *   masks (circle, squircle, teardrop) cannot clip the logo. Declaring one
 *   file for both purposes is the usual way PWA icons end up cropped.
 */
export default function manifest(): MetadataRoute.Manifest {
  const icon = (
    file: string,
    sizes: string,
    purpose: "any" | "maskable"
  ) => ({
    src: `/icons/${file}?v=3`,
    sizes,
    type: "image/png",
    purpose,
  })

  return {
    // A stable `id` keeps this the same installed app across future
    // `start_url` changes.
    id: "/",
    // Chrome renders `name` underneath the icon on the Android splash
    // screen, so it is the bare brand rather than a tagline — the tagline
    // lives in `description`, which the install dialog shows instead.
    name: "MyKaggo",
    short_name: "MyKaggo",
    description:
      "Track your parcel from departure to destination. MyKaggo gives senders and receivers live visibility over intercity road deliveries across Nigeria.",
    lang: "en-NG",
    dir: "ltr",
    categories: ["business", "travel", "utilities"],

    start_url: "/",
    // `scope` keeps Paystack checkout out of the standalone window: the payment
    // hand-off opens in the browser, which is what shows the padlock and the
    // real URL to the payer.
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait",

    // Android draws its splash as the icon over `background_color` with
    // `name` underneath, so brand green here reproduces the iOS launch
    // image: the white-on-green icon blends into the background and only
    // the mark and "MyKaggo" read.
    background_color: "#008967",
    theme_color: "#008967",

    icons: [
      icon("icon-192x192.png", "192x192", "any"),
      icon("icon-512x512.png", "512x512", "any"),
      icon("icon-maskable-192x192.png", "192x192", "maskable"),
      icon("icon-maskable-512x512.png", "512x512", "maskable"),
    ],

    /**
     * Screenshots unlock Chrome's "richer install UI" — the app-store style
     * install dialog. Purely optional: without them the app is still fully
     * installable, the dialog is just the plain one.
     *
     * Chrome needs at least one `wide` entry for desktop and one non-`wide`
     * entry for mobile, every entry between 320px and 3840px with the longer
     * side no more than 2.3x the shorter, and a consistent aspect ratio within
     * each form factor. Regenerate with `npm run shots` after UI changes.
     */
    screenshots: [
      {
        src: "/screenshots/mobile-home.jpg",
        sizes: "430x892",
        type: "image/jpeg",
        form_factor: "narrow",
        label: "Track a parcel from the MyKaggo home screen",
      },
      {
        src: "/screenshots/mobile-company.jpg",
        sizes: "430x892",
        type: "image/jpeg",
        form_factor: "narrow",
        label: "Register your logistics company on MyKaggo",
      },
      {
        src: "/screenshots/desktop-home.jpg",
        sizes: "1280x800",
        type: "image/jpeg",
        form_factor: "wide",
        label: "Track a parcel from the MyKaggo home screen",
      },
      {
        src: "/screenshots/desktop-company.jpg",
        sizes: "1280x800",
        type: "image/jpeg",
        form_factor: "wide",
        label: "Register your logistics company on MyKaggo",
      },
    ],

    shortcuts: [
      {
        name: "Track my parcels",
        short_name: "Track",
        description: "See where your packages are right now",
        url: "/track",
        icons: [icon("icon-192x192.png", "192x192", "any")],
      },
      {
        name: "List an item",
        short_name: "List",
        description: "Send a parcel and start tracking it",
        url: "/list-item",
        icons: [icon("icon-192x192.png", "192x192", "any")],
      },
    ],
  }
}
