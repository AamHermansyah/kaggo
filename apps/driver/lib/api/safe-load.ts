import "server-only"

import { unstable_rethrow } from "next/navigation"

import { isApiError, toUserMessage, type ApiErrorCode } from "./errors"

export type LoadResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; retryable: boolean; code?: ApiErrorCode }

/**
 * Turns a failed fetch inside a Server Component into a value instead of a
 * thrown error.
 *
 * Why not rely on the error boundary alone: when a Suspense boundary's child
 * throws, React streams the *fallback* in the SSR HTML and only swaps in the
 * error UI after hydration. Catching here means the retry card is in the first
 * response, so a slow or failed hydration still leaves a usable page.
 * `DataBoundary` stays wrapped around these sections as the net for anything
 * this does not catch.
 *
 * `unstable_rethrow` lets `redirect()` and `notFound()` through untouched.
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
