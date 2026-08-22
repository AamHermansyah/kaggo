"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function OnboardingInfo() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call timeout
    setTimeout(() => {
      router.push("/onboarding/success")
    }, 1500)
  }

  return (
    <div className="flex flex-col flex-1 px-5 pt-6 pb-6 relative overflow-x-hidden overflow-y-auto">
      {/* Top Status */}
      <div className="flex items-center justify-between mb-8 text-[11px] font-medium w-full shrink-0">
        <span className="text-[#008967]">Agent ID: 08034567890</span>
        <span className="text-foreground">Total: 300</span>
      </div>

      <h2 className="text-[19px] font-semibold text-center mb-6 text-foreground shrink-0">
        Onboarding Information
      </h2>

      <form className="flex flex-col gap-3 shrink-0 flex-1">
        <Input
          placeholder="Driver's full name"
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
          required
        />
        <Input
          type="tel"
          placeholder="Driver's phone number"
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
          required
        />
        <Input
          placeholder="Company/Affiliation"
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
          required
        />
        <Input
          placeholder="Number plate"
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
          required
        />
        <Input
          placeholder="Vehicle make & Model"
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
          required
        />
        <Input
          placeholder="Vehicle Colour"
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
          required
        />
        <Input
          placeholder="Device ID"
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
          required
        />

        <div className="flex-1 mt-6"></div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="lg"
          className="w-full rounded-full text-base font-medium active:scale-98 transition-transform shadow-none mt-auto shrink-0"
        >
          {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : "Assign Kaggo Device"}
        </Button>
      </form>
    </div>
  )
}
