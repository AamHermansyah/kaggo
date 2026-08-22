import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DriverAssignedSuccessPage() {
  return (
    <div className="flex flex-col flex-1 px-5 pt-12 pb-6 relative items-center justify-between overflow-x-hidden overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-80 my-auto">
        {/* Success Icon */}
        <div className="size-19 rounded-full bg-[#008967] flex items-center justify-center mb-6 shadow-md">
          <Check className="size-10 text-white stroke-[2.5]" />
        </div>

        {/* Title */}
        <h2 className="text-[24px] font-bold text-foreground text-center mb-3 tracking-tight">
          Driver Assigned Successfully
        </h2>

        {/* Description */}
        <p className="text-foreground/75 text-[14px] text-center leading-relaxed font-normal">
          127 packages have been assigned to this journey.
        </p>
      </div>

      {/* Close CTA Button */}
      <Button
        render={<Link href="/company/batches" />}
        nativeButton={false}
        size="lg"
        className="w-full rounded-full h-13 text-[15px] font-semibold bg-[#008967] hover:bg-[#007558] text-white active:scale-98 transition-transform shadow-none mt-auto shrink-0"
      >
        Close
      </Button>
    </div>
  )
}
