"use server"

import { refresh } from "next/cache"

import {
  parseInput,
  runAction,
  success,
  type ActionResult,
} from "@/lib/actions/result"
import { markShipmentReceived } from "@/lib/api/mobile"
import { requireRider } from "@/lib/auth/session"
import { shipmentIdSchema } from "@/lib/validation/schemas/rider"

/**
 * Marks a parcel received.
 *
 * Authorisation is the backend's: only the receiver may call this, and it
 * answers 403 for the sender. The identity sent is the one in the signed
 * cookie, never a value from the request body.
 *
 * `refresh()` re-runs the current route on the server so the card updates
 * without a manual reload.
 */
export async function markReceivedAction(
  shipmentId: unknown
): Promise<ActionResult<undefined>> {
  const rider = await requireRider()

  const parsed = parseInput(shipmentIdSchema, shipmentId)
  if (!parsed.ok) return parsed.result

  const result = await runAction(async () => {
    await markShipmentReceived(rider.userId, parsed.data)
    return success()
  })

  if (result.ok) refresh()
  return result
}
