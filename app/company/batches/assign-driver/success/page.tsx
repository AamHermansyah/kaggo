import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DriverAssignedSuccessPage() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-between overflow-x-hidden overflow-y-auto px-5 pt-12 pb-6">
      <div className="my-auto flex max-w-80 flex-1 flex-col items-center justify-center text-center">
        {/* Success Icon */}
        <div className="mb-6 flex size-19 items-center justify-center rounded-full bg-[#008967] shadow-md">
          <Check className="size-10 stroke-[2.5] text-white" />
        </div>

        {/* Title */}
        <h2 className="mb-3 text-center text-[24px] font-bold tracking-tight text-foreground">
          Driver Assigned Successfully
        </h2>

        {/* Description */}
        <p className="text-center text-[14px] leading-relaxed font-normal text-foreground/75">
          127 packages have been assigned to this journey.
        </p>
      </div>

      {/* Close CTA Button */}
      <Button
        render={<Link href="/company/batches" />}
        nativeButton={false}
        size="lg"
        className="mt-auto h-13 w-full shrink-0 rounded-full bg-[#008967] text-[15px] font-semibold text-white shadow-none transition-transform hover:bg-[#007558] active:scale-98"
      >
        Close
      </Button>
    </div>
  )
}
