import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"

import {
  clearAdminCookie,
  readAdminCookie,
  hasSessionCookie,
  COOKIE,
  type AdminSession,
} from "./cookies"
import { ROUTES } from "@/lib/routes"

export const getAdminSession = cache(
  async (): Promise<AdminSession | null> => readAdminCookie()
)

export const getAdminToken = cache(async (): Promise<string | null> => {
  const session = await readAdminCookie()
  return session?.token ?? null
})

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

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (session) return session
  return endStaleSession(COOKIE.admin, ROUTES.adminLogout, ROUTES.adminLogin)
}

export async function requireAdminToken(): Promise<string> {
  const session = await requireAdminSession()
  return session.token
}

export async function isSuperAdmin(): Promise<boolean> {
  const session = await getAdminSession()
  return session?.role === "SUPERADMIN"
}

export async function endAdminSession(): Promise<never> {
  await clearAdminCookie()
  redirect(ROUTES.adminLogin)
}
