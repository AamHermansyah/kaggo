import type { Metadata } from "next"

import { BackendPending } from "@/components/company/backend-pending"
import { requireCompanyToken } from "@/lib/auth/session"
import { ROUTES } from "@/lib/routes"

export const metadata: Metadata = {
  title: "Company vehicles",
  robots: { index: false, follow: false },
}

export default async function CompanyVehiclesPage() {
  await requireCompanyToken()

  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6">
      <h1 className="mb-6 shrink-0 text-[20px] font-bold tracking-tight text-foreground">
        Vehicles
      </h1>

      <BackendPending
        title="Fleet management is not available yet"
        description="The company service has no vehicle endpoints. Vehicles are currently onboarded by Kaggo staff through the admin portal — ask your Kaggo contact to register a vehicle and it will be usable immediately."
        backHref={ROUTES.companyDashboard}
        backLabel="Back to dashboard"
      />
    </div>
  )
}
