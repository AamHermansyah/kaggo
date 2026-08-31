import { redirect } from "next/navigation"

import { ROUTES } from "@/lib/routes"

/**
 * Vehicle onboarding is an admin-only operation — `POST /admin/vehicles` is the
 * only endpoint that creates a vehicle plus its GPS device, and the company
 * service exposes nothing equivalent. Rather than keep a form that cannot
 * submit, this redirects to the company vehicles page, which explains the
 * situation.
 */
export default function CompanyVehicleOnboardingRedirect() {
  redirect(ROUTES.vehicleOnboarding)
}
