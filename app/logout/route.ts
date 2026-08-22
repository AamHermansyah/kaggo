import { NextResponse, type NextRequest } from "next/server"

import { clearRiderCookie } from "@/lib/auth/cookies"
import { ROUTES } from "@/lib/routes"

/**
 * Clears the rider identity.
 *
 * Reached when the backend rejects the `x-user-id` carried in the cookie —
 * a stale identity, or one edited by hand — so the rider re-identifies rather
 * than staring at an error they cannot act on.
 */
async function endSession(request: NextRequest): Promise<NextResponse> {
  await clearRiderCookie()

  const url = request.nextUrl.clone()
  url.pathname = ROUTES.riderIdentify
  url.search =
    request.nextUrl.searchParams.get("reason") === "expired" ? "?expired=1" : ""

  return NextResponse.redirect(url)
}

export const GET = endSession
export const POST = endSession
