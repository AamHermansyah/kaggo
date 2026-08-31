export type HeaderVariant = "home" | "inner" | "none"

export interface HeaderConfig {
  variant: HeaderVariant
  title?: string
  showBack?: boolean
}

export function resolveHeader(pathname: string): HeaderConfig {
  if (pathname === "/") {
    return { variant: "home", title: "MyKaggo Driver", showBack: false }
  }
  return { variant: "inner", title: "Driver Portal", showBack: true }
}

export function refineTitle(pathname: string, config: HeaderConfig): HeaderConfig {
  return config
}
