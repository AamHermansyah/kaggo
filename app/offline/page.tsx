import type { Metadata } from "next"
import Link from "next/link"
import { CloudOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/routes"
import { RetryButton } from "./retry-button"

export const metadata: Metadata = {
  title: "You are offline",
  description: "Kaggo could not reach the network.",
  robots: { index: false, follow: false },
}

/**
 * Offline fallback.
 *
 * Precached by the service worker and served whenever a navigation fails. It
 * is deliberately static and session-free — the service worker never caches a
 * real page, because those carry another user's parcels or the admin lists.
 */
export default function OfflinePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="flex size-19 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <CloudOff className="size-10 stroke-[1.5]" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-[24px] font-bold tracking-tight text-foreground">
          You are offline
        </h1>
        <p className="max-w-80 text-[14px] leading-relaxed text-foreground/70">
          Kaggo needs a connection to show live tracking. Your listings are safe
          — everything will be here once you are back online.
        </p>
      </div>

      <div className="flex w-full max-w-80 flex-col gap-3">
        <RetryButton />
        <Button
          render={<Link href={ROUTES.home} />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="h-13 w-full rounded-full text-[15px] font-medium"
        >
          Go to home
        </Button>
      </div>
    </div>
  )
}
