import Link from "next/link"
import { PackageSearch } from "lucide-react"

import { RiderIdentityBar } from "@/components/shared/rider-identity-bar"
import { SectionError } from "@/components/shared/section-error"
import TrackItemCard from "@/components/shared/track-item-card"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { listShipments } from "@/lib/api/mobile"
import { loadRider } from "@/lib/api/guards"
import { ROUTES } from "@/lib/routes"

/**
 * The rider's parcels.
 *
 * Rendered inside a `DataBoundary`, so a `GET /shipments` failure swaps this
 * subtree for a retry card instead of taking down the page.
 */
export async function ShipmentsPanel({
  riderId,
  phoneNumber,
}: {
  riderId: string
  phoneNumber: string
}) {
  const result = await loadRider(() => listShipments(riderId))

  if (!result.ok) {
    return (
      <>
        <RiderIdentityBar phoneNumber={phoneNumber} className="mb-8" />
        <SectionError title="Could not load your parcels" result={result} />
      </>
    )
  }

  const shipments = result.data.items
  const sending = shipments.filter((item) => item.indicator === "sender").length
  const receiving = shipments.length - sending

  return (
    <>
      <RiderIdentityBar
        phoneNumber={phoneNumber}
        sentCount={sending}
        receivedCount={receiving}
        className="mb-8"
      />

      <h1 className="mb-5 shrink-0 text-[20px] font-medium text-foreground">
        {shipments.length === 0
          ? "No listings yet"
          : `${shipments.length} listing${shipments.length === 1 ? "" : "s"} found`}
      </h1>

      {shipments.length === 0 ? (
        <Empty className="border border-dashed border-border/70">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageSearch />
            </EmptyMedia>
            <EmptyTitle>Nothing to track yet</EmptyTitle>
            <EmptyDescription>
              Parcels you send or receive will appear here once they are paid
              for.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              render={<Link href={ROUTES.sendItem} />}
              nativeButton={false}
              size="sm"
            >
              List an item
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="mb-8 flex shrink-0 flex-col">
          {shipments.map((shipment) => (
            <TrackItemCard key={shipment.shipmentId} shipment={shipment} />
          ))}
        </div>
      )}
    </>
  )
}

export function ShipmentsSkeleton() {
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="mb-5 h-6 w-40" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="h-58 w-full rounded-[20px]" />
        ))}
      </div>
    </>
  )
}
