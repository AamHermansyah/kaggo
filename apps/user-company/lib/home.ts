import { ROUTES } from "./routes"

export const PATHNAME_HEADER = "x-kaggo-pathname"

export interface HomeTarget {
  href: string
  label: string
}

const RIDER_HOME: HomeTarget = { href: ROUTES.home, label: "Back to home" }

const COMPANY_HOME: HomeTarget = {
  href: ROUTES.companyHome,
  label: "Back to company home",
}

const AUTH_SCREEN_HOME: Record<string, HomeTarget> = {
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

  return RIDER_HOME
}

export function isAtHome(pathname: string): boolean {
  return pathname === homeFor(pathname).href
}
