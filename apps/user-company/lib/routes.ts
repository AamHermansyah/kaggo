/**
 * Single source of truth for internal paths in User & Company application.
 */
export const ROUTES = {
  home: "/",

  /* public content ------------------------------------------------------ */
  about: "/about",
  privacy: "/privacy",
  terms: "/terms",

  /* rider ---------------------------------------------------------------- */
  riderIdentify: "/list-item",
  riderLogout: "/logout",
  sendItem: "/send-item",
  sendItemSuccess: "/send-item/success",
  track: "/track",
  paymentCallback: "/payment/callback",
  payment: (shipmentId: string) => `/payment/${shipmentId}`,

  /* company portal ------------------------------------------------------- */
  companyHome: "/company",
  companyManifest: "/company/manifest.webmanifest",
  companyLogin: "/company/login",
  companyLogout: "/company/logout",
  companyRegister: "/company/register",
  companySubmitted: "/company/submitted",
  companyDashboard: "/company/dashboard",
  companyBatches: "/company/batches",
  companyBatchCreate: "/company/batches/create",
  companyAssignDriver: "/company/batches/assign-driver",
  companyVehicles: "/company/vehicles",
  companyVehicleOnboarding: "/company/vehicles/onboarding",
} as const

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
export const PUBLIC_PAGES = [
  ROUTES.home,
  ROUTES.companyHome,
  ROUTES.companyRegister,
  ROUTES.about,
  ROUTES.privacy,
  ROUTES.terms,
] as const
