/**
 * Single source of truth for internal paths.
 *
 * Shared by pages, the proxy matcher, the sitemap and the nav, so a route can
 * be renamed in one place. Framework-free on purpose — `proxy.ts` imports it
 * too and runs outside the React module graph.
 */
export const ROUTES = {
  home: "/",

  /* rider ---------------------------------------------------------------- */
  riderIdentify: "/list-item",
  sendItem: "/send-item",
  sendItemSuccess: "/send-item/success",
  track: "/track",
  paymentCallback: "/payment/callback",
  payment: (shipmentId: string) => `/payment/${shipmentId}`,

  /* admin portal --------------------------------------------------------- */
  adminLogin: "/dashboard/login",
  adminManifest: "/dashboard/manifest.webmanifest",
  adminHome: "/dashboard/shipments",
  adminShipments: "/dashboard/shipments",
  adminUsers: "/dashboard/users",
  adminVehicles: "/dashboard/vehicles",
  adminRevenue: "/dashboard/revenue",
  adminSettings: "/dashboard/settings",
  vehicleOnboarding: "/dashboard/vehicles/new",
  vehicleOnboardingSuccess: "/dashboard/vehicles/new/success",

  /* company portal ------------------------------------------------------- */
  companyHome: "/company",
  companyManifest: "/company/manifest.webmanifest",
  companyLogin: "/company/login",
  companyRegister: "/company/register",
  companySubmitted: "/company/submitted",
  companyDashboard: "/company/dashboard",
  companyBatches: "/company/batches",
  companyBatchCreate: "/company/batches/create",
  companyAssignDriver: "/company/batches/assign-driver",
  companyVehicles: "/company/vehicles",
  companyVehicleOnboarding: "/company/vehicles/onboarding",
} as const

/**
 * Paths that require an admin session.
 *
 * `/onboarding` is now only a redirect stub kept for old links — the flow
 * itself moved under `/dashboard` so the admin PWA's `scope` covers it.
 * Without that, tapping "Add new vehicle" inside the installed app would
 * leave the standalone window and open a browser tab.
 */
export const ADMIN_PROTECTED_PREFIXES = ["/dashboard", "/onboarding"] as const

/**
 * Admin paths that must stay reachable while signed out.
 *
 * The manifest is included because the browser fetches it to offer the
 * install prompt, which happens before anyone signs in. Without this the
 * proxy would redirect that fetch to the login page and the admin app would
 * never become installable. It carries no data.
 */
export const ADMIN_PUBLIC_PATHS = [
  ROUTES.adminLogin,
  ROUTES.adminManifest,
] as const

/** Paths that require a company session. */
export const COMPANY_PROTECTED_PREFIXES = [
  "/company/dashboard",
  "/company/batches",
  "/company/vehicles",
] as const

/** Paths that require a rider identity. */
export const RIDER_PROTECTED_PREFIXES = [
  "/send-item",
  "/track",
  "/payment",
] as const

/** Publicly indexable marketing pages. */
export const PUBLIC_PAGES = [ROUTES.home, ROUTES.companyHome] as const
