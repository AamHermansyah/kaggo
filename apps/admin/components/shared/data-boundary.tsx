"use client"

import { unstable_catchError as catchError, type ErrorInfo } from "next/error"

import { ErrorState } from "./error-state"

interface DataBoundaryProps {
  /** Heading shown when the wrapped section fails. */
  title?: string
  description?: string
}

/**
 * Component-level error boundary with a retry button.
 *
 * `error.tsx` replaces a whole route segment; this replaces only the subtree it
 * wraps, so one failing endpoint takes down one card instead of the page.
 * `unstable_retry()` re-runs the wrapped Server Component's fetch — a plain
 * `router.refresh()` would re-render every sibling as well.
 *
 * Usage:
 * ```tsx
 * <DataBoundary title="Could not load shipments">
 *   <Suspense fallback={<ShipmentsSkeleton />}>
 *     <ShipmentsData />
 *   </Suspense>
 * </DataBoundary>
 * ```
 */
function DataBoundaryFallback(
  { title, description }: DataBoundaryProps,
  { error, unstable_retry }: ErrorInfo
) {
  if (process.env.NODE_ENV !== "production") {
    console.error("[DataBoundary]", error)
  }

  return (
    <ErrorState
      title={title ?? "Could not load this section"}
      description={
        description ??
        "The server did not respond in time. You can retry without leaving the page."
      }
      onRetry={() => unstable_retry()}
    />
  )
}

export const DataBoundary = catchError(DataBoundaryFallback)
