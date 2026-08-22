import { z } from "zod"

/** Admin settings: per-country flat pricing and company store locations. */

export const countryPricingSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{2}$/, "Country code must be two letters")
    .transform((value) => value.toUpperCase()),
  flatPrice: z.coerce
    .number({ error: "Enter a price" })
    .positive("Price must be greater than zero")
    .max(10_000_000, "That price looks wrong"),
})

export type CountryPricingValues = z.input<typeof countryPricingSchema>

const CSV_HEADER = /^\s*companyname\s*,\s*locationlabel\s*,\s*address\s*$/i

export const companyLocationsCsvSchema = z.object({
  country: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{2}$/, "Country code must be two letters")
    .transform((value) => value.toUpperCase())
    .default("NG"),
  csv: z
    .string()
    .min(1, "Paste the CSV contents")
    .max(1_000_000, "That file is too large")
    .refine(
      (value) => CSV_HEADER.test(value.split(/\r?\n/)[0] ?? ""),
      "The first row must be: companyName,locationLabel,address"
    )
    .refine(
      (value) => value.split(/\r?\n/).filter((line) => line.trim()).length > 1,
      "Add at least one data row below the header"
    ),
})

export type CompanyLocationsCsvValues = z.input<typeof companyLocationsCsvSchema>

export const rangeSchema = z.enum(["today", "week", "month", "all"]).catch("all")
