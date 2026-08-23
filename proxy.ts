import { NextResponse, type NextRequest } from "next/server"

import { COOKIE } from "@/lib/auth/cookie-names"
import { PATHNAME_HEADER } from "@/lib/home"
import {
  ADMIN_PROTECTED_PREFIXES,
  ADMIN_PUBLIC_PATHS,
  COMPANY_PROTECTED_PREFIXES,
  RIDER_PROTECTED_PREFIXES,
  ROUTES,
} from "@/lib/routes"

/**
 * Optimistic auth routing (Next.js 16 renamed `middleware` to `proxy`).
 *
 * This only checks whether a session cookie is *present*, so an unauthenticated
 * visitor never sees a protected shell flash before being bounced. It is not
 * the authorisation check: every protected page and Server Action independently
 * calls the guards in `lib/auth/session.ts`, and the backend validates the
 * token again. A forged cookie gets past the proxy and no further.
 */

function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

/**
 * Preserves the originally requested location so the login screen can send the
 * visitor back. Only same-origin relative paths survive, which is what stops
 * `?next=` from becoming an open redirect.
 */
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

  const hasAdmin = request.cookies.has(COOKIE.admin)
  const hasCompany = request.cookies.has(COOKIE.company)
  const hasRider = request.cookies.has(COOKIE.rider)

  /* admin portal ------------------------------------------------------- */
  const isAdminPublic = (ADMIN_PUBLIC_PATHS as readonly string[]).includes(
    pathname
  )

  if (matchesPrefix(pathname, ADMIN_PROTECTED_PREFIXES) && !isAdminPublic) {
    if (!hasAdmin) return redirectToLogin(request, ROUTES.adminLogin)
  }

  if (isAdminPublic && hasAdmin) {
    return redirectTo(request, ROUTES.adminHome)
  }

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

  /**
   * Unmatched URLs render the `/_not-found` segment, so `usePathname()` inside
   * `not-found.tsx` reports that instead of what the visitor asked for. Passing
   * the real path down lets the 404 offer the right portal's home.
   *
   * `set` (not `append`) overwrites anything the client sent, so the header
   * cannot be spoofed on requests that reach the proxy.
   */
  const headers = new Headers(request.headers)
  headers.set(PATHNAME_HEADER, pathname)

  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: [
    /**
     * Everything except Next internals, the service worker, the manifest and
     * static files — matching those would only add latency.
     */
    "/((?!_next/static|_next/image|favicon.ico|icons/|images/|sw\\.js|manifest\\.webmanifest|robots\\.txt|sitemap\\.xml).*)",
  ],
}
