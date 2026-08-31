import { NextResponse, type NextRequest } from "next/server"

import { PATHNAME_HEADER } from "@/lib/home"

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  const headers = new Headers(request.headers)
  headers.set(PATHNAME_HEADER, pathname)

  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons/|images/|sw\\.js|manifest\\.webmanifest|robots\\.txt|sitemap\\.xml).*)",
  ],
}
