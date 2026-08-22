"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BatteryMedium } from "lucide-react"

export default function AssignDriverPage() {
  const router = useRouter()
  const [vehicleId, setVehicleId] = React.useState("KJA 255 GA")

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/company/batches/assign-driver/success")
  }

  return (
    <form
      onSubmit={handleAssign}
      className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6"
    >
      {/* Description */}
      <p className="mb-6 shrink-0 text-[13.5px] leading-relaxed font-normal text-foreground/75">
        This driver will be assigned to all packages in this batch. The driver’s
        GPS device will be activated and journey tracking will begin according
        to Kaggo’s journey rules.
      </p>

      {/* Input */}
      <div className="mb-6 shrink-0">
        <Input
          placeholder="Vehicle ID/Driver’s phone number"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
      </div>

      {/* Vehicle Preview Card */}
      <Card className="mb-6 flex shrink-0 flex-col items-center justify-center rounded-[16px] border-none bg-[#F4F7F6] px-4 py-6 text-center shadow-none dark:bg-muted/40">
        <h3 className="mb-2 text-[34px] leading-none font-bold tracking-tight text-foreground">
          KJA 255 GA
        </h3>
        <div className="mb-1 flex items-center justify-center gap-2 text-[14px] font-medium text-foreground/90">
          <span>Toyota Hiace, White</span>
          <div className="flex items-center gap-1 text-foreground/80">
            <BatteryMedium className="size-4.5 stroke-[1.5]" />
            <span>89%</span>
          </div>
        </div>
        <p className="text-[13px] text-foreground/70">
          AKTC Transport Company Ltd
        </p>
      </Card>

      <div className="flex-1"></div>

      {/* Assign CTA */}
      <Button
        type="submit"
        size="lg"
        className="mt-auto h-13 w-full shrink-0 rounded-full bg-[#008967] text-[15px] font-semibold text-white shadow-none transition-transform hover:bg-[#007558] active:scale-98"
      >
        Assign Driver
      </Button>
    </form>
  )
}
