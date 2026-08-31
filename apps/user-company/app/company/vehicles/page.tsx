import type { Metadata } from "next"

import { VehicleOnboardingForm } from "@/app/onboarding/onboarding-form"
import { requireCompanyToken } from "@/lib/auth/session"

export const metadata: Metadata = {
  title: "Onboard vehicle",
  description: "Register a vehicle and assign its MyKaggo GPS tracker.",
  robots: { index: false, follow: false },
}

export default async function CompanyVehiclesPage() {
  await requireCompanyToken()

  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6">
      <VehicleOnboardingForm />
    </div>
  )
}
