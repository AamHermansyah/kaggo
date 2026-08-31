"use server"

import { lookupVehicle } from "@kaggo/api"
import { isValidPhone, normalizePhone } from "@kaggo/validation"
import type { VehicleLookup } from "@kaggo/types"

export type DriverLookupState =
  | { status: "idle" }
  | { status: "success"; vehicle: VehicleLookup }
  | { status: "error"; message: string }

export async function lookupDriverVehicleAction(
  _prevState: DriverLookupState,
  formData: FormData
): Promise<DriverLookupState> {
  const query = (formData.get("query") as string)?.trim()

  if (!query || query.length < 3) {
    return {
      status: "error",
      message: "Please enter your phone number or vehicle plate number",
    }
  }

  const isPhone = isValidPhone(query)
  const input = isPhone
    ? { driverPhone: normalizePhone(query)! }
    : { plateNumber: query.toUpperCase() }

  try {
    // Lookup vehicle via public/rider vehicle endpoint using fallback system identity
    const vehicle = await lookupVehicle("driver-portal", input)
    if (!vehicle || !vehicle.plateNumber) {
      return {
        status: "error",
        message: "No registered vehicle found for this driver phone or plate number.",
      }
    }
    return { status: "success", vehicle }
  } catch (err) {
    return {
      status: "error",
      message: "Could not find vehicle details. Please verify your details or contact support.",
    }
  }
}
