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
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6">
      {/* Top Status */}
      <div className="mb-8 flex w-full shrink-0 items-center justify-between text-[11px] font-medium">
        <span className="text-[#008967]">Agent ID: 08034567890</span>
        <span className="text-foreground">Total: 300</span>
      </div>

      <h2 className="mb-6 shrink-0 text-center text-[19px] font-semibold text-foreground">
        Onboarding Information
      </h2>

      <form className="flex flex-1 shrink-0 flex-col gap-3">
        <Input
          placeholder="Driver's full name"
          className="h-13 shrink-0 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
          required
        />
        <Input
          type="tel"
          placeholder="Driver's phone number"
          className="h-13 shrink-0 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
          required
        />
        <Input
          placeholder="Company/Affiliation"
          className="h-13 shrink-0 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
          required
        />
        <Input
          placeholder="Number plate"
          className="h-13 shrink-0 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
          required
        />
        <Input
          placeholder="Vehicle make & Model"
          className="h-13 shrink-0 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
          required
        />
        <Input
          placeholder="Vehicle Colour"
          className="h-13 shrink-0 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
          required
        />
        <Input
          placeholder="Device ID"
          className="h-13 shrink-0 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
          required
        />

        <div className="mt-6 flex-1"></div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="lg"
          className="mt-auto w-full shrink-0 rounded-full text-base font-medium shadow-none transition-transform active:scale-98"
        >
          {isSubmitting ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            "Assign Kaggo Device"
          )}
        </Button>
      </form>
    </div>
  )
}
