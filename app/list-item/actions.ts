"use server"

import { redirect } from "next/navigation"

import { identifyUser } from "@/lib/api/mobile"
import { isApiError } from "@/lib/api/errors"
import {
  failure,
  parseInput,
  runAction,
  success,
  type ActionResult,
} from "@/lib/actions/result"
import { setRiderCookie } from "@/lib/auth/cookies"
import { safeInternalPath } from "@/lib/navigation"
import { ROUTES } from "@/lib/routes"
import { identifySchema } from "@/lib/validation/schemas/rider"

/**
 * Resolves a phone number to a rider identity and stores it in a signed cookie.
 *
 * The backend has no signup or OTP: `POST /users/identify` binds a phone number
 * to the calling device. Seeing the same number from a new device answers 409
 * `DEVICE_VERIFICATION_REQUIRED`, which is surfaced as a normal form state so
 * the UI can reveal the counterparty-phone field instead of erroring out.
 */
export async function identifyAction(
  values: unknown,
  nextPath?: string
): Promise<ActionResult<undefined>> {
  const parsed = parseInput(identifySchema, values)
  if (!parsed.ok) return parsed.result

  const destination = safeInternalPath(nextPath, ROUTES.sendItem)

  const outcome = await runAction(async () => {
    try {
      const identity = await identifyUser({
        phoneNumber: parsed.data.phoneNumber,
        lastCounterpartyPhone: parsed.data.lastCounterpartyPhone,
      })

      await setRiderCookie({
        userId: identity.userId,
        phoneNumber: identity.phoneNumber,
      })

      return success()
    } catch (error) {
      if (isApiError(error)) {
        if (error.code === "DEVICE_VERIFICATION_REQUIRED") {
          return failure(
            "We already know this number on another device. Enter the phone number of your last sender or receiver to continue.",
            { code: "DEVICE_VERIFICATION_REQUIRED" }
          )
        }
        if (error.code === "DEVICE_VERIFICATION_FAILED") {
          return failure(
            "That number does not match your last sender or receiver. Please check and try again.",
            {
              code: "DEVICE_VERIFICATION_FAILED",
              fieldErrors: {
                lastCounterpartyPhone: ["This number did not match our records"],
              },
            }
          )
        }
      }
      throw error
    }
  })

  if (!outcome.ok) return outcome

  // Redirect outside runAction: it throws a control-flow signal, not an error.
  redirect(destination)
}
