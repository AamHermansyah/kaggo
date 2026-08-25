"use server"

import { redirect } from "next/navigation"

import {
  failure,
  parseInput,
  runAction,
  success,
  type ActionResult,
} from "@/lib/actions/result"
import { isApiError } from "@/lib/api/errors"
import {
  createShipment,
  lookupVehicle,
  submitBatchRequest,
} from "@/lib/api/mobile"
import type { BatchRequestResult, VehicleLookup } from "@/lib/api/types"
import { requireRider } from "@/lib/auth/session"
import { findCity } from "@/lib/geo/cities"
import { ROUTES } from "@/lib/routes"
import { normalizePhone } from "@/lib/validation/phone"
import {
  batchRequestSchema,
  sendItemSchema,
  vehicleLookupSchema,
} from "@/lib/validation/schemas/rider"

/**
 * The listing form has one "driver's phone / vehicle ID" input, while the API
 * exposes two distinct query parameters. A value that parses as a Nigerian
 * phone number is treated as the driver; anything else as a plate.
 */
function toLookupQuery(reference: string) {
  const phone = normalizePhone(reference)
  return phone
    ? { driverPhone: phone }
    : { plateNumber: reference.trim().toUpperCase() }
}

const VEHICLE_NOT_FOUND =
  "No vehicle matches that phone number or plate. Check with the driver and try again."

/**
 * Resolves the vehicle so the form can show the confirmation card before the
 * rider commits. Also wakes the GPS tracker — `deviceConnected: false` is
 * informational and must not block listing.
 */
export async function lookupVehicleAction(
  values: unknown
): Promise<ActionResult<VehicleLookup>> {
  const rider = await requireRider()

  const parsed = parseInput(vehicleLookupSchema, values)
  if (!parsed.ok) return parsed.result

  return runAction(async () => {
    try {
      const vehicle = await lookupVehicle(
        rider.userId,
        toLookupQuery(parsed.data.vehicleRef)
      )
      return success(vehicle)
    } catch (error) {
      if (isApiError(error) && error.status === 404) {
        return failure(VEHICLE_NOT_FOUND, {
          code: "NOT_FOUND",
          fieldErrors: { vehicleRef: [VEHICLE_NOT_FOUND] },
        })
      }
      throw error
    }
  })
}

/**
 * Creates the shipment in `PENDING_PAYMENT` and hands off to the payment step.
 *
 * The vehicle is looked up again here rather than trusting whatever the client
 * posts: the browser only ever sends the reference the rider typed, so it
 * cannot attach the parcel to a driver it did not resolve.
 */
export async function createShipmentAction(
  values: unknown
): Promise<ActionResult<undefined>> {
  const rider = await requireRider()

  const parsed = parseInput(sendItemSchema, values)
  if (!parsed.ok) return parsed.result

  const { role, counterpartyPhone, itemName, fromCity, toCity, vehicleRef } =
    parsed.data

  const from = findCity(fromCity)
  const to = findCity(toCity)
  if (!from || !to) {
    return failure("Pick both a pick-up and a destination city.", {
      code: "VALIDATION_ERROR",
    })
  }

  const outcome = await runAction(async () => {
    let vehicle: VehicleLookup
    try {
      vehicle = await lookupVehicle(rider.userId, toLookupQuery(vehicleRef))
    } catch (error) {
      if (isApiError(error) && error.status === 404) {
        return failure(VEHICLE_NOT_FOUND, {
          code: "NOT_FOUND",
          fieldErrors: { vehicleRef: [VEHICLE_NOT_FOUND] },
        })
      }
      throw error
    }

    const shipment = await createShipment(rider.userId, {
      senderPhoneNumber:
        role === "sender" ? rider.phoneNumber : counterpartyPhone,
      receiverPhoneNumber:
        role === "sender" ? counterpartyPhone : rider.phoneNumber,
      itemName,
      driverPhone: vehicle.driverPhone,
      vehiclePlateNumber: vehicle.plateNumber,
      fromAddress: from.label,
      toAddress: to.label,
      fromLat: from.lat,
      fromLng: from.lng,
      toLat: to.lat,
      toLng: to.lng,
    })

    return success(shipment.shipmentId)
  })

  if (!outcome.ok) return outcome

  redirect(ROUTES.payment(outcome.data))
}

const BATCH_NOT_FOUND =
  "No company matches that code, or that route has no batch accepting drop-offs right now."

/**
 * Joins a logistics company's batch for a route.
 *
 * Unlike `createShipmentAction` there is no payment step here — the backend
 * matches the request to a batch and payment is collected once a driver is
 * assigned, which is what the original "you will be notified to complete
 * payment" copy described.
 */
export async function submitBatchRequestAction(
  values: unknown
): Promise<ActionResult<BatchRequestResult>> {
  const rider = await requireRider()

  const parsed = parseInput(batchRequestSchema, values)
  if (!parsed.ok) return parsed.result

  const from = findCity(parsed.data.fromCity)
  const to = findCity(parsed.data.toCity)
  if (!from || !to) {
    return failure("Pick both a pick-up and a destination city.", {
      code: "VALIDATION_ERROR",
    })
  }

  return runAction(async () => {
    try {
      const result = await submitBatchRequest(rider.userId, {
        companyCode: parsed.data.companyCode,
        fromLabel: from.label,
        toLabel: to.label,
        itemName: parsed.data.itemName,
      })
      return success(result)
    } catch (error) {
      if (isApiError(error) && error.status === 404) {
        return failure(BATCH_NOT_FOUND, {
          code: "NOT_FOUND",
          fieldErrors: { companyCode: [BATCH_NOT_FOUND] },
        })
      }
      if (isApiError(error) && error.status === 409) {
        return failure(
          "You already have a pending request on that batch. Check your parcels.",
          { code: "CONFLICT" }
        )
      }
      throw error
    }
  })
}
