import "server-only"

import { cookies } from "next/headers"

import { isProduction } from "@/lib/env"
import type { AdminRole } from "@/lib/api/types"
import { COOKIE } from "./cookie-names"
import { readJwtExpiry, seal, unseal } from "./signing"

export { COOKIE }

const ONE_DAY = 60 * 60 * 24
const RIDER_MAX_AGE = ONE_DAY * 90
const STAFF_MAX_AGE = ONE_DAY / 3 // 8 hours

type SameSite = "strict" | "lax"

interface CookieOptions {
  httpOnly: true
  secure: boolean
  sameSite: SameSite
  path: string
  maxAge: number
}

/**
 * `secure` is only relaxed on local HTTP; every other flag is fixed.
 *
 * The rider cookie uses `lax` because Paystack redirects the browser back to
 * `/payment/callback` from a different origin — `strict` would drop the session
 * on exactly that navigation. The staff cookies never cross an origin, so they
 * take the tighter `strict`.
 */
function options(sameSite: SameSite, maxAge: number): CookieOptions {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    path: "/",
    maxAge,
  }
}

/* ------------------------------------------------------------------- rider */

export interface RiderSession {
  userId: string
  phoneNumber: string
}

export async function setRiderCookie(session: RiderSession): Promise<void> {
  const store = await cookies()
  store.set(COOKIE.rider, seal(session), options("lax", RIDER_MAX_AGE))
}

export async function readRiderCookie(): Promise<RiderSession | null> {
  const store = await cookies()
  const session = unseal<RiderSession>(store.get(COOKIE.rider)?.value)
  if (!session?.userId || !session.phoneNumber) return null
  return session
}

export async function clearRiderCookie(): Promise<void> {
  const store = await cookies()
  store.delete({ name: COOKIE.rider, path: "/" })
}

/* --------------------------------------------------------------- staff JWT */

/**
 * Caps cookie lifetime at the token's own expiry so the browser stops sending
 * a token the backend would reject anyway.
 */
function staffMaxAge(token: string): number {
  const exp = readJwtExpiry(token)
  if (!exp) return STAFF_MAX_AGE
  const remaining = exp - Math.floor(Date.now() / 1000)
  if (remaining <= 0) return 0
  return Math.min(remaining, STAFF_MAX_AGE)
}

async function setStaffCookie(name: string, token: string): Promise<void> {
  const store = await cookies()
  store.set(name, token, options("strict", staffMaxAge(token)))
}

async function readStaffCookie(name: string): Promise<string | null> {
  const store = await cookies()
  const token = store.get(name)?.value
  if (!token) return null

  const exp = readJwtExpiry(token)
  if (exp && exp <= Math.floor(Date.now() / 1000)) return null

  return token
}

/**
 * Whether the browser sent this cookie at all, regardless of whether its
 * contents still parse.
 *
 * The guards need this to break a redirect loop: `proxy.ts` only checks that a
 * session cookie exists, so a cookie that is present but unusable — a rotated
 * `SESSION_SECRET`, or a payload written by an older build — makes the proxy
 * and the guard disagree forever, each bouncing the visitor back to the other.
 */
export async function hasSessionCookie(name: string): Promise<boolean> {
  const store = await cookies()
  return store.has(name)
}

async function clearCookie(name: string): Promise<void> {
  const store = await cookies()
  store.delete({ name, path: "/" })
}

/**
 * The admin cookie carries the role alongside the token.
 *
 * v1.1 gates suspend / reactivate / delete / country-pricing behind SUPERADMIN,
 * and the UI needs to know which buttons to render. The payload is signed, so a
 * visitor cannot promote themselves by editing it — but this is only ever used
 * to *hide* controls. The backend re-checks the role on every call and answers
 * 401, so a forged role would buy nothing.
 */
export interface AdminSession {
  token: string
  role: AdminRole
  email: string
}

export async function setAdminCookie(session: AdminSession): Promise<void> {
  const store = await cookies()
  store.set(
    COOKIE.admin,
    seal(session),
    options("strict", staffMaxAge(session.token))
  )
}

export async function readAdminCookie(): Promise<AdminSession | null> {
  const store = await cookies()
  const session = unseal<AdminSession>(store.get(COOKIE.admin)?.value)
  if (!session?.token || !session.role) return null

  const exp = readJwtExpiry(session.token)
  if (exp && exp <= Math.floor(Date.now() / 1000)) return null

  return session
}

export const clearAdminCookie = () => clearCookie(COOKIE.admin)

export const setCompanyCookie = (token: string) =>
  setStaffCookie(COOKIE.company, token)
export const readCompanyCookie = () => readStaffCookie(COOKIE.company)
export const clearCompanyCookie = () => clearCookie(COOKIE.company)
