import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Onboarding() {
  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-10 pb-6">
      <h2 className="mb-8 text-[20px] font-medium text-foreground">
        New Onboarding Agent
      </h2>

      <Input
        type="tel"
        placeholder="Enter your phone number"
        className="h-13 shrink-0 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
      />

      <div className="flex-1"></div>

      <Button
        render={<Link href="/onboarding/info" />}
        nativeButton={false}
        size="lg"
        className="mt-auto w-full rounded-full text-base font-medium shadow-none transition-transform active:scale-98"
      >
        Continue
      </Button>
    </div>
  )
}
