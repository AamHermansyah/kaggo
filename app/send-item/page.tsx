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
  const [trackingMode, setTrackingMode] = React.useState<
    "driver" | "logistics"
  >("driver")
  const [batch, setBatch] = React.useState<string>("")
  const [isNotified, setIsNotified] = React.useState<boolean>(false)

  const handleNotify = () => {
    setIsNotified(true)
    toast.success(
      "Notification request received! You'll be alerted once a driver is assigned."
    )
    setTimeout(() => {
      router.push("/send-item/success")
    }, 1200)
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6">
      {/* Top Status */}
      <div className="mb-6 flex shrink-0 items-center justify-between text-xs font-medium">
        <span className="text-[13px] font-semibold text-primary">
          ID: 08034567890
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-primary" />
            <span className="text-[13px] text-foreground">56</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-destructive" />
            <span className="text-[13px] text-foreground">34</span>
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="mb-5 flex shrink-0 items-center justify-between">
        <span className="text-[14px] font-medium text-foreground">
          Select your role
        </span>
        <RadioGroup
          value={role}
          onValueChange={(val) => setRole(val as "sender" | "receiver")}
          className="flex flex-1 items-center justify-end gap-4"
        >
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium select-none">
            <span
              className={
                role === "sender"
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }
            >
              Sender
            </span>
            <RadioGroupItem value="sender" id="sender" className="size-4" />
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium select-none">
            <span
              className={
                role === "receiver"
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }
            >
              Receiver
            </span>
            <RadioGroupItem value="receiver" id="receiver" className="size-4" />
          </label>
        </RadioGroup>
      </div>

      {/* Form Inputs */}
      <div className="mb-5 flex shrink-0 flex-col gap-3">
        <Input
          placeholder={
            role === "sender"
              ? "Receiver’s phone number"
              : "Sender’s phone number"
          }
          className="h-13 shrink-0 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
        <Input
          placeholder="What are you sending?"
          className="h-13 shrink-0 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
        <Input
          placeholder="From"
          className="h-13 shrink-0 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
        <Input
          placeholder="To"
          className="h-13 shrink-0 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />

        {trackingMode === "driver" ? (
          /* Driver Mode Specific Field */
          <Input
            placeholder="Driver’s phone number/Vehicle ID"
            className="h-13 shrink-0 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
          />
        ) : (
          /* Logistics Mode Specific Fields */
          <>
            <Input
              placeholder="Company code"
              className="h-13 shrink-0 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
            />
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="flex h-13 w-full shrink-0 items-center justify-between rounded-xl border border-input bg-transparent px-4 text-left text-[15px] transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <span
                      className={
                        batch
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {batch || "Select Batch"}
                    </span>
                    <ChevronDown className="size-4 stroke-[1.5] text-muted-foreground" />
                  </button>
                }
              />
              <DropdownMenuContent
                align="start"
                className="w-(--anchor-width) rounded-xl border-border/60 p-1.5 shadow-lg"
              >
                {[
                  "Batch 01 - Morning (08:00 AM)",
                  "Batch 02 - Afternoon (01:00 PM)",
                  "Batch 03 - Evening (05:00 PM)",
                ].map((b) => (
                  <DropdownMenuItem
                    key={b}
                    onClick={() => setBatch(b)}
                    className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-[14px]"
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
      <div className="mb-6 flex shrink-0 justify-center">
        {trackingMode === "driver" ? (
          <button
            type="button"
            onClick={() => setTrackingMode("logistics")}
            className="cursor-pointer text-center text-[14px] font-medium text-primary transition-colors hover:underline"
          >
            I’m tracking item through a logistics company
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setTrackingMode("driver")}
            className="cursor-pointer text-center text-[14px] font-medium text-primary transition-colors hover:underline"
          >
            I’m tracking item through a driver
          </button>
        )}
      </div>

      {/* Mode Specific Card / Notice Box */}
      {trackingMode === "driver" ? (
        /* Driver Mode: Vehicle Card */
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
      ) : (
        /* Logistics Mode: Notification Notice Box */
        <div className="mb-6 flex shrink-0 items-center justify-center rounded-[14px] bg-[#EBF7F2] px-6 py-4 text-center dark:bg-primary/10">
          <p className="text-[13.5px] leading-relaxed font-normal text-foreground/80">
            You will be notified to complete payment once your package is
            assigned to a driver
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
          className="mt-auto h-12.5 w-full shrink-0 rounded-full bg-[#008967] text-[15px] font-medium text-white shadow-none transition-transform hover:bg-[#007558] active:scale-98"
        >
          Proceed to pay ₦500
        </Button>
      ) : (
        <Button
          onClick={handleNotify}
          size="lg"
          disabled={isNotified}
          className="mt-auto h-12.5 w-full shrink-0 rounded-full bg-[#008967] text-[15px] font-medium text-white shadow-none transition-transform hover:bg-[#007558] active:scale-98"
        >
          {isNotified ? "Notified!" : "Notify me"}
        </Button>
      )}
    </div>
  )
}
