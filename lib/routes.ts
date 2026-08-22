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
  adminHome: "/dashboard/shipments",
  adminShipments: "/dashboard/shipments",
  adminUsers: "/dashboard/users",
  adminVehicles: "/dashboard/vehicles",
  adminRevenue: "/dashboard/revenue",
  adminSettings: "/dashboard/settings",
  vehicleOnboarding: "/onboarding",
  vehicleOnboardingSuccess: "/onboarding/success",

  /* company portal ------------------------------------------------------- */
  companyHome: "/company",
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

/** Paths that require an admin session. */
export const ADMIN_PROTECTED_PREFIXES = ["/dashboard", "/onboarding"] as const

/** Admin paths that must stay reachable while signed out. */
export const ADMIN_PUBLIC_PATHS = [ROUTES.adminLogin] as const

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
