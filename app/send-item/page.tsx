import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import { BatteryMedium } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function SendItem() {
  return (
    <div className="flex flex-col flex-1 px-5 pt-6 pb-6 relative overflow-x-hidden overflow-y-auto">
      {/* Top Status */}
      <div className="flex items-center justify-between mb-8 text-xs font-medium">
        <span className="text-primary">ID: 08034567890</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>56</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span>34</span>
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-foreground">Select your role</span>
        <RadioGroup defaultValue="sender" className="flex-1 justify-end flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <span className="text-muted-foreground">Sender</span>
            <RadioGroupItem value="sender" id="sender" className="w-4 h-4" />
          </label>
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <span className="text-muted-foreground">Receiver</span>
            <RadioGroupItem value="receiver" id="receiver" className="w-4 h-4" />
          </label>
        </RadioGroup>
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-3 mb-6 shrink-0">
        <Input
          placeholder="Receiver's phone number"
          className="h-[52px] rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
        />
        <Input
          placeholder="What are you sending?"
          className="h-[52px] rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
        />
        <Input
          placeholder="From"
          className="h-[52px] rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
        />
        <Input
          placeholder="To"
          className="h-[52px] rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
        />
        <Input
          type="tel"
          placeholder="Driver's phone number"
          className="h-[52px] rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
        />
        <Input
          placeholder="Vehicle number plate"
          className="h-[52px] rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
        />
      </div>

      {/* Vehicle Card */}
      <Card className="shrink-0 bg-primary/10 border-none rounded-[16px] py-7 px-4 mb-8 shadow-none flex flex-col items-center justify-center text-center">
        <h3 className="text-[36px] font-semibold text-foreground leading-none tracking-tight">
          KJA 255 GA
        </h3>
        <div className="flex items-center justify-center gap-2 text-[15px] font-medium text-foreground/90">
          <span>Toyota Hiace, White</span>
          <div className="flex items-center gap-1">
            <BatteryMedium className="w-[18px] h-[18px] stroke-[1.5]" />
            <span>89%</span>
          </div>
        </div>
        <p className="text-[13px] text-foreground/70">
          AKTC Transport Company Ltd
        </p>
      </Card>

      <div className="flex-1"></div>

      <Separator className="w-[calc(100%+2.5rem)] -mx-5 mb-6" />

      {/* Proceed Button */}
      <Button render={<Link href="/payment" />} nativeButton={false} size="lg" className="w-full rounded-full text-base font-medium active:scale-[0.98] transition-transform shadow-none mt-auto">
        Proceed to pay ₦500
      </Button>
    </div>
  )
}
