"use server"

import { redirect } from "next/navigation"

import {
  failure,
  parseInput,
  runAction,
  success,
  type ActionResult,
} from "@/lib/actions/result"
import { adminLogin } from "@/lib/api/admin"
import { isApiError } from "@/lib/api/errors"
import { clearAdminCookie, setAdminCookie } from "@/lib/auth/cookies"
import { safeInternalPath } from "@/lib/navigation"
import { ROUTES } from "@/lib/routes"
import { adminLoginSchema } from "@/lib/validation/schemas/auth"

/**
 * Admin sign-in.
 *
 * The JWT is written straight into an httpOnly cookie and never handed to the
 * client bundle, so no browser code can read or forward it. The backend answers
 * a deliberately generic 401 for both a wrong password and an unknown email
 * (it avoids account enumeration); that message is passed through unchanged.
 */
export async function adminLoginAction(
  values: unknown,
  nextPath?: string
): Promise<ActionResult<undefined>> {
  const parsed = parseInput(adminLoginSchema, values)
  if (!parsed.ok) return parsed.result

  const destination = safeInternalPath(nextPath, ROUTES.adminHome)

  const outcome = await runAction(async () => {
    try {
      const result = await adminLogin(parsed.data.email, parsed.data.password)
      if (!result?.token) {
        return failure("The server did not return a session. Please try again.")
      }

      await setAdminCookie({
        token: result.token,
        // v1.1 gates some actions behind SUPERADMIN; the role is kept so the
        // dashboard can hide controls the backend would reject anyway.
        role: result.admin?.role ?? "ADMIN",
        email: result.admin?.email ?? parsed.data.email,
      })
      return success()
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        return failure("Invalid email or password.", { code: "UNAUTHORIZED" })
      }
      if (isApiError(error) && error.code === "RATE_LIMITED") {
        return failure(
          "Too many sign-in attempts. Please wait a minute and try again.",
          { code: "RATE_LIMITED" }
        )
      }
      throw error
    }
  })

  if (!outcome.ok) return outcome

  redirect(destination)
}

export async function adminLogoutAction(): Promise<void> {
  await clearAdminCookie()
  redirect(ROUTES.adminLogin)
}
