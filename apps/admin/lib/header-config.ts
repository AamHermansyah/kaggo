export type HeaderVariant = "admin" | "inner" | "none"

export interface HeaderConfig {
  variant: HeaderVariant
  title?: string
  showBack?: boolean
}

interface HeaderRule extends HeaderConfig {
  match: string
}

const RULES: readonly HeaderRule[] = [
  { match: "/vehicles/new/success", variant: "none" },
  { match: "/login", variant: "inner", title: "Admin sign in", showBack: false },
  { match: "/settings", variant: "admin", title: "Settings" },
  { match: "/vehicles/new", variant: "admin", title: "Vehicle Onboarding" },
  { match: "/vehicles", variant: "admin", title: "Vehicles" },
  { match: "/companies", variant: "admin", title: "Companies" },
  { match: "/users", variant: "admin", title: "Users" },
  { match: "/shipments", variant: "admin", title: "Shipments" },
  { match: "/revenue", variant: "admin", title: "Revenue" },
  { match: "/", variant: "admin", title: "Dashboard" },
]

function matches(pathname: string, rule: HeaderRule): boolean {
  if (rule.match.endsWith("*")) {
    const prefix = rule.match.slice(0, -1)
    return pathname === prefix || pathname.startsWith(prefix)
  }
  return pathname === rule.match
}

function fallbackTitle(pathname: string): string {
  const segment = pathname.split("/")[1] ?? ""
  if (!segment) return "Dashboard"
  return (
    segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
  )
}

export function resolveHeader(pathname: string): HeaderConfig {
  const rule = RULES.find((candidate) => matches(pathname, candidate))
  if (rule) {
    return {
      variant: rule.variant,
      title: rule.title,
      showBack: rule.showBack ?? true,
    }
  }

  return { variant: "admin", title: fallbackTitle(pathname), showBack: true }
}

export function refineTitle(pathname: string, config: HeaderConfig): HeaderConfig {
  return config
}
