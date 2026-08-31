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
import { resolveCoordinates } from "@/lib/geo/cities"
import { ROUTES } from "@/lib/routes"
import {
  assignDriverSchema,
  createBatchSchema,
} from "@/lib/validation/schemas/fleet"

export async function createBatchAction(
  values: unknown
): Promise<ActionResult<undefined>> {
  const token = await requireCompanyToken()

  const parsed = parseInput(createBatchSchema, values)
  if (!parsed.ok) return parsed.result

  const fromCoords = resolveCoordinates(parsed.data.departure)
  const toCoords = resolveCoordinates(parsed.data.destination)

  const outcome = await runAction(async () => {
    await createBatch(token, {
      fromLabel: parsed.data.departure,
      fromLat: fromCoords.lat,
      fromLng: fromCoords.lng,
      toLabel: parsed.data.destination,
      toLat: toCoords.lat,
      toLng: toCoords.lng,
      dropOffStartTime: parsed.data.dropOffStartTime,
      dropOffCloseTime: parsed.data.dropOffCloseTime,
      batchNumber: parsed.data.batchNumber,
    })
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
