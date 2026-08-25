import { z } from "zod"

import { CITY_IDS } from "@/lib/geo/cities"
import { isValidPhone, normalizePhone, PHONE_ERROR } from "../phone"

/**
 * Schemas shared by the client form and the Server Action that receives it.
 *
 * The client copy gives instant feedback; the server re-parses the same schema
 * before touching the API, so a crafted request never skips validation.
 */

const phone = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .refine(isValidPhone, PHONE_ERROR)
  .transform((value) => normalizePhone(value)!)

export const identifySchema = z.object({
  phoneNumber: phone,
  /**
   * Only sent after the backend answers 409 `DEVICE_VERIFICATION_REQUIRED`:
   * the phone number of the rider's most recent sender or receiver.
   */
  lastCounterpartyPhone: z
    .string()
    .trim()
    .refine((value) => value === "" || isValidPhone(value), PHONE_ERROR)
    .transform((value) => (value === "" ? undefined : normalizePhone(value)!))
    .optional(),
})

export type IdentifyValues = z.input<typeof identifySchema>

const cityId = z.enum(CITY_IDS as [string, ...string[]], {
  error: "Choose a city from the list",
})

export const sendItemSchema = z
  .object({
    /** Whether the signed-in rider is sending or receiving this parcel. */
    role: z.enum(["sender", "receiver"]),
    /** The other party: receiver's number when sending, sender's when receiving. */
    counterpartyPhone: phone,
    itemName: z
      .string()
      .trim()
      .min(2, "Describe what you are sending")
      .max(200, "Keep it under 200 characters"),
    fromCity: cityId,
    toCity: cityId,
    /**
     * One field in the design — a driver's phone number or a plate number. The
     * Server Action decides which query parameter to use.
     */
    vehicleRef: z
      .string()
      .trim()
      .min(3, "Enter the driver's phone number or the vehicle plate number")
      .max(60),
  })
  .refine((values) => values.fromCity !== values.toCity, {
    error: "Pick-up and destination must be different",
    path: ["toCity"],
  })

export type SendItemValues = z.input<typeof sendItemSchema>

export const vehicleLookupSchema = z.object({
  vehicleRef: z
    .string()
    .trim()
    .min(3, "Enter the driver's phone number or the vehicle plate number")
    .max(60),
})

export const shipmentIdSchema = z.uuid({ error: "Invalid shipment reference" })

export const paymentCallbackSchema = z.object({
  shipmentId: shipmentIdSchema,
  reference: z.string().trim().min(1, "Missing payment reference").max(200),
})

/**
 * Dropping a package off with a logistics company.
 *
 * Restored in v1.1: `/batch-tracking/request` finally backs the "track through
 * a logistics company" mode the mock-ups showed. Note there is no counterparty
 * field — the backend records the requester as both sender and receiver, so
 * this is a drop-off-and-track flow, not a send-to-someone-else one.
 *
 * `batchNumber` is deliberately not collected: the server matches whichever
 * batch on the route has an open drop-off window right now, so asking the user
 * to pick one (as the original design did) would only invite a wrong answer.
 */
export const batchRequestSchema = z
  .object({
    companyCode: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "The company code is 6 digits"),
    fromCity: cityId,
    toCity: cityId,
    itemName: z
      .string()
      .trim()
      .min(2, "Describe what you are sending")
      .max(200, "Keep it under 200 characters"),
  })
  .refine((values) => values.fromCity !== values.toCity, {
    error: "Pick-up and destination must be different",
    path: ["toCity"],
  })

export type BatchRequestValues = z.input<typeof batchRequestSchema>
