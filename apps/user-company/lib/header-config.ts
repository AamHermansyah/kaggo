export type HeaderVariant = "home" | "company-home" | "inner" | "none"

export interface HeaderConfig {
  variant: HeaderVariant
  title?: string
  showBack?: boolean
}

interface HeaderRule extends HeaderConfig {
  match: string
}

const RULES: readonly HeaderRule[] = [
  /* chrome-less success screens ---------------------------------------- */
  { match: "/company/submitted", variant: "none" },
  { match: "/company/batches/assign-driver/success", variant: "none" },
  { match: "/send-item/success", variant: "none" },
  { match: "/offline", variant: "none" },

  /* landing pages ------------------------------------------------------- */
  { match: "/", variant: "home" },
  { match: "/about", variant: "inner", title: "About Us" },
  { match: "/privacy", variant: "inner", title: "Privacy Policy" },
  { match: "/terms", variant: "inner", title: "Terms of Use" },
  { match: "/company", variant: "company-home" },

  /* company portal ------------------------------------------------------ */
  { match: "/company/dashboard", variant: "inner", title: "Dashboard", showBack: false },
  { match: "/company/register", variant: "inner", title: "Create Account", showBack: true },
  { match: "/company/login", variant: "inner", title: "Login", showBack: true },
  { match: "/company/batches/create", variant: "inner", title: "Create New Batch" },
  { match: "/company/batches/assign-driver", variant: "inner", title: "Assign Driver" },
  { match: "/company/batches*", variant: "inner", title: "Batch Manager" },
  { match: "/company/vehicles*", variant: "inner", title: "Vehicles" },

  /* rider --------------------------------------------------------------- */
  { match: "/track", variant: "inner", title: "Track Item" },
  { match: "/list-item*", variant: "inner", title: "List Item" },
  { match: "/send-item", variant: "inner", title: "Send Item" },
  { match: "/payment*", variant: "inner", title: "Payment", showBack: false },
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
  if (!segment) return "Kaggo"
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

  return { variant: "inner", title: fallbackTitle(pathname), showBack: true }
}

export function refineTitle(pathname: string, config: HeaderConfig): HeaderConfig {
  if (/^\/company\/batches\/[^/]+\/packages$/.test(pathname)) {
    return { ...config, title: "Package List" }
  }
  return config
}
