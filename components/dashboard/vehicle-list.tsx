import Link from "next/link"
import { Plus } from "lucide-react"

import { SectionError } from "@/components/shared/section-error"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { listVehicles } from "@/lib/api/admin"
import type { AdminVehicle } from "@/lib/api/types"
import { loadAdmin } from "@/lib/api/guards"
import type { AdminListParams } from "@/lib/dashboard/params"
import { matchesQuery } from "@/lib/dashboard/params"
import { describeVehicle, formatBattery, formatNumber } from "@/lib/format"
import { ROUTES } from "@/lib/routes"
import { formatPhone } from "@/lib/validation/phone"
import { CursorPager, ListEmpty, ListHeader } from "./list-chrome"

/** "Active 90%" in the design = vehicle status plus tracker battery. */
function deviceSummary(vehicle: AdminVehicle): string {
  const battery = formatBattery(vehicle.batteryLevel)
  const state =
    vehicle.status === "ACTIVE"
      ? vehicle.deviceStatus === "OFF"
        ? "Tracker off"
        : "Active"
      : "Inactive"

  return battery ? `${state} ${battery}` : state
}

export async function VehicleList({
  token,
  params,
}: {
  token: string
  params: AdminListParams
}) {
  const result = await loadAdmin(() =>
    listVehicles(token, { cursor: params.cursor })
  )

  if (!result.ok) {
    return <SectionError title="Could not load vehicles" result={result} />
  }

  const vehicles = result.data.items.filter((vehicle) =>
    matchesQuery(
      params.query,
      vehicle.driverFullName,
      vehicle.driverPhone,
      vehicle.plateNumber,
      vehicle.companyName,
      vehicle.gpsDeviceId
    )
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <ListHeader
          title="Vehicles"
          subtitle={`${formatNumber(vehicles.length)} on this page`}
        />
        <Button
          render={<Link href={ROUTES.vehicleOnboarding} />}
          nativeButton={false}
          size="sm"
          className="shrink-0 rounded-full"
        >
          <Plus data-icon="inline-start" />
          Onboard
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <ListEmpty
          title="No vehicles match"
          description="Search by driver, plate number, company or device ID."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.vehicleId}
              className="flex items-start justify-between gap-4 pb-2"
            >
              <div className="flex min-w-0 flex-col gap-2">
                <span className="truncate text-[15px] font-medium text-foreground">
                  {vehicle.driverFullName}
                </span>
                <span className="text-[14px] text-foreground/90">
                  {formatPhone(vehicle.driverPhone)}
                </span>
                <span className="text-[14px] text-foreground/80">
                  {describeVehicle(vehicle)}
                </span>
                <span className="truncate text-[13px] text-foreground/70">
                  {vehicle.companyName}
                </span>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="text-[14px] text-foreground/90">
                  {vehicle.gpsDeviceId ?? "No device"}
                </span>
                <Badge
                  variant={vehicle.status === "ACTIVE" ? "default" : "secondary"}
                >
                  {deviceSummary(vehicle)}
                </Badge>
                <span className="text-[14px] font-medium text-primary">
                  {vehicle.plateNumber}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <CursorPager
        basePath={ROUTES.adminVehicles}
        pagination={result.data.pagination}
        params={params}
      />
    </div>
  )
}
