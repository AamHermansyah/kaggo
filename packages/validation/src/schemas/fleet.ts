import { z } from "zod"

import { isValidPhone, normalizePhone, PHONE_ERROR } from "../phone"

const driverPhone = z
  .string()
  .trim()
  .min(1, "Driver's phone number is required")
  .refine(isValidPhone, PHONE_ERROR)
  .transform((value) => normalizePhone(value)!)

export const vehicleOnboardingSchema = z.object({
  driverFullName: z.string().trim().min(2, "Driver's full name is required").max(120),
  driverPhone,
  plateNumber: z
    .string()
    .trim()
    .min(3, "Number plate is required")
    .max(20)
    .transform((value) => value.toUpperCase()),
  make: z.string().trim().min(1, "Vehicle make is required").max(60),
  model: z.string().trim().min(1, "Vehicle model is required").max(60),
  colour: z.string().trim().min(2, "Vehicle colour is required").max(40),
  companyName: z.string().trim().min(2, "Company is required").max(200),
  imei: z.string().trim().optional(),
  terminalNo: z
    .string()
    .trim()
    .min(1, "Terminal ID is required")
    .max(30, "Terminal ID must be 30 characters or less"),
})

export type VehicleOnboardingValues = z.input<typeof vehicleOnboardingSchema>

const timeOfDay = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use 24-hour time, e.g. 08:00")

export const createBatchSchema = z
  .object({
    departure: z.string().trim().min(2, "Departure is required").max(120),
    destination: z.string().trim().min(2, "Destination is required").max(120),
    dropOffStartTime: timeOfDay,
    dropOffCloseTime: timeOfDay,
    batchNumber: z.string().trim().min(1, "Batch number is required").max(40),
  })
  .refine((values) => values.departure !== values.destination, {
    message: "Departure and destination must be different",
    path: ["destination"],
  })
  .refine((values) => values.dropOffCloseTime > values.dropOffStartTime, {
    message: "Closing time must be after the starting time",
    path: ["dropOffCloseTime"],
  })

export type CreateBatchValues = z.input<typeof createBatchSchema>

export const assignDriverSchema = z.object({
  batchId: z.string().trim().min(1, "Batch is required").max(120),
  vehicleRef: z
    .string()
    .trim()
    .min(3, "Enter the vehicle plate number or the driver's phone number")
    .max(60),
})

export type AssignDriverValues = z.input<typeof assignDriverSchema>
