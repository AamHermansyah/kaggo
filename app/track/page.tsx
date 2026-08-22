import { Suspense } from "react"
import type { Metadata } from "next"

import { DataBoundary } from "@/components/shared/data-boundary"
import { SupportLink } from "@/components/shared/support-link"
import { requireRider } from "@/lib/auth/session"
import { ShipmentsPanel, ShipmentsSkeleton } from "./shipments-panel"

export const metadata: Metadata = {
  title: "Track item",
  description: "Follow your parcels from departure to destination.",
  robots: { index: false, follow: false },
}

export default async function TrackPage() {
  const rider = await requireRider()

  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6">
      <DataBoundary
        title="Could not load your parcels"
        description="We could not reach the tracking service. Your listings are safe — retry to load them."
      >
        <Suspense fallback={<ShipmentsSkeleton />}>
          <ShipmentsPanel
            riderId={rider.userId}
            phoneNumber={rider.phoneNumber}
          />
        </Suspense>
      </DataBoundary>

      <div className="flex-1" />

      <div className="mt-auto flex shrink-0 justify-center pt-6">
        <SupportLink />
      </div>
    </div>
  )
}
