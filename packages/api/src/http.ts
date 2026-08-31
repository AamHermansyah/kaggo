import "server-only"

import {
  ApiError,
  extractFieldErrors,
  toApiErrorCode,
  type ApiErrorCode,
} from "./errors"

type QueryValue = string | number | boolean | null | undefined

export interface ApiRequest {
  /** Service root, e.g. `ADMIN_API_BASE`. */
  baseUrl: string
  /** Path relative to `baseUrl`, always starting with a slash. */
  path: string
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  body?: unknown
  query?: Record<string, QueryValue>
  headers?: Record<string, string>
  /**
   * Per-request timeout. Defaults to 15000ms or process.env.API_TIMEOUT_MS.
   */
  timeoutMs?: number
  /**
   * Next.js cache directives. Omitted by default: authenticated responses must
   * never be shared between users, so the default is `no-store`.
   */
  revalidate?: number | false
  tags?: string[]
}

export interface ApiResult<T> {
  data: T
  meta?: { pagination?: PaginationMeta } & Record<string, unknown>
}

export interface PaginationMeta {
  cursor: string | null
  nextCursor: string | null
  limit: number
  hasMore: boolean
}

export const DEFAULT_TIMEOUT_MS =
  Number(process.env.API_TIMEOUT_MS) > 0
    ? Number(process.env.API_TIMEOUT_MS)
    : 15_000

export const DEFAULT_API_BASE_URL =
  process.env.API_BASE_URL ?? "https://backend-production-6e6bd.up.railway.app"

function buildUrl(
  baseUrl: string,
  path: string,
  query?: Record<string, QueryValue>
): string {
  const url = new URL(`${baseUrl}${path}`)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

function networkError(error: unknown): ApiError {
  const isTimeout =
    error instanceof Error &&
    (error.name === "TimeoutError" || error.name === "AbortError")

  const code: ApiErrorCode = isTimeout ? "TIMEOUT" : "NETWORK_ERROR"
  return new ApiError({
    code,
    status: isTimeout ? 504 : 503,
    message: isTimeout
      ? "Upstream request timed out."
      : "Could not reach the upstream service.",
  })
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return undefined
  try {
    return JSON.parse(text) as unknown
  } catch {
    return { raw: text }
  }
}

/**
 * Single choke point for every backend call.
 *
 * Responsibilities: URL building, JSON encoding, timeout, envelope unwrapping
 * and error normalisation. Callers only ever see `ApiResult` or `ApiError`.
 */
export async function apiFetch<T>(request: ApiRequest): Promise<ApiResult<T>> {
  const {
    baseUrl,
    path,
    method = "GET",
    body,
    query,
    headers = {},
    timeoutMs = DEFAULT_TIMEOUT_MS,
    revalidate,
    tags,
  } = request

  const init: RequestInit & { next?: { revalidate?: number; tags?: string[] } } =
    {
      method,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      signal: AbortSignal.timeout(timeoutMs),
    }

  if (body !== undefined) {
    init.body = JSON.stringify(body)
  }

  if (typeof revalidate === "number" || tags?.length) {
    init.next = {
      ...(typeof revalidate === "number" ? { revalidate } : {}),
      ...(tags?.length ? { tags } : {}),
    }
  } else {
    // Default for anything user-scoped: never reuse another request's response.
    init.cache = "no-store"
  }

  let response: Response
  try {
    response = await fetch(buildUrl(baseUrl, path, query), init)
  } catch (error) {
    throw networkError(error)
  }

  const payload = await readBody(response)
  const envelope = (payload ?? {}) as {
    success?: boolean
    data?: unknown
    meta?: ApiResult<T>["meta"]
    error?: { code?: string; message?: string; details?: unknown }
  }

  if (!response.ok || envelope.success === false) {
    const rawCode = envelope.error?.code
    const code = toApiErrorCode(rawCode, response.status)
    throw new ApiError({
      code,
      status: response.status,
      message:
        envelope.error?.message ??
        `Request failed with status ${response.status}.`,
      fieldErrors: extractFieldErrors(envelope.error?.details),
      details: envelope.error?.details,
    })
  }

  return {
    data: envelope.data as T,
    meta: envelope.meta,
  }
}

/** Bearer header helper, so no call site hand-writes the scheme. */
export function bearer(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` }
}

/** `x-user-id` header used by the rider-facing API instead of a session token. */
export function riderIdentity(userId: string): Record<string, string> {
  return { "x-user-id": userId }
}
