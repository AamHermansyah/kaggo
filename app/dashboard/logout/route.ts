import { NextResponse, type NextRequest } from "next/server"

import { clearAdminCookie } from "@/lib/auth/cookies"
import { ROUTES } from "@/lib/routes"

/**
 * Tears down the admin session.
 *
 * A Route Handler rather than a Server Action because cookies cannot be
 * mutated during a render — this is where `loadAdmin` sends a request whose
 * token the backend rejected.
 *
 * GET is accepted so that redirect can work. It is idempotent and destroys
 * nothing but the caller's own session, so the usual "no state change on GET"
 * concern amounts to a nuisance-logout at worst.
 */
async function endSession(request: NextRequest): Promise<NextResponse> {
  await clearAdminCookie()

  const url = request.nextUrl.clone()
  url.pathname = ROUTES.adminLogin
  url.search =
    request.nextUrl.searchParams.get("reason") === "expired" ? "?expired=1" : ""

  return NextResponse.redirect(url)
}

export const GET = endSession
export const POST = endSession
