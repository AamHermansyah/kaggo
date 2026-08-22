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
      className="flex flex-col flex-1 px-5 pt-6 pb-6 relative overflow-x-hidden overflow-y-auto"
    >
      {/* Description */}
      <p className="text-[13.5px] text-foreground/75 leading-relaxed font-normal mb-6 shrink-0">
        This driver will be assigned to all packages in this batch. The driver’s GPS device will be activated and journey tracking will begin according to Kaggo’s journey rules.
      </p>

      {/* Input */}
      <div className="mb-6 shrink-0">
        <Input
          placeholder="Vehicle ID/Driver’s phone number"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
      </div>

      {/* Vehicle Preview Card */}
      <Card className="shrink-0 bg-[#F4F7F6] dark:bg-muted/40 border-none rounded-[16px] py-6 px-4 mb-6 shadow-none flex flex-col items-center justify-center text-center">
        <h3 className="text-[34px] font-bold text-foreground leading-none tracking-tight mb-2">
          KJA 255 GA
        </h3>
        <div className="flex items-center justify-center gap-2 text-[14px] font-medium text-foreground/90 mb-1">
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
        className="w-full rounded-full h-13 text-[15px] font-semibold bg-[#008967] hover:bg-[#007558] text-white active:scale-98 transition-transform shadow-none mt-auto shrink-0"
      >
        Assign Driver
      </Button>
    </form>
  )
}
