"use client"

import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OnboardingSuccess() {
  const router = useRouter()

  const handleClose = () => {
    localStorage.setItem("kaggo_onboarded", "true")
    router.push("/")
  }

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden px-5 pt-6 pb-6">
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <div className="mb-6 flex size-18 items-center justify-center rounded-full bg-[#008967]">
          <Check className="size-10 stroke-[2.5] text-white" />
        </div>

        <h2 className="mb-3 text-center text-[26px] leading-snug font-semibold text-foreground">
          Vehicle Onboarding
          <br />
          successful!
        </h2>

        <p className="max-w-70 text-center text-[15px] text-muted-foreground">
          This vehicle is now available on
          <br />
          Kaggo
        </p>
      </div>

      <div className="mt-auto w-full shrink-0">
        <Button
          onClick={handleClose}
          size="lg"
          className="w-full rounded-full text-base font-medium shadow-none transition-transform active:scale-98"
        >
          Close
        </Button>
      </div>
    </div>
  )
}
