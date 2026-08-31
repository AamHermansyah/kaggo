import { ROUTES } from "./routes"

export const PATHNAME_HEADER = "x-kaggo-pathname"

export interface HomeTarget {
  href: string
  label: string
}

const ADMIN_HOME: HomeTarget = {
  href: ROUTES.adminHome,
  label: "Back to dashboard",
}

export function homeFor(_pathname: string): HomeTarget {
  return ADMIN_HOME
}

export function isAtHome(pathname: string): boolean {
  return pathname === "/" || pathname === ROUTES.adminHome
}
