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
      className="flex flex-col flex-1 px-5 pt-6 pb-6 relative overflow-x-hidden overflow-y-auto"
    >
      {/* Form Fields */}
      <div className="flex flex-col gap-3.5 mb-6 shrink-0">
        {/* Pre-filled Company Box */}
        <div className="h-13 rounded-xl bg-[#F0F9F5] dark:bg-primary/10 border border-border/60 px-4 flex items-center text-[15px] font-medium text-foreground">
          AKTC Transport Company
        </div>

        <Input
          placeholder="Driver’s full name"
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
        <Input
          type="tel"
          placeholder="Driver’s phone number"
          value={driverPhone}
          onChange={(e) => setDriverPhone(e.target.value)}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
        <Input
          placeholder="Number plate"
          value={numberPlate}
          onChange={(e) => setNumberPlate(e.target.value)}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
        <Input
          placeholder="Vehicle make & Model"
          value={vehicleModel}
          onChange={(e) => setVehicleModel(e.target.value)}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
        <Input
          placeholder="Vehicle Colour"
          value={vehicleColor}
          onChange={(e) => setVehicleColor(e.target.value)}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
        <Input
          placeholder="Device ID"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
      </div>

      <div className="flex-1"></div>

      {/* Assign Kaggo Device Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full h-13 text-[15px] font-semibold bg-[#008967] hover:bg-[#007558] text-white active:scale-98 transition-transform shadow-none mt-auto shrink-0"
      >
        Assign Kaggo Device
      </Button>
    </form>
  )
}
