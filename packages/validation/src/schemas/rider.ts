import { z } from "zod"

import { isValidPhone, normalizePhone, PHONE_ERROR } from "../phone"

const phone = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .refine(isValidPhone, PHONE_ERROR)
  .transform((value) => normalizePhone(value)!)

export const identifySchema = z.object({
  phoneNumber: phone,
  lastCounterpartyPhone: z
    .string()
    .trim()
    .refine((value) => value === "" || isValidPhone(value), PHONE_ERROR)
    .transform((value) => (value === "" ? undefined : normalizePhone(value)!))
    .optional(),
})

export type IdentifyValues = z.input<typeof identifySchema>

export const sendItemSchema = z
  .object({
    role: z.enum(["sender", "receiver"]),
    counterpartyPhone: phone,
    itemName: z
      .string()
      .trim()
      .min(2, "Describe what you are sending")
      .max(200, "Keep it under 200 characters"),
    from: z
      .string()
      .trim()
      .min(2, "Enter departure location")
      .max(300, "Keep it under 300 characters"),
    to: z
      .string()
      .trim()
      .min(2, "Enter arrival location")
      .max(300, "Keep it under 300 characters"),
    vehicleRef: z
      .string()
      .trim()
      .min(3, "Enter the driver's phone number or the vehicle plate number")
      .max(60),
  })
  .refine((values) => values.from.toLowerCase() !== values.to.toLowerCase(), {
    message: "Departure and destination must be different",
    path: ["to"],
  })

export type SendItemValues = z.input<typeof sendItemSchema>

export const vehicleLookupSchema = z.object({
  vehicleRef: z
    .string()
    .trim()
    .min(3, "Enter the driver's phone number or the vehicle plate number")
    .max(60),
})

export const shipmentIdSchema = z.string().uuid("Invalid shipment reference")

export const paymentCallbackSchema = z.object({
  shipmentId: shipmentIdSchema,
  reference: z.string().trim().min(1, "Missing payment reference").max(200),
})

export const batchRequestSchema = z
  .object({
    companyCode: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "The company code is 6 digits"),
    from: z
      .string()
      .trim()
      .min(2, "Enter departure location")
      .max(300, "Keep it under 300 characters"),
    to: z
      .string()
      .trim()
      .min(2, "Enter arrival location")
      .max(300, "Keep it under 300 characters"),
    itemName: z
      .string()
      .trim()
      .min(2, "Describe what you are sending")
      .max(200, "Keep it under 200 characters"),
  })
  .refine((values) => values.from.toLowerCase() !== values.to.toLowerCase(), {
    message: "Departure and destination must be different",
    path: ["to"],
  })

export type BatchRequestValues = z.input<typeof batchRequestSchema>
