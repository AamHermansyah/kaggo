import { BatteryMedium, BatteryWarning } from "lucide-react"

import { Card } from "@/components/ui/card"
import { describeVehicle, formatBattery } from "@/lib/format"
import { cn } from "@/lib/utils"

export interface VehicleCardData {
  plateNumber: string
  make?: string | null
  model?: string | null
  colour?: string | null
  companyName?: string | null
  batteryLevel?: number | null
  /** Whether the tracker acknowledged the wake command. */
  deviceConnected?: boolean
}

/**
 * Vehicle confirmation card, shared by the rider listing form and the company
 * driver-assignment screen — the designs draw the same card in both places.
 */
export function VehicleCard({
  vehicle,
  className,
}: {
  vehicle: VehicleCardData
  className?: string
}) {
  const battery = formatBattery(vehicle.batteryLevel)
  const offline = vehicle.deviceConnected === false

  return (
    <Card
      className={cn(
        "flex shrink-0 flex-col items-center justify-center rounded-[16px] border-none bg-secondary px-4 py-6 text-center shadow-none",
        className
      )}
    >
      <h3 className="mb-2 text-[34px] leading-none font-bold tracking-tight text-foreground">
        {vehicle.plateNumber}
      </h3>

      <div className="mb-1 flex flex-wrap items-center justify-center gap-2 text-[14px] font-medium text-foreground/90">
        <span>{describeVehicle(vehicle)}</span>
        {battery ? (
          <span className="flex items-center gap-1 text-foreground/80">
            {offline ? (
              <BatteryWarning className="size-4.5 stroke-[1.5] text-destructive" />
            ) : (
              <BatteryMedium className="size-4.5 stroke-[1.5]" />
            )}
            {battery}
          </span>
        ) : null}
      </div>

      {vehicle.companyName ? (
        <p className="text-[13px] text-foreground/70">{vehicle.companyName}</p>
      ) : null}

      {offline ? (
        <p className="mt-2 text-[12px] leading-relaxed text-foreground/60">
          The tracker did not respond just now. You can still list your item —
          tracking starts as soon as the device reconnects.
        </p>
      ) : null}
    </Card>
  )
}
