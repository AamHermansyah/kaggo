import { ErrorState } from "./error-state"
import { RefreshError } from "./refresh-error"
import type { LoadResult } from "@/lib/api/safe-load"

/**
 * Renders the failure half of a `safeLoad` result.
 *
 * Retryable problems (timeout, network, 5xx) get a retry button; permanent ones
 * (a route the backend has not shipped, a permission error) do not — offering
 * "try again" for something that cannot succeed is worse than saying so.
 */
export function SectionError({
  title,
  result,
}: {
  title: string
  result: Extract<LoadResult<unknown>, { ok: false }>
}) {
  if (result.retryable) {
    return <RefreshError title={title} description={result.message} />
  }

  return <ErrorState title={title} description={result.message} />
}
