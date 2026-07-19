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
    showReceivedButton
  } = data

  const handleMarkAsReceived = () => {
    toast.success(`${itemName} marked as received!`, {
      description: "The sender will be notified shortly."
    })
  }

  return (
    <Card className="shrink-0 bg-[#f4fbf7] border-none rounded-[20px] p-5 shadow-none mb-4">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("w-2 h-2 rounded-full", status === "active" ? "bg-[#008967]" : "bg-destructive")} />
          <h3 className="font-semibold text-[17px] text-foreground">{itemName}</h3>
        </div>
        <Button variant="outline" size="sm" className="h-8 rounded-lg px-3 text-xs font-medium border-border/80 shadow-none">
          Call Driver
        </Button>
      </div>

      {/* Info Rows */}
      <div className="flex flex-col gap-2.5 mb-3">
        <div className="flex items-center gap-3 text-[14px]">
          <MapPin className="w-[18px] h-[18px] text-foreground/80 stroke-2" />
          <span className="text-foreground/90">{location}</span>
        </div>

        <div className="flex items-center gap-3 text-[14px]">
          <CheckCircle2 className="w-[18px] h-[18px] text-foreground/80 stroke-2" />
          <span className="text-foreground/90">
            <span className="text-[#008967]">Status: </span>
            {statusText}
          </span>
        </div>

        <div className="flex items-center gap-5 text-[13px] mt-0.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-foreground/80 stroke-2" />
            <span className="text-foreground/90">{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-foreground/80 stroke-2" />
            <span className="text-foreground/90">{arrivalTime}</span>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="flex flex-col gap-0.5">
        <h4 className="font-semibold text-base text-foreground">{vehiclePlate}</h4>
        <p className="text-[14px] text-foreground/80 mb-1">{vehicleModel}</p>
        <p className={cn("text-[12px]", companyIsGreen ? "text-[#008967]" : "text-foreground/60")}>
          {company}
        </p>
      </div>

      {/* Received Button */}
      {showReceivedButton && (
        <Button onClick={handleMarkAsReceived} className="w-full rounded-full mt-2">
          Mark as received
        </Button>
      )}
    </Card>
  )
}
