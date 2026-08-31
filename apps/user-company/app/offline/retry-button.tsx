"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

/**
 * Retries the page the visitor actually asked for.
 *
 * The service worker serves this page as a fallback without changing the
 * address bar, so `location.reload()` re-requests the original URL rather than
 * `/offline`.
 */
export function RetryButton() {
  const [retrying, setRetrying] = useState(false)

  return (
    <Button
      size="lg"
      disabled={retrying}
      onClick={() => {
        setRetrying(true)
        window.location.reload()
      }}
      className="h-13 w-full rounded-full text-[15px] font-semibold"
    >
      {retrying ? (
        <>
          <Spinner data-icon="inline-start" />
          Reconnecting
        </>
      ) : (
        <>
          <RefreshCw data-icon="inline-start" />
          Try again
        </>
      )}
    </Button>
  )
}
