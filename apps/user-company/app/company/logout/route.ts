import { NextResponse, type NextRequest } from "next/server"

import { clearCompanyCookie } from "@/lib/auth/cookies"
import { ROUTES } from "@/lib/routes"

/** Company counterpart of the admin logout handler. See its comment for why. */
async function endSession(request: NextRequest): Promise<NextResponse> {
  await clearCompanyCookie()

  const url = request.nextUrl.clone()
  url.pathname = ROUTES.companyLogin
  url.search =
    request.nextUrl.searchParams.get("reason") === "expired" ? "?expired=1" : ""

  return NextResponse.redirect(url)
}

export const GET = endSession
export const POST = endSession
