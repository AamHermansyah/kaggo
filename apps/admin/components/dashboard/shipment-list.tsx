import { CheckCircle2, Clock } from "lucide-react"

import { SectionError } from "@/components/shared/section-error"
import { Badge } from "@/components/ui/badge"
import { listShipments } from "@/lib/api/admin"
import type { AdminShipment, ShipmentStatus } from "@/lib/api/types"
import { loadAdmin } from "@/lib/api/guards"
import type { AdminListParams } from "@/lib/dashboard/params"
import { matchesQuery } from "@/lib/dashboard/params"
import {
  formatCoordinates,
  formatCurrency,
  formatDateTime,
  formatNumber,
} from "@/lib/format"
import { ROUTES } from "@/lib/routes"
import { formatPhone } from "@/lib/validation/phone"
import { cn } from "@/lib/utils"
import { CursorPager, ListEmpty, ListHeader } from "./list-chrome"

const STATUS_LABEL: Record<ShipmentStatus, string> = {
  PENDING_PAYMENT: "Awaiting payment",
  ACTIVE: "In transit",
  RECEIVED: "Delivered",
  CANCELLED: "Cancelled",
}

function positionLabel(shipment: AdminShipment): string {
  const coordinates = formatCoordinates(shipment.currentStatus)
  if (coordinates) return `Last seen ${coordinates}`
  return STATUS_LABEL[shipment.status]
}

export async function ShipmentList({
  token,
  params,
}: {
  token: string
  params: AdminListParams
}) {
  const result = await loadAdmin(() =>
    listShipments(token, { cursor: params.cursor })
  )

  if (!result.ok) {
    return <SectionError title="Could not load shipments" result={result} />
  }

  const shipments = result.data.items.filter((shipment) =>
    matchesQuery(
      params.query,
      shipment.itemName,
      shipment.senderPhone,
      shipment.receiverPhone,
      shipment.vehiclePlateNumber,
      shipment.route.from,
      shipment.route.to
    )
  )

  return (
    <div className="flex flex-col gap-6">
      <ListHeader
        title="Shipments"
        subtitle={`${formatNumber(shipments.length)} on this page`}
      />

      {shipments.length === 0 ? (
        <ListEmpty
          title="No shipments match"
          description="Search by item, phone number, plate or route."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {shipments.map((shipment) => (
            <article
              key={shipment.shipmentId}
              className={cn(
                "flex flex-col gap-3 border-b border-border/40 pb-5 last:border-b-0",
                shipment.deletedAt && "opacity-60"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-1.5 flex shrink-0 flex-col items-center">
                    <span className="size-2 rounded-full bg-primary" />
                    <span className="my-1 h-4 w-px bg-border" />
                    <span className="size-2 rounded-full bg-destructive" />
                  </div>
                  <div className="flex min-w-0 flex-col gap-3 text-[15px] font-medium text-foreground">
                    <span className="truncate">
                      {formatPhone(shipment.senderPhone)}
                    </span>
                    <span className="truncate">
                      {formatPhone(shipment.receiverPhone)}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <Badge
                    variant={
                      shipment.status === "ACTIVE" ? "default" : "secondary"
                    }
                  >
                    {shipment.deletedAt
                      ? "Deleted"
                      : STATUS_LABEL[shipment.status]}
                  </Badge>
                  <span className="text-[14px] font-semibold text-foreground">
                    {formatCurrency(shipment.priceAmount, shipment.currency)}
                  </span>
                  <span className="text-[13px] text-foreground/70">
                    {shipment.vehiclePlateNumber}
                  </span>
                </div>
              </div>

              <p className="text-[14px] text-foreground/90">
                {shipment.itemName} &middot; {shipment.route.from} –{" "}
                {shipment.route.to}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-foreground/70">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 stroke-2" />
                  {positionLabel(shipment)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="size-4 shrink-0 stroke-2" />
                  {formatDateTime(shipment.createdAt)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      <CursorPager
        basePath={ROUTES.adminShipments}
        pagination={result.data.pagination}
        params={params}
      />
    </div>
  )
}
