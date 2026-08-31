import "server-only"

import { unstable_rethrow } from "next/navigation"

import { isApiError, toUserMessage, type ApiErrorCode } from "./errors"

export type LoadResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; retryable: boolean; code?: ApiErrorCode }

/**
 * Turns a failed fetch inside a Server Component into a value instead of a
 * thrown error.
 */
export async function safeLoad<T>(
  loader: () => Promise<T>
): Promise<LoadResult<T>> {
  try {
    return { ok: true, data: await loader() }
  } catch (error) {
    unstable_rethrow(error)

    if (isApiError(error)) {
      if (error.isMissingEndpoint) {
        return {
          ok: false,
          code: "NOT_FOUND",
          retryable: false,
          message:
            "This part of the backend is not available yet. Nothing is broken on your side.",
        }
      }

      return {
        ok: false,
        code: error.code,
        retryable: error.isRetryable,
        message: toUserMessage(error),
      }
    }

    console.error("[safeLoad] unexpected failure", error)
    return {
      ok: false,
      retryable: true,
      message: "Something went wrong while loading this section.",
    }
  }
}
