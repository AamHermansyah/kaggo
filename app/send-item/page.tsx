"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import { BatteryMedium, ChevronDown, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function SendItem() {
  const router = useRouter()
  const [role, setRole] = React.useState<"sender" | "receiver">("sender")
  const [trackingMode, setTrackingMode] = React.useState<"driver" | "logistics">("driver")
  const [batch, setBatch] = React.useState<string>("")
  const [isNotified, setIsNotified] = React.useState<boolean>(false)

  const handleNotify = () => {
    setIsNotified(true)
    toast.success("Notification request received! You'll be alerted once a driver is assigned.")
    setTimeout(() => {
      router.push("/send-item/success")
    }, 1200)
  }

  return (
    <div className="flex flex-col flex-1 px-5 pt-6 pb-6 relative overflow-x-hidden overflow-y-auto">
      {/* Top Status */}
      <div className="flex items-center justify-between mb-6 text-xs font-medium shrink-0">
        <span className="text-primary font-semibold text-[13px]">ID: 08034567890</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-primary" />
            <span className="text-foreground text-[13px]">56</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-destructive" />
            <span className="text-foreground text-[13px]">34</span>
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <span className="text-[14px] font-medium text-foreground">Select your role</span>
        <RadioGroup
          value={role}
          onValueChange={(val) => setRole(val as "sender" | "receiver")}
          className="flex-1 justify-end flex items-center gap-4"
        >
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
            <span className={role === "sender" ? "text-foreground font-medium" : "text-muted-foreground"}>
              Sender
            </span>
            <RadioGroupItem value="sender" id="sender" className="size-4" />
          </label>
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
            <span className={role === "receiver" ? "text-foreground font-medium" : "text-muted-foreground"}>
              Receiver
            </span>
            <RadioGroupItem value="receiver" id="receiver" className="size-4" />
          </label>
        </RadioGroup>
      </div>

      {/* Form Inputs */}
      <div className="flex flex-col gap-3 mb-5 shrink-0">
        <Input
          placeholder={role === "sender" ? "Receiver’s phone number" : "Sender’s phone number"}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
        />
        <Input
          placeholder="What are you sending?"
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
        />
        <Input
          placeholder="From"
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
        />
        <Input
          placeholder="To"
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
        />

        {trackingMode === "driver" ? (
          /* Driver Mode Specific Field */
          <Input
            placeholder="Driver’s phone number/Vehicle ID"
            className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
          />
        ) : (
          /* Logistics Mode Specific Fields */
          <>
            <Input
              placeholder="Company code"
              className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
            />
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="h-13 w-full rounded-xl text-[15px] px-4 border border-input bg-transparent flex items-center justify-between text-left transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 shrink-0"
                  >
                    <span className={batch ? "text-foreground font-medium" : "text-muted-foreground"}>
                      {batch || "Select Batch"}
                    </span>
                    <ChevronDown className="size-4 text-muted-foreground stroke-[1.5]" />
                  </button>
                }
              />
              <DropdownMenuContent align="start" className="w-(--anchor-width) rounded-xl shadow-lg border-border/60 p-1.5">
                {["Batch 01 - Morning (08:00 AM)", "Batch 02 - Afternoon (01:00 PM)", "Batch 03 - Evening (05:00 PM)"].map((b) => (
                  <DropdownMenuItem
                    key={b}
                    onClick={() => setBatch(b)}
                    className="py-2.5 px-3 rounded-lg text-[14px] cursor-pointer flex items-center justify-between"
                  >
                    <span>{b}</span>
                    {batch === b && <Check className="size-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      {/* Switch Link */}
      <div className="flex justify-center mb-6 shrink-0">
        {trackingMode === "driver" ? (
          <button
            type="button"
            onClick={() => setTrackingMode("logistics")}
            className="text-primary hover:underline text-[14px] font-medium transition-colors text-center cursor-pointer"
          >
            I’m tracking item through a logistics company
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setTrackingMode("driver")}
            className="text-primary hover:underline text-[14px] font-medium transition-colors text-center cursor-pointer"
          >
            I’m tracking item through a driver
          </button>
        )}
      </div>

      {/* Mode Specific Card / Notice Box */}
      {trackingMode === "driver" ? (
        /* Driver Mode: Vehicle Card */
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
      ) : (
        /* Logistics Mode: Notification Notice Box */
        <div className="shrink-0 bg-[#EBF7F2] dark:bg-primary/10 rounded-[14px] py-4 px-6 mb-6 flex items-center justify-center text-center">
          <p className="text-[13.5px] text-foreground/80 leading-relaxed font-normal">
            You will be notified to complete payment once your package is assigned to a driver
          </p>
        </div>
      )}

      <div className="flex-1"></div>

      {/* Action Button */}
      {trackingMode === "driver" ? (
        <Button
          render={<Link href="/payment" />}
          nativeButton={false}
          size="lg"
          className="w-full rounded-full h-12.5 text-[15px] font-medium bg-[#008967] hover:bg-[#007558] text-white active:scale-98 transition-transform shadow-none mt-auto shrink-0"
        >
          Proceed to pay ₦500
        </Button>
      ) : (
        <Button
          onClick={handleNotify}
          size="lg"
          disabled={isNotified}
          className="w-full rounded-full h-12.5 text-[15px] font-medium bg-[#008967] hover:bg-[#007558] text-white active:scale-98 transition-transform shadow-none mt-auto shrink-0"
        >
          {isNotified ? "Notified!" : "Notify me"}
        </Button>
      )}
    </div>
  )
}
