import type { Metadata } from "next"

import { requireAdminToken } from "@/lib/auth/session"
import { VehicleOnboardingForm } from "./onboarding-form"

export const metadata: Metadata = {
  title: "Vehicle onboarding",
  description: "Register a vehicle and pair its MyKaggo GPS tracker.",
  robots: { index: false, follow: false },
}

/**
 * Merged onboarding screen.
 *
 * The designs split this across `/onboarding` (agent phone number) and
 * `/onboarding/info` (the actual form). The backend has no notion of an
 * "onboarding agent" identity — vehicle creation is an admin operation — so the
 * phone gate is replaced by the admin session and the two screens are one form.
 */
export default async function VehicleOnboardingPage() {
  await requireAdminToken()

  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6">
      <h1 className="mb-6 shrink-0 text-center text-[19px] font-semibold text-foreground">
        Onboarding Information
      </h1>
      <VehicleOnboardingForm />
    </div>
  )
}
