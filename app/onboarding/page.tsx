import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Onboarding() {
  return (
    <div className="flex flex-col flex-1 px-5 pt-10 pb-6 relative overflow-x-hidden overflow-y-auto">
      <h2 className="text-[20px] font-medium mb-8 text-foreground">
        New Onboarding Agent
      </h2>
      
      <Input 
        type="tel"
        placeholder="Enter your phone number" 
        className="h-[52px] rounded-xl text-[15px] px-4 border-border/60 shadow-none shrink-0"
      />
      
      <div className="flex-1"></div>
      
      <Button render={<Link href="/onboarding/info" />} nativeButton={false} size="lg" className="w-full rounded-full text-base font-medium active:scale-[0.98] transition-transform shadow-none mt-auto">
        Continue
      </Button>
    </div>
  )
}
