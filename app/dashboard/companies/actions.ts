"use server"

import { refresh } from "next/cache"
import { z } from "zod"

import {
  parseInput,
  runAction,
  runPrivilegedAction,
  success,
  type ActionResult,
} from "@/lib/actions/result"
import {
  approveCompany,
  deleteCompany,
  reactivateCompany,
  rejectCompany,
  suspendCompany,
} from "@/lib/api/admin"
import { requireAdminSession } from "@/lib/auth/session"

/**
 * Company approval lifecycle.
 *
 * Role is not checked here: v1.1 gates suspend / reactivate / delete behind
 * SUPERADMIN on the backend, which answers 401. Re-implementing that check
 * client-side would only add a second place for the rule to drift — the UI
 * hides the buttons, the backend enforces them.
 */

const companyIdSchema = z.uuid({ error: "Invalid company reference" })

const reasonSchema = z.object({
  companyId: companyIdSchema,
  reason: z
    .string()
    .trim()
    .min(1, "A reason is required")
    .max(500, "Keep the reason under 500 characters"),
})

/**
 * `privileged` marks the calls the backend restricts to SUPERADMIN, so a plain
 * ADMIN gets a permissions message instead of being logged out — see
 * `runPrivilegedAction`.
 */
async function mutate(
  work: (token: string) => Promise<void>,
  privileged = false
) {
  const session = await requireAdminSession()
  const run = privileged ? runPrivilegedAction : runAction

  const result = await run(async () => {
    await work(session.token)
    return success()
  })

  if (result.ok) refresh()
  return result
}

export async function approveCompanyAction(
  companyId: unknown
): Promise<ActionResult<undefined>> {
  const parsed = parseInput(companyIdSchema, companyId)
  if (!parsed.ok) return parsed.result
  return mutate((token) => approveCompany(token, parsed.data))
}

export async function reactivateCompanyAction(
  companyId: unknown
): Promise<ActionResult<undefined>> {
  const parsed = parseInput(companyIdSchema, companyId)
  if (!parsed.ok) return parsed.result
  return mutate((token) => reactivateCompany(token, parsed.data), true)
}

export async function rejectCompanyAction(
  values: unknown
): Promise<ActionResult<undefined>> {
  const parsed = parseInput(reasonSchema, values)
  if (!parsed.ok) return parsed.result
  return mutate((token) =>
    rejectCompany(token, parsed.data.companyId, parsed.data.reason)
  )
}

export async function suspendCompanyAction(
  values: unknown
): Promise<ActionResult<undefined>> {
  const parsed = parseInput(reasonSchema, values)
  if (!parsed.ok) return parsed.result
  return mutate(
    (token) => suspendCompany(token, parsed.data.companyId, parsed.data.reason),
    true
  )
}

/** Irreversible: the backend exposes no un-delete. */
export async function deleteCompanyAction(
  values: unknown
): Promise<ActionResult<undefined>> {
  const parsed = parseInput(reasonSchema, values)
  if (!parsed.ok) return parsed.result
  return mutate(
    (token) => deleteCompany(token, parsed.data.companyId, parsed.data.reason),
    true
  )
}
