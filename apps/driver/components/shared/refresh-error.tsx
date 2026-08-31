"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

import { ErrorState, type ErrorStateProps } from "./error-state"

/**
 * Retry for failures caught *inside* a Server Component, where there is no
 * error boundary to call `unstable_retry()` on.
 *
 * `router.refresh()` re-runs the server render for the current route, so the
 * failed fetch is attempted again without a full page load.
 */
export function RefreshError({
  retryLabel = "Try again",
  ...props
}: Omit<ErrorStateProps, "onRetry">) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <ErrorState
      {...props}
      retryLabel={pending ? "Retrying…" : retryLabel}
      onRetry={() => startTransition(() => router.refresh())}
    />
  )
}
