"use client"

import { MapPin, CheckCircle2, Clock, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export interface TrackItemData {
  status: "active" | "inactive"
  itemName: string
  location: string
  statusText: string
  time: string
  arrivalTime: string
  vehiclePlate: string
  vehicleModel: string
  company: string
  companyIsGreen?: boolean
  showReceivedButton?: boolean
}

interface TrackItemCardProps {
  data: TrackItemData
}

export default function TrackItemCard({ data }: TrackItemCardProps) {
  const {
    status,
    itemName,
    location,
    statusText,
    time,
    arrivalTime,
    vehiclePlate,
    vehicleModel,
    company,
    companyIsGreen,
    showReceivedButton,
  } = data

  const handleMarkAsReceived = () => {
    toast.success(`${itemName} marked as received!`, {
      description: "The sender will be notified shortly.",
    })
  }

  return (
    <Card className="mb-4 shrink-0 rounded-[20px] border-none bg-[#f4fbf7] p-5 shadow-none">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "size-2 rounded-full",
              status === "active" ? "bg-[#008967]" : "bg-destructive"
            )}
          />
          <h3 className="text-[17px] font-semibold text-foreground">
            {itemName}
          </h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-lg border-border/80 px-3 text-xs font-medium shadow-none"
        >
          Call Driver
        </Button>
      </div>

      {/* Info Rows */}
      <div className="mb-3 flex flex-col gap-2.5">
        <div className="flex items-center gap-3 text-[14px]">
          <MapPin className="size-4.5 stroke-2 text-foreground/80" />
          <span className="text-foreground/90">{location}</span>
        </div>

        <div className="flex items-center gap-3 text-[14px]">
          <CheckCircle2 className="size-4.5 stroke-2 text-foreground/80" />
          <span className="text-foreground/90">
            <span className="text-[#008967]">Status: </span>
            {statusText}
          </span>
        </div>

        <div className="mt-0.5 flex items-center gap-5 text-[13px]">
          <div className="flex items-center gap-2">
            <Clock className="size-4 stroke-2 text-foreground/80" />
            <span className="text-foreground/90">{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="size-4 stroke-2 text-foreground/80" />
            <span className="text-foreground/90">{arrivalTime}</span>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="flex flex-col gap-0.5">
        <h4 className="text-base font-semibold text-foreground">
          {vehiclePlate}
        </h4>
        <p className="mb-1 text-[14px] text-foreground/80">{vehicleModel}</p>
        <p
          className={cn(
            "text-[12px]",
            companyIsGreen ? "text-[#008967]" : "text-foreground/60"
          )}
        >
          {company}
        </p>
      </div>

      {/* Received Button */}
      {showReceivedButton && (
        <Button
          onClick={handleMarkAsReceived}
          className="mt-2 w-full rounded-full"
        >
          Mark as received
        </Button>
      )}
    </Card>
  )
}
