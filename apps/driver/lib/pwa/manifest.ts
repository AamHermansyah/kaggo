import type { MetadataRoute } from "next"

type Manifest = MetadataRoute.Manifest
type Icon = NonNullable<Manifest["icons"]>[number]

/**
 * One installable app per portal.
 *
 * A single manifest would always launch into `start_url` — the rider landing
 * page — and an installed PWA has no address bar, so company and admin users
 * had no way to reach their own portal at all. Chrome keys installed apps by
 * manifest `id`, so three manifests on the same origin install as three
 * separate apps, each opening straight into the right place.
 *
 * `scope` keeps each app in its own section: a link outside it opens in the
 * browser instead of the standalone window. That is also what sends the
 * Paystack hand-off to a real browser tab, where the payer can see the padlock
 * and the actual URL.
 */

const BRAND_GREEN = "#008967"

/** `?v=3` busts the icon cache — installed PWAs hold icons very aggressively. */
function icon(file: string, sizes: string, purpose: "any" | "maskable"): Icon {
  return { src: `/icons/${file}?v=3`, sizes, type: "image/png", purpose }
}

/**
 * Two icon sets on purpose: `any` is the full-bleed brand mark, `maskable` is
 * the padded variant so Android's adaptive masks cannot clip it. Using one file
 * for both is the usual way PWA icons end up cropped.
 */
const ICONS: Icon[] = [
  icon("icon-192x192.png", "192x192", "any"),
  icon("icon-512x512.png", "512x512", "any"),
  icon("icon-maskable-192x192.png", "192x192", "maskable"),
  icon("icon-maskable-512x512.png", "512x512", "maskable"),
]

const SHORTCUT_ICON = [icon("icon-192x192.png", "192x192", "any")]

/**
 * Screenshots unlock Chrome's app-store style install dialog. Optional — the
 * app installs either way. Chrome wants at least one `wide` entry for desktop
 * and one non-`wide` for mobile. Regenerate with `npm run shots`.
 */
const SCREENSHOTS: Manifest["screenshots"] = [
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
]

export interface PortalManifest {
  /** Stable identity of the installed app. Never change it after release. */
  id: string
  name: string
  shortName: string
  description: string
  startUrl: string
  scope: string
  shortcuts?: Manifest["shortcuts"]
}

export function buildManifest(portal: PortalManifest): Manifest {
  return {
    id: portal.id,
    // Chrome renders `name` under the icon on the Android splash screen, so it
    // stays the bare app name — the tagline lives in `description`, which is
    // what the install dialog shows.
    name: portal.name,
    short_name: portal.shortName,
    description: portal.description,
    lang: "en-NG",
    dir: "ltr",
    categories: ["business", "travel", "utilities"],

    start_url: portal.startUrl,
    scope: portal.scope,
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait",

    // Brand green here reproduces the iOS launch image on Android: the
    // white-on-green icon blends into the background so only the mark and the
    // app name read.
    background_color: BRAND_GREEN,
    theme_color: BRAND_GREEN,

    icons: ICONS,
    screenshots: SCREENSHOTS,
    shortcuts: portal.shortcuts,
  }
}

export function shortcut(
  name: string,
  shortName: string,
  description: string,
  url: string
): NonNullable<Manifest["shortcuts"]>[number] {
  return { name, short_name: shortName, description, url, icons: SHORTCUT_ICON }
}

/** Served as a Route Handler, so the content type has to be set by hand. */
export function manifestResponse(manifest: Manifest): Response {
  return Response.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      // Short cache: installed apps re-read this to pick up name/icon changes.
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  })
}
