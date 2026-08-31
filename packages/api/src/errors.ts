/**
 * Normalised error model shared by every backend call.
 *
 * The three Kaggo services all answer with the same envelope
 * (`{ success: false, error: { code, message, details } }`), so a single error
 * type is enough. Anything the network layer itself produces (timeout, DNS,
 * malformed JSON) is mapped onto the same shape with a synthetic code.
 */
export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "DEVICE_VERIFICATION_REQUIRED"
  | "DEVICE_VERIFICATION_FAILED"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "NETWORK_ERROR"
  | "SERVER_ERROR"
  | "UNKNOWN"

/** Field-level messages, keyed by form field name. */
export type FieldErrors = Record<string, string[]>

export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly status: number
  readonly fieldErrors?: FieldErrors
  readonly details?: unknown

  constructor(init: {
    code: ApiErrorCode
    message: string
    status: number
    fieldErrors?: FieldErrors
    details?: unknown
  }) {
    super(init.message)
    this.name = "ApiError"
    this.code = init.code
    this.status = init.status
    this.fieldErrors = init.fieldErrors
    this.details = init.details
  }

  /** The session is gone or was never valid — the caller should re-authenticate. */
  get isAuthError(): boolean {
    return this.code === "UNAUTHORIZED" || this.status === 401
  }

  /**
   * The endpoint is not deployed on the backend yet. Distinguished from a
   * genuine "record not found" by the caller, which knows whether it addressed
   * a collection or a single resource.
   */
  get isMissingEndpoint(): boolean {
    return this.status === 404 && /route not found/i.test(this.message)
  }

  /** Worth offering a retry button for — transient rather than user error. */
  get isRetryable(): boolean {
    return (
      this.code === "TIMEOUT" ||
      this.code === "NETWORK_ERROR" ||
      this.code === "SERVER_ERROR" ||
      this.code === "RATE_LIMITED"
    )
  }
}

const CODE_BY_STATUS: Record<number, ApiErrorCode> = {
  400: "VALIDATION_ERROR",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "VALIDATION_ERROR",
  429: "RATE_LIMITED",
}

const KNOWN_CODES = new Set<string>([
  "VALIDATION_ERROR",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "DEVICE_VERIFICATION_REQUIRED",
  "DEVICE_VERIFICATION_FAILED",
  "RATE_LIMITED",
  "TIMEOUT",
  "NETWORK_ERROR",
  "SERVER_ERROR",
])

export function toApiErrorCode(raw: unknown, status: number): ApiErrorCode {
  if (typeof raw === "string" && KNOWN_CODES.has(raw)) {
    return raw as ApiErrorCode
  }
  if (status >= 500) return "SERVER_ERROR"
  return CODE_BY_STATUS[status] ?? "UNKNOWN"
}

/**
 * The backend reports Zod failures as
 * `details: { fieldErrors: { email: ["Required"] }, formErrors: [] }`.
 */
export function extractFieldErrors(details: unknown): FieldErrors | undefined {
  if (!details || typeof details !== "object") return undefined
  const bag = (details as { fieldErrors?: unknown }).fieldErrors
  if (!bag || typeof bag !== "object") return undefined

  const out: FieldErrors = {}
  for (const [key, value] of Object.entries(bag as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      const messages = value.filter((v): v is string => typeof v === "string")
      if (messages.length > 0) out[key] = messages
    }
  }
  return Object.keys(out).length > 0 ? out : undefined
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

/** Human-facing copy. Never leaks internals for 5xx. */
const FRIENDLY_MESSAGE: Partial<Record<ApiErrorCode, string>> = {
  TIMEOUT: "The server took too long to respond. Please try again.",
  NETWORK_ERROR: "Could not reach the server. Check your connection.",
  SERVER_ERROR: "Something went wrong on our side. Please try again.",
  RATE_LIMITED: "Too many attempts. Please wait a moment and try again.",
  UNAUTHORIZED: "Your session has expired. Please sign in again.",
  FORBIDDEN: "You do not have permission to do that.",
  UNKNOWN: "Something went wrong. Please try again.",
}

/**
 * Safe message for the UI: server-side and unknown failures are replaced with
 * generic copy so backend internals are never rendered to a user.
 */
export function toUserMessage(error: unknown, fallback?: string): string {
  if (isApiError(error)) {
    return FRIENDLY_MESSAGE[error.code] ?? error.message
  }
  return fallback ?? FRIENDLY_MESSAGE.UNKNOWN!
}
