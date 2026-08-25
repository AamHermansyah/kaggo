import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"

import {
  clearAdminCookie,
  clearCompanyCookie,
  readAdminCookie,
  readCompanyCookie,
  hasSessionCookie,
  readRiderCookie,
  COOKIE,
  type AdminSession,
  type RiderSession,
} from "./cookies"
import { ROUTES } from "@/lib/routes"

/**
 * Data Access Layer.
 *
 * Every server-side read of "who is asking" goes through here rather than
 * touching cookies directly, so authorisation lives in one auditable place.
 * `proxy.ts` only performs an optimistic redirect; these guards are the real
 * check and they run next to the data fetch itself.
 *
 * `cache()` dedupes the cookie read across a single render pass.
 */

export const getRiderSession = cache(
  async (): Promise<RiderSession | null> => readRiderCookie()
)

export const getAdminSession = cache(
  async (): Promise<AdminSession | null> => readAdminCookie()
)

export const getAdminToken = cache(async (): Promise<string | null> => {
  const session = await readAdminCookie()
  return session?.token ?? null
})

export const getCompanyToken = cache(
  async (): Promise<string | null> => readCompanyCookie()
)

/** Redirects to the identify flow when the visitor has no rider identity. */
/**
 * Where an unusable session cookie has to go.
 *
 * Redirecting straight to the login screen is not enough: `proxy.ts` sees the
 * cookie is still *present* and bounces the login screen back here, which
 * loops until the browser gives up. The logout Route Handler can actually
 * delete the cookie — a render cannot — so the visitor is sent through it.
 */
async function endStaleSession(
  cookieName: string,
  logoutPath: string,
  loginPath: string
): Promise<never> {
  if (await hasSessionCookie(cookieName)) {
    redirect(`${logoutPath}?reason=expired`)
  }
  redirect(loginPath)
}

/** Redirects to the identify flow when the visitor has no rider identity. */
export async function requireRider(): Promise<RiderSession> {
  const session = await getRiderSession()
  if (session) return session
  return endStaleSession(
    COOKIE.rider,
    ROUTES.riderLogout,
    ROUTES.riderIdentify
  )
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (session) return session
  return endStaleSession(COOKIE.admin, ROUTES.adminLogout, ROUTES.adminLogin)
}

export async function requireAdminToken(): Promise<string> {
  const session = await requireAdminSession()
  return session.token
}

/**
 * UI-level check only.
 *
 * v1.1 restricts suspend / reactivate / delete / country pricing to SUPERADMIN.
 * Hiding those controls is a courtesy; the backend answers 401 regardless, so
 * this is never the thing standing between a plain ADMIN and the action.
 */
export async function isSuperAdmin(): Promise<boolean> {
  const session = await getAdminSession()
  return session?.role === "SUPERADMIN"
}

export async function requireCompanyToken(): Promise<string> {
  const token = await getCompanyToken()
  if (token) return token
  return endStaleSession(
    COOKIE.company,
    ROUTES.companyLogout,
    ROUTES.companyLogin
  )
}

/**
 * Called when the backend rejects a token mid-session: drop the cookie and
 * bounce to the matching login screen rather than rendering a broken page.
 */
export async function endAdminSession(): Promise<never> {
  await clearAdminCookie()
  redirect(ROUTES.adminLogin)
}

export async function endCompanySession(): Promise<never> {
  await clearCompanyCookie()
  redirect(ROUTES.companyLogin)
}
