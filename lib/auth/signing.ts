import "server-only"

import { createHmac, timingSafeEqual } from "node:crypto"

import { env } from "@/lib/env"

/**
 * Tamper-proof cookie payloads.
 *
 * The rider API identifies callers by a bare `x-user-id` header, so anything
 * that can edit the cookie can impersonate another rider. Signing the payload
 * server-side means the browser can hold the value but cannot forge one.
 */

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url")
}

function sign(payload: string): string {
  return createHmac("sha256", env.SESSION_SECRET).update(payload).digest("base64url")
}

/** Serialises a JSON payload into `<body>.<signature>`. */
export function seal(value: unknown): string {
  const body = b64url(JSON.stringify(value))
  return `${body}.${sign(body)}`
}

/** Returns the payload only when the signature matches; otherwise `null`. */
export function unseal<T>(token: string | undefined): T | null {
  if (!token) return null

  const separator = token.lastIndexOf(".")
  if (separator <= 0) return null

  const body = token.slice(0, separator)
  const signature = token.slice(separator + 1)

  const expected = Buffer.from(sign(body))
  const received = Buffer.from(signature)
  if (expected.length !== received.length) return null
  if (!timingSafeEqual(expected, received)) return null

  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T
  } catch {
    return null
  }
}

/**
 * Reads the `exp` claim of a JWT without verifying it.
 *
 * Verification is the backend's job — it holds the key. This is used purely to
 * decide how long the cookie should live, so a stale token is dropped by the
 * browser instead of producing a surprise 401 mid-session.
 */
export function readJwtExpiry(token: string): number | null {
  const parts = token.split(".")
  if (parts.length !== 3) return null

  try {
    const claims = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8")
    ) as { exp?: unknown }
    return typeof claims.exp === "number" ? claims.exp : null
  } catch {
    return null
  }
}
