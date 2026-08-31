import "server-only"

import { z } from "zod"

const envSchema = z.object({
  API_BASE_URL: z.string().url("API_BASE_URL must be an absolute URL"),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL must be an absolute URL")
    .default("http://localhost:3000"),
  API_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(60_000).default(15_000),
  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET must be at least 32 characters")
    .default("development_secret_that_is_at_least_32_chars_long"),
})

function loadEnv() {
  const parsed = envSchema.safeParse({
    API_BASE_URL: process.env.API_BASE_URL ?? "https://backend-production-6e6bd.up.railway.app",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    API_TIMEOUT_MS: process.env.API_TIMEOUT_MS ?? 15000,
    SESSION_SECRET: process.env.SESSION_SECRET ?? "development_secret_that_is_at_least_32_chars_long",
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

export const API_BASE_URL = env.API_BASE_URL.replace(/\/+$/, "")
export const MOBILE_API_BASE = API_BASE_URL
export const ADMIN_API_BASE = `${API_BASE_URL}/admin`
export const COMPANY_API_BASE = `${API_BASE_URL}/company`
