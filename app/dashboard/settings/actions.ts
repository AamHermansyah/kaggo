"use server"

import { refresh } from "next/cache"

import {
  parseInput,
  runAction,
  success,
  type ActionResult,
} from "@/lib/actions/result"
import { updateCountryPricing, uploadCompanyLocations } from "@/lib/api/admin"
import type { CsvUploadResult } from "@/lib/api/types"
import { requireAdminToken } from "@/lib/auth/session"
import {
  companyLocationsCsvSchema,
  countryPricingSchema,
} from "@/lib/validation/schemas/settings"

/**
 * Updates a country's flat shipment price.
 *
 * The token is read from the httpOnly cookie inside the action — it is never a
 * parameter, so a caller cannot supply one of their own.
 */
export async function updateCountryPricingAction(
  values: unknown
): Promise<ActionResult<undefined>> {
  const token = await requireAdminToken()

  const parsed = parseInput(countryPricingSchema, values)
  if (!parsed.ok) return parsed.result

  const result = await runAction(async () => {
    await updateCountryPricing(token, parsed.data.code, parsed.data.flatPrice)
    return success()
  })

  if (result.ok) refresh()
  return result
}

/**
 * Bulk-upserts company store locations from CSV.
 *
 * The backend skips malformed rows instead of aborting, and reports each one by
 * line number — that report is passed straight back to the form so the operator
 * can see exactly what was dropped.
 */
export async function uploadCompanyLocationsAction(
  values: unknown
): Promise<ActionResult<CsvUploadResult>> {
  const token = await requireAdminToken()

  const parsed = parseInput(companyLocationsCsvSchema, values)
  if (!parsed.ok) return parsed.result

  const result = await runAction(async () => {
    const report = await uploadCompanyLocations(
      token,
      parsed.data.csv,
      parsed.data.country
    )
    return success(report)
  })

  if (result.ok) refresh()
  return result
}
