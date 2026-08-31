"use client"

import { useEffect } from "react"
import { ServerCrash } from "lucide-react"

import { HomeButton } from "@/components/shared/home-button"
import { Button } from "@/components/ui/button"

/**
 * Route-level 5xx boundary.
 *
 * Catches anything a page or nested layout throws. `unstable_retry()` re-runs
 * the failed server render rather than only clearing React state, so a
 * transient upstream failure recovers without a full reload.
 */
export default function AppError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error("[app/error]", error)
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="flex size-19 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <ServerCrash className="size-10 stroke-[1.5]" />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold tracking-widest text-destructive uppercase">
          Something broke
        </p>
        <h1 className="text-[24px] font-bold tracking-tight text-foreground">
          This page could not be loaded
        </h1>
        <p className="max-w-80 text-[14px] leading-relaxed text-foreground/70">
          We hit an unexpected error. Retrying often fixes it — if it keeps
          happening, please contact support.
        </p>
        {error.digest ? (
          <p className="mt-1 font-mono text-[12px] text-foreground/45">
            Reference: {error.digest}
          </p>
        ) : null}
      </div>

      <div className="flex w-full max-w-80 flex-col gap-3">
        <Button
          onClick={() => unstable_retry()}
          size="lg"
          className="w-full rounded-full"
        >
          Try again
        </Button>
        <HomeButton />
      </div>
    </div>
  )
}
