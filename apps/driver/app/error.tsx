"use client"

import { useEffect } from "react"
import Link from "next/link"
import { RefreshCw, Home } from "lucide-react"

import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/routes"

export default function DriverError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error("[driver/error]", error)
  }, [error])

  return (
    <div className="flex flex-1 flex-col justify-center gap-4 py-10">
      <ErrorState
        title="Driver portal hit an issue"
        description="Could not display vehicle details. Please check your network connection and try again."
        onRetry={() => unstable_retry()}
      />
      <div className="mx-auto flex w-full max-w-70 flex-col gap-2">
        <Button
          render={<Link href={ROUTES.home} />}
          nativeButton={false}
          variant="outline"
          size="sm"
          className="w-full rounded-full"
        >
          <Home className="size-4" />
          Back to Portal
        </Button>
      </div>
    </div>
  )
}
