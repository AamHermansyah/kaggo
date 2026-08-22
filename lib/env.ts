import "server-only"

import { z } from "zod"

/**
 * Server-side environment contract.
 *
 * `API_BASE_URL` is deliberately NOT a `NEXT_PUBLIC_*` variable: every backend
 * call is made from the server (Server Component / Server Action / Route
 * Handler) so that session tokens never reach the browser.
 */
const envSchema = z.object({
  API_BASE_URL: z.url({ error: "API_BASE_URL must be an absolute URL" }),
  NEXT_PUBLIC_SITE_URL: z
    .url({ error: "NEXT_PUBLIC_SITE_URL must be an absolute URL" })
    .default("http://localhost:3000"),
  API_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(60_000).default(15_000),
  /**
   * HMAC key used to sign the rider identity cookie. The rider API trusts a
   * bare `x-user-id`, so signing the cookie is what stops a visitor from
   * hand-editing it into somebody else's identity.
   */
  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET must be at least 32 characters"),
})

function loadEnv() {
  const parsed = envSchema.safeParse({
    API_BASE_URL: process.env.API_BASE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    API_TIMEOUT_MS: process.env.API_TIMEOUT_MS,
    SESSION_SECRET: process.env.SESSION_SECRET,
  })

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n")
    throw new Error(
      `Invalid environment configuration. Check your .env.local file:\n${details}`
    )
  }

  return parsed.data
}

export const env = loadEnv()

export const isProduction = process.env.NODE_ENV === "production"

/** Trailing slashes are stripped so path joining stays predictable. */
export const API_BASE_URL = env.API_BASE_URL.replace(/\/+$/, "")

/** Base URL of the mobile / rider-facing API. */
export const MOBILE_API_BASE = API_BASE_URL

/** Base URL of the admin portal API. */
export const ADMIN_API_BASE = `${API_BASE_URL}/admin`

/** Base URL of the logistics-company API. */
export const COMPANY_API_BASE = `${API_BASE_URL}/company`
