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
      className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6"
    >
      {/* Route Title */}
      <h2 className="mb-6 shrink-0 text-[20px] font-bold tracking-tight text-foreground">
        Route
      </h2>

      {/* Form Fields */}
      <div className="mb-6 flex shrink-0 flex-col gap-3.5">
        <Input
          placeholder="Departure"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
        <Input
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
        <Input
          placeholder="Drop off starting time"
          value={dropOffStartTime}
          onChange={(e) => setDropOffStartTime(e.target.value)}
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
        <Input
          placeholder="Drop off closing time"
          value={dropOffCloseTime}
          onChange={(e) => setDropOffCloseTime(e.target.value)}
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
        <Input
          placeholder="Batch number"
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
      </div>

      <div className="flex-1"></div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="mt-auto h-13 w-full shrink-0 rounded-full bg-[#008967] text-[15px] font-semibold text-white shadow-none transition-transform hover:bg-[#007558] active:scale-98"
      >
        Create Batch
      </Button>
    </form>
  )
}
