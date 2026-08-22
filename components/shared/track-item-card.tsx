"use client"

import { useTransition } from "react"
import { CheckCircle2, Clock, MapPin, Phone, Timer } from "lucide-react"
import { toast } from "sonner"

import { markReceivedAction } from "@/app/track/actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import type { RiderShipment } from "@/lib/api/types"
import {
  describeVehicle,
  formatCoordinates,
  formatDuration,
  formatTime,
} from "@/lib/format"
import { toE164 } from "@/lib/validation/phone"
import { cn } from "@/lib/utils"

const STATUS_LABEL: Record<RiderShipment["status"], string> = {
  PENDING_PAYMENT: "Awaiting payment",
  ACTIVE: "In transit",
  RECEIVED: "Delivered",
  CANCELLED: "Cancelled",
}

/**
 * Position is reported as raw coordinates — the backend has no reverse
 * geocoder — so the card shows the coordinates rather than a made-up place.
 */
function positionLabel(shipment: RiderShipment): string {
  if (shipment.arrivedAt) return "Arrived at destination"

  const coordinates = formatCoordinates(shipment.currentStatus)
  if (coordinates) return `Last seen at ${coordinates}`

  return shipment.status === "ACTIVE"
    ? "Waiting for the first location report"
    : STATUS_LABEL[shipment.status]
}

function etaLabel(shipment: RiderShipment): string {
  if (shipment.arrivedAt) return "Arrived"
  if (shipment.status !== "ACTIVE") return STATUS_LABEL[shipment.status]

  const remaining = shipment.eta?.remainingSeconds
  if (typeof remaining !== "number") return "ETA not available yet"
  return `Arriving in ${formatDuration(remaining)}`
}

export default function TrackItemCard({
  shipment,
}: {
  shipment: RiderShipment
}) {
  const [pending, startTransition] = useTransition()

  const isActive = shipment.status === "ACTIVE" && !shipment.arrivedAt
  const canMarkReceived =
    shipment.indicator === "receiver" && shipment.status === "ACTIVE"
  const driverTel = toE164(shipment.driverPhone)

  function markReceived() {
    startTransition(async () => {
      const result = await markReceivedAction(shipment.shipmentId)
      if (result.ok) {
        toast.success(`${shipment.itemName} marked as received`, {
          description: "The sender has been notified.",
        })
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Card className="mb-4 shrink-0 rounded-[20px] border-none bg-secondary p-5 shadow-none">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className={cn(
              "size-2 shrink-0 rounded-full",
              isActive ? "bg-primary" : "bg-destructive"
            )}
          />
          <h3 className="truncate text-[17px] font-semibold text-foreground">
            {shipment.itemName}
          </h3>
        </div>

        {driverTel ? (
          <Button
            render={<a href={`tel:${driverTel}`} />}
            nativeButton={false}
            variant="outline"
            size="sm"
            className="h-8 shrink-0 rounded-lg border-border/80 px-3 text-xs font-medium shadow-none"
          >
            <Phone data-icon="inline-start" />
            Call driver
          </Button>
        ) : null}
      </div>

      <div className="mb-3 flex flex-col gap-2.5">
        <div className="flex items-center gap-3 text-[14px]">
          <MapPin className="size-4.5 shrink-0 stroke-2 text-foreground/80" />
          <span className="text-foreground/90">
            {shipment.route.from} – {shipment.route.to}
          </span>
        </div>

        <div className="flex items-start gap-3 text-[14px]">
          <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 stroke-2 text-foreground/80" />
          <span className="text-foreground/90">
            <span className="text-primary">Status: </span>
            {positionLabel(shipment)}
          </span>
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
          <div className="flex items-center gap-2">
            <Clock className="size-4 shrink-0 stroke-2 text-foreground/80" />
            <span className="text-foreground/90">
              {formatTime(shipment.currentStatus?.at ?? shipment.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="size-4 shrink-0 stroke-2 text-foreground/80" />
            <span className="text-foreground/90">{etaLabel(shipment)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        <h4 className="text-base font-semibold text-foreground">
          {shipment.vehicle.plateNumber}
        </h4>
        <p className="mb-1 text-[14px] text-foreground/80">
          {describeVehicle(shipment.vehicle)}
        </p>
        <p className="text-[12px] text-foreground/60">
          {shipment.vehicle.companyName}
        </p>
      </div>

      {canMarkReceived ? (
        <Button
          onClick={markReceived}
          disabled={pending}
          aria-busy={pending}
          className="mt-2 w-full rounded-full"
        >
          {pending ? (
            <>
              <Spinner data-icon="inline-start" />
              Marking…
            </>
          ) : (
            "Mark as received"
          )}
        </Button>
      ) : null}
    </Card>
  )
}
