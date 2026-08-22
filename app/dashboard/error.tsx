"use client"

import { useEffect } from "react"
import Link from "next/link"

import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/routes"

/**
 * Segment boundary for the admin portal, so a failure here keeps the app shell
 * and offers a retry instead of falling through to the global error page.
 */
export default function DashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error("[dashboard/error]", error)
  }, [error])

  return (
    <div className="flex flex-1 flex-col justify-center gap-4 py-10">
      <ErrorState
        title="The admin portal hit an error"
        description="This section could not be rendered. Retry, or sign in again if the problem persists."
        onRetry={() => unstable_retry()}
      />
      <Button
        render={<Link href={ROUTES.adminLogin} />}
        nativeButton={false}
        variant="outline"
        size="sm"
        className="self-center rounded-full"
      >
        Back to sign in
      </Button>
    </div>
  )
}
