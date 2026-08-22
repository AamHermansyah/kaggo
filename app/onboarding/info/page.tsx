import { redirect } from "next/navigation"

import { ROUTES } from "@/lib/routes"

/**
 * `/onboarding` and `/onboarding/info` were two halves of one form. They are
 * merged at `/onboarding`; this route stays so old links still resolve.
 */
export default function OnboardingInfoRedirect() {
  redirect(ROUTES.vehicleOnboarding)
}
