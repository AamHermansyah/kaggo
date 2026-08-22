"use server"

import { redirect } from "next/navigation"

import {
  parseInput,
  runAction,
  success,
  type ActionResult,
} from "@/lib/actions/result"
import { assignDriverToBatch, createBatch } from "@/lib/api/company"
import { requireCompanyToken } from "@/lib/auth/session"
import { ROUTES } from "@/lib/routes"
import {
  assignDriverSchema,
  createBatchSchema,
} from "@/lib/validation/schemas/fleet"

/**
 * Batch creation and driver assignment.
 *
 * Neither endpoint is deployed yet. `runAction` recognises the backend's
 * "Route not found" 404 and returns a plain "not available on the server yet"
 * message, so the form says something true instead of a generic failure. The
 * request shape is already correct, so these light up the day the routes ship.
 */
export async function createBatchAction(
  values: unknown
): Promise<ActionResult<undefined>> {
  const token = await requireCompanyToken()

  const parsed = parseInput(createBatchSchema, values)
  if (!parsed.ok) return parsed.result

  const outcome = await runAction(async () => {
    await createBatch(token, parsed.data)
    return success()
  })

  if (!outcome.ok) return outcome

  redirect(ROUTES.companyBatches)
}

export async function assignDriverAction(
  values: unknown
): Promise<ActionResult<undefined>> {
  const token = await requireCompanyToken()

  const parsed = parseInput(assignDriverSchema, values)
  if (!parsed.ok) return parsed.result

  const outcome = await runAction(async () => {
    await assignDriverToBatch(token, parsed.data.batchId, parsed.data.vehicleRef)
    return success()
  })

  if (!outcome.ok) return outcome

  redirect("/company/batches/assign-driver/success")
}
