import { redirect } from "next/navigation"

import { ROUTES } from "@/lib/routes"

export default function VehicleOnboardingInfoRedirect() {
  redirect(ROUTES.vehicleOnboarding)
}
