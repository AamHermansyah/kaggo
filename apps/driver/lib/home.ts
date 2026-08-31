import { ROUTES } from "./routes"

export const PATHNAME_HEADER = "x-kaggo-pathname"

export interface HomeTarget {
  href: string
  label: string
}

const DRIVER_HOME: HomeTarget = {
  href: ROUTES.home,
  label: "Back to portal",
}

export function homeFor(_pathname: string): HomeTarget {
  return DRIVER_HOME
}

export function isAtHome(pathname: string): boolean {
  return pathname === ROUTES.home
}
