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
    <div className="flex flex-col flex-1 px-5 pt-6 pb-6 relative items-center overflow-hidden">
      
      <div className="flex flex-col items-center justify-center flex-1 w-full">
        <div className="w-[72px] h-[72px] rounded-full bg-[#008967] flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-white stroke-[2.5]" />
        </div>
        
        <h2 className="text-[26px] font-semibold text-foreground text-center mb-3 leading-snug">
          Vehicle Onboarding<br/>successful!
        </h2>
        
        <p className="text-muted-foreground text-[15px] text-center max-w-[280px]">
          This vehicle is now available on<br/>Kaggo
        </p>
      </div>

      <div className="w-full shrink-0 mt-auto">
        <Button onClick={handleClose} size="lg" className="w-full rounded-full text-base font-medium active:scale-[0.98] transition-transform shadow-none">
          Close
        </Button>
      </div>
    </div>
  )
}
