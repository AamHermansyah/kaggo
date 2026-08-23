import type { Metadata } from "next"

import { ROUTES } from "@/lib/routes"

/**
 * Container only — no auth check here.
 *
 * `/company`, `/company/login` and `/company/register` are children of this
 * layout and must stay public; the protected pages call
 * `requireCompanyToken()` themselves, next to the data they guard.
 *
 * Its real job is pointing this section at the company manifest, so installing
 * from any company page creates the "MyKaggo Business" app rather than a second
 * copy of the rider one.
 */
export const metadata: Metadata = {
  manifest: ROUTES.companyManifest,
}

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
