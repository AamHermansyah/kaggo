import { NextResponse, type NextRequest } from "next/server"

import { COOKIE } from "@/lib/auth/cookie-names"
import { PATHNAME_HEADER } from "@/lib/home"
import {
  COMPANY_PROTECTED_PREFIXES,
  RIDER_PROTECTED_PREFIXES,
  ROUTES,
} from "@/lib/routes"

function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

function redirectToLogin(
  request: NextRequest,
  loginPath: string
): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = loginPath
  url.search = ""

  const intended = `${request.nextUrl.pathname}${request.nextUrl.search}`
  if (intended !== loginPath) {
    url.searchParams.set("next", intended)
  }

  return NextResponse.redirect(url)
}

function redirectTo(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  url.search = ""
  return NextResponse.redirect(url)
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  const hasCompany = request.cookies.has(COOKIE.company)
  const hasRider = request.cookies.has(COOKIE.rider)

  /* company portal ----------------------------------------------------- */
  if (matchesPrefix(pathname, COMPANY_PROTECTED_PREFIXES) && !hasCompany) {
    return redirectToLogin(request, ROUTES.companyLogin)
  }

  if (
    (pathname === ROUTES.companyLogin || pathname === ROUTES.companyRegister) &&
    hasCompany
  ) {
    return redirectTo(request, ROUTES.companyDashboard)
  }

  /* rider -------------------------------------------------------------- */
  if (matchesPrefix(pathname, RIDER_PROTECTED_PREFIXES) && !hasRider) {
    return redirectToLogin(request, ROUTES.riderIdentify)
  }

  const headers = new Headers(request.headers)
  headers.set(PATHNAME_HEADER, pathname)

  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons/|images/|sw\\.js|manifest\\.webmanifest|robots\\.txt|sitemap\\.xml).*)",
  ],
}
