import { unstable_rethrow } from "next/navigation"
import type { z } from "zod"

import {
  ApiError,
  isApiError,
  toUserMessage,
  type ApiErrorCode,
  type FieldErrors,
} from "@/lib/api/errors"

/**
 * Uniform Server Action return value.
 *
 * Expected failures are modelled as values, not thrown errors, so a form can
 * render them inline. Only genuinely unexpected faults reach an error boundary.
 */
export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | {
      ok: false
      message: string
      fieldErrors?: FieldErrors
      code?: ApiErrorCode
    }

export function success(): ActionResult<undefined>
export function success<T>(data: T): ActionResult<T>
export function success<T>(data?: T): ActionResult<T | undefined> {
  return { ok: true, data }
}

export function failure(
  message: string,
  extra?: { fieldErrors?: FieldErrors; code?: ApiErrorCode }
): ActionResult<never> {
  return { ok: false, message, ...extra }
}

/** Converts a Zod failure into the shape react-hook-form can replay. */
export function fromZodError(error: z.ZodError): ActionResult<never> {
  const fieldErrors: FieldErrors = {}
  const formErrors: string[] = []

  for (const issue of error.issues) {
    const field = issue.path[0]
    if (typeof field === "string") {
      ;(fieldErrors[field] ??= []).push(issue.message)
    } else {
      formErrors.push(issue.message)
    }
  }

  return failure(formErrors[0] ?? "Please check the highlighted fields.", {
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    code: "VALIDATION_ERROR",
  })
}

/**
 * Parses input against a schema before any I/O happens.
 *
 * Server Actions are public HTTP endpoints — a caller can post anything at
 * them — so every action re-validates here even though the client already did.
 */
export function parseInput<S extends z.ZodType>(
  schema: S,
  input: unknown
): { ok: true; data: z.output<S> } | { ok: false; result: ActionResult<never> } {
  const parsed = schema.safeParse(input)
  if (parsed.success) return { ok: true, data: parsed.data }
  return { ok: false, result: fromZodError(parsed.error) }
}

const MISSING_ENDPOINT_MESSAGE =
  "This feature is not available on the server yet. Please contact support."

/**
 * Wraps the I/O half of an action.
 *
 * `unstable_rethrow` keeps Next.js' own control-flow signals (`redirect`,
 * `notFound`) from being swallowed by the catch.
 */
export async function runAction<T>(
  work: () => Promise<ActionResult<T>>
): Promise<ActionResult<T>> {
  try {
    return await work()
  } catch (error) {
    unstable_rethrow(error)

    if (isApiError(error)) {
      if (error.isMissingEndpoint) {
        return failure(MISSING_ENDPOINT_MESSAGE, { code: "NOT_FOUND" })
      }
      return failure(toUserMessage(error), {
        fieldErrors: error.fieldErrors,
        code: error.code,
      })
    }

    console.error("[action] unexpected failure", error)
    return failure("Something went wrong. Please try again.")
  }
}

const SUPERADMIN_REQUIRED =
  "This action needs a SUPERADMIN account. Ask a superadmin to do it."

/**
 * For actions the backend restricts to SUPERADMIN.
 *
 * v1.1 answers **401** for "authenticated but not SUPERADMIN" — the same status
 * as an expired token. Left alone, a perfectly valid ADMIN who taps Suspend
 * would be told their session expired and sent to the login screen over what is
 * really a permissions problem. The two cases cannot be told apart by status,
 * but at this call site we know the session is live, so 401 is re-labelled.
 */
export async function runPrivilegedAction<T>(
  work: () => Promise<ActionResult<T>>
): Promise<ActionResult<T>> {
  const result = await runAction(work)

  if (!result.ok && result.code === "UNAUTHORIZED") {
    return failure(SUPERADMIN_REQUIRED, { code: "FORBIDDEN" })
  }
  return result
}

export { ApiError, isApiError }
