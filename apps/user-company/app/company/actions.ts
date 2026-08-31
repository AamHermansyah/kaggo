"use server"

import { redirect } from "next/navigation"

import {
  failure,
  parseInput,
  runAction,
  success,
  type ActionResult,
} from "@/lib/actions/result"
import { companyLogin, companyRegister } from "@/lib/api/company"
import { isApiError } from "@/lib/api/errors"
import { clearCompanyCookie, setCompanyCookie } from "@/lib/auth/cookies"
import { safeInternalPath } from "@/lib/navigation"
import { ROUTES } from "@/lib/routes"
import {
  companyLoginSchema,
  companyRegisterSchema,
} from "@/lib/validation/schemas/auth"

/**
 * Company sign-up.
 *
 * `POST /company/auth/register` takes `{ name, address, email, phone, password }`
 * — the design's six fields map onto five, with `confirmPassword` checked in
 * the schema and dropped before the request.
 */
export async function companyRegisterAction(
  values: unknown
): Promise<ActionResult<undefined>> {
  const parsed = parseInput(companyRegisterSchema, values)
  if (!parsed.ok) return parsed.result

  const outcome = await runAction(async () => {
    try {
      await companyRegister({
        name: parsed.data.name,
        address: parsed.data.address,
        email: parsed.data.email,
        phone: parsed.data.phone,
        password: parsed.data.password,
      })
      return success()
    } catch (error) {
      if (isApiError(error) && error.status === 409) {
        return failure(
          "An account already exists for that email or phone number.",
          {
            code: "CONFLICT",
            fieldErrors: { email: ["This email is already registered"] },
          }
        )
      }
      throw error
    }
  })

  if (!outcome.ok) return outcome

  redirect(ROUTES.companySubmitted)
}

/**
 * Company sign-in. The JWT goes straight into an httpOnly, SameSite=Strict
 * cookie and is never exposed to client-side JavaScript.
 */
export async function companyLoginAction(
  values: unknown,
  nextPath?: string
): Promise<ActionResult<undefined>> {
  const parsed = parseInput(companyLoginSchema, values)
  if (!parsed.ok) return parsed.result

  const destination = safeInternalPath(nextPath, ROUTES.companyDashboard)

  const outcome = await runAction(async () => {
    try {
      const result = await companyLogin(parsed.data.email, parsed.data.password)
      if (!result?.token) {
        return failure(
          "The server did not return a session. Your account may still be awaiting approval."
        )
      }

      await setCompanyCookie(result.token)
      return success()
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        return failure("Invalid email or password.", { code: "UNAUTHORIZED" })
      }
      if (isApiError(error) && error.status === 403) {
        return failure(
          "This account is not approved yet. You will get access once an administrator approves it.",
          { code: "FORBIDDEN" }
        )
      }
      throw error
    }
  })

  if (!outcome.ok) return outcome

  redirect(destination)
}

export async function companyLogoutAction(): Promise<void> {
  await clearCompanyCookie()
  redirect(ROUTES.companyLogin)
}
