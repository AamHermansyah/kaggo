import type { Metadata } from "next"

import { VehicleOnboardingForm } from "./onboarding-form"

export const metadata: Metadata = {
  title: "Vehicle onboarding",
  description: "Register a vehicle and pair its MyKaggo GPS tracker.",
  alternates: { canonical: "/onboarding" },
}

export default function VehicleOnboardingPage() {
  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6">
      <h1 className="mb-6 shrink-0 text-center text-[19px] font-semibold text-foreground">
        Onboarding Information
      </h1>
      <VehicleOnboardingForm />
    </div>
  )
}
