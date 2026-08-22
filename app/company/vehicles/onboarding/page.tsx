"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function CompanyVehicleOnboardingPage() {
  const router = useRouter()
  const [driverName, setDriverName] = React.useState("")
  const [driverPhone, setDriverPhone] = React.useState("")
  const [numberPlate, setNumberPlate] = React.useState("")
  const [vehicleModel, setVehicleModel] = React.useState("")
  const [vehicleColor, setVehicleColor] = React.useState("")
  const [deviceId, setDeviceId] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/company/vehicles/onboarding/success")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6"
    >
      {/* Form Fields */}
      <div className="mb-6 flex shrink-0 flex-col gap-3.5">
        {/* Pre-filled Company Box */}
        <div className="flex h-13 items-center rounded-xl border border-border/60 bg-[#F0F9F5] px-4 text-[15px] font-medium text-foreground dark:bg-primary/10">
          AKTC Transport Company
        </div>

        <Input
          placeholder="Driver’s full name"
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
        <Input
          type="tel"
          placeholder="Driver’s phone number"
          value={driverPhone}
          onChange={(e) => setDriverPhone(e.target.value)}
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
        <Input
          placeholder="Number plate"
          value={numberPlate}
          onChange={(e) => setNumberPlate(e.target.value)}
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
        <Input
          placeholder="Vehicle make & Model"
          value={vehicleModel}
          onChange={(e) => setVehicleModel(e.target.value)}
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
        <Input
          placeholder="Vehicle Colour"
          value={vehicleColor}
          onChange={(e) => setVehicleColor(e.target.value)}
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
        <Input
          placeholder="Device ID"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
      </div>

      <div className="flex-1"></div>

      {/* Assign Kaggo Device Button */}
      <Button
        type="submit"
        size="lg"
        className="mt-auto h-13 w-full shrink-0 rounded-full bg-[#008967] text-[15px] font-semibold text-white shadow-none transition-transform hover:bg-[#007558] active:scale-98"
      >
        Assign Kaggo Device
      </Button>
    </form>
  )
}
