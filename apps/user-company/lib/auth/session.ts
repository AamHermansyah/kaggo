import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"

import {
  clearCompanyCookie,
  readCompanyCookie,
  hasSessionCookie,
  readRiderCookie,
  COOKIE,
  type RiderSession,
} from "./cookies"
import { ROUTES } from "@/lib/routes"

export const getRiderSession = cache(
  async (): Promise<RiderSession | null> => readRiderCookie()
)

export const getCompanyToken = cache(
  async (): Promise<string | null> => readCompanyCookie()
)

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

export async function requireRider(): Promise<RiderSession> {
  const session = await getRiderSession()
  if (session) return session
  return endStaleSession(
    COOKIE.rider,
    ROUTES.riderLogout,
    ROUTES.riderIdentify
  )
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

export async function endCompanySession(): Promise<never> {
  await clearCompanyCookie()
  redirect(ROUTES.companyLogin)
}
