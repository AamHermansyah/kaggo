import { ROUTES } from "./routes"

/**
 * Request header the proxy stamps with the originally requested pathname.
 *
 * Unmatched URLs render the `/_not-found` segment, so `usePathname()` reports
 * that rather than what the visitor typed. Server Components read this
 * instead when they need the real path.
 */
export const PATHNAME_HEADER = "x-kaggo-pathname"

export interface HomeTarget {
  href: string
  /** Full button label, e.g. "Back to company home". */
  label: string
}

/**
 * "Home" depends on which portal the visitor is in.
 *
 * A company user who hits an error inside `/company/*` should land back on the
 * company portal, not on the rider marketing page — and likewise for admin
 * staff. Error and offline screens use this so the escape hatch stays inside
 * the section the visitor was actually using.
 */
const RIDER_HOME: HomeTarget = { href: ROUTES.home, label: "Back to home" }

const COMPANY_HOME: HomeTarget = {
  href: ROUTES.companyHome,
  label: "Back to company home",
}

const ADMIN_HOME: HomeTarget = {
  href: ROUTES.adminHome,
  label: "Back to dashboard",
}

/**
 * Auth screens have no signed-in home to go back to — pointing at a protected
 * route would just bounce the visitor through the proxy back to the login page.
 * These send them to the portal's public entry instead.
 */
const AUTH_SCREEN_HOME: Record<string, HomeTarget> = {
  [ROUTES.adminLogin]: RIDER_HOME,
  [ROUTES.companyLogin]: COMPANY_HOME,
  [ROUTES.companyRegister]: COMPANY_HOME,
}

function inSection(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

export function homeFor(pathname: string): HomeTarget {
  const authScreen = AUTH_SCREEN_HOME[pathname]
  if (authScreen) return authScreen

  if (inSection(pathname, "/company")) return COMPANY_HOME

  // `/onboarding` is the admin vehicle-onboarding flow, so it belongs to the
  // admin portal even though it sits outside `/dashboard`.
  if (inSection(pathname, "/dashboard") || inSection(pathname, "/onboarding")) {
    return ADMIN_HOME
  }

  return RIDER_HOME
}

/**
 * Whether the visitor is already standing on their home page — used to hide a
 * "back to home" button that would do nothing.
 *
 * `/dashboard` counts as the admin home because it redirects straight to
 * `ROUTES.adminHome`.
 */
export function isAtHome(pathname: string): boolean {
  if (pathname === "/dashboard") return true
  return pathname === homeFor(pathname).href
}
