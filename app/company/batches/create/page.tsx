"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function CreateBatchPage() {
  const router = useRouter()
  const [departure, setDeparture] = React.useState("")
  const [destination, setDestination] = React.useState("")
  const [dropOffStartTime, setDropOffStartTime] = React.useState("")
  const [dropOffCloseTime, setDropOffCloseTime] = React.useState("")
  const [batchNumber, setBatchNumber] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Batch created successfully!")
    router.push("/company/batches")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col flex-1 px-5 pt-6 pb-6 relative overflow-x-hidden overflow-y-auto"
    >
      {/* Route Title */}
      <h2 className="text-[20px] font-bold text-foreground tracking-tight mb-6 shrink-0">
        Route
      </h2>

      {/* Form Fields */}
      <div className="flex flex-col gap-3.5 mb-6 shrink-0">
        <Input
          placeholder="Departure"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
        <Input
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
        <Input
          placeholder="Drop off starting time"
          value={dropOffStartTime}
          onChange={(e) => setDropOffStartTime(e.target.value)}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
        <Input
          placeholder="Drop off closing time"
          value={dropOffCloseTime}
          onChange={(e) => setDropOffCloseTime(e.target.value)}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
        <Input
          placeholder="Batch number"
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
      </div>

      <div className="flex-1"></div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full h-13 text-[15px] font-semibold bg-[#008967] hover:bg-[#007558] text-white active:scale-98 transition-transform shadow-none mt-auto shrink-0"
      >
        Create Batch
      </Button>
    </form>
  )
}
