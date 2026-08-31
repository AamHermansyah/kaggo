/**
 * Single source of truth for internal paths in the Admin application.
 */
export const ROUTES = {
  home: "/",

  /* admin portal routes -------------------------------------------------- */
  adminHome: "/shipments",
  adminLogin: "/login",
  adminLogout: "/logout",
  adminManifest: "/manifest.webmanifest",
  adminShipments: "/shipments",
  adminUsers: "/users",
  adminVehicles: "/vehicles",
  adminCompanies: "/companies",
  adminRevenue: "/revenue",
  adminSettings: "/settings",
  vehicleOnboarding: "/vehicles/new",
  vehicleOnboardingSuccess: "/vehicles/new/success",

  /* company/rider references (if needed) --------------------------------- */
  companyHome: "/",
  companyLogin: "/login",
  riderIdentify: "/login",
} as const

export const ADMIN_PROTECTED_PREFIXES = [
  "/shipments",
  "/users",
  "/vehicles",
  "/companies",
  "/revenue",
  "/settings",
] as const

export const ADMIN_PUBLIC_PATHS = [
  ROUTES.adminLogin,
  ROUTES.adminLogout,
  ROUTES.adminManifest,
] as const
