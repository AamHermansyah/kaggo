import { NextResponse, type NextRequest } from "next/server"

import { COOKIE } from "@/lib/auth/cookie-names"
import { PATHNAME_HEADER } from "@/lib/home"
import {
  ADMIN_PROTECTED_PREFIXES,
  ADMIN_PUBLIC_PATHS,
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
  const hasAdmin = request.cookies.has(COOKIE.admin)

  const isAdminPublic = (ADMIN_PUBLIC_PATHS as readonly string[]).includes(
    pathname
  )

  if (matchesPrefix(pathname, ADMIN_PROTECTED_PREFIXES) && !isAdminPublic) {
    if (!hasAdmin) return redirectToLogin(request, ROUTES.adminLogin)
  }

  if (isAdminPublic && hasAdmin && pathname === ROUTES.adminLogin) {
    return redirectTo(request, ROUTES.adminHome)
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
