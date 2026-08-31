"use server"

import { redirect } from "next/navigation"

import {
  failure,
  parseInput,
  runAction,
  success,
  type ActionResult,
} from "@/lib/actions/result"
import { onboardVehicle } from "@/lib/api/admin"
import { isApiError } from "@/lib/api/errors"
import { requireAdminToken } from "@/lib/auth/session"
import { ROUTES } from "@/lib/routes"
import { vehicleOnboardingSchema } from "@/lib/validation/schemas/fleet"

/**
 * Registers a vehicle and its GPS tracker in a single backend transaction.
 *
 * `POST /admin/vehicles` is the only vehicle-onboarding endpoint the platform
 * has, which is why this flow requires an admin session.
 */
export async function onboardVehicleAction(
  values: unknown
): Promise<ActionResult<undefined>> {
  const token = await requireAdminToken()

  const parsed = parseInput(vehicleOnboardingSchema, values)
  if (!parsed.ok) return parsed.result

  const outcome = await runAction(async () => {
    try {
      const vehicle = await onboardVehicle(token, parsed.data)
      return success(vehicle.plateNumber)
    } catch (error) {
      // 409 = plate, IMEI or terminal number already registered.
      if (isApiError(error) && error.status === 409) {
        return failure(
          "That plate number, IMEI or terminal number is already registered to another vehicle.",
          { code: "CONFLICT" }
        )
      }
      throw error
    }
  })

  if (!outcome.ok) return outcome

  redirect(
    `${ROUTES.vehicleOnboardingSuccess}?plate=${encodeURIComponent(outcome.data)}`
  )
}
