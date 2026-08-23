import { redirect } from "next/navigation"

import { ROUTES } from "@/lib/routes"

/**
 * Vehicle onboarding moved under `/dashboard` so it sits inside the admin
 * PWA's scope. This stub keeps existing links and bookmarks working.
 */
export default function VehicleOnboardingRedirect() {
  redirect(ROUTES.vehicleOnboarding)
}
