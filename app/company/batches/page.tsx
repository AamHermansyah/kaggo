import Link from "next/link"
import { CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BatchManagerPage() {
  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6">
      {/* Title */}
      <h2 className="mb-6 shrink-0 text-[20px] font-bold tracking-tight text-foreground">
        Active Batches
      </h2>

      {/* Batch List */}
      <div className="mb-8 flex shrink-0 flex-col gap-6">
        {/* Batch 2 - Unassigned Driver */}
        <div className="flex items-start justify-between border-b border-border/40 pb-6">
          <div className="flex flex-col gap-3">
            {/* Route Points */}
            <div className="flex items-center gap-3">
              <div className="flex shrink-0 flex-col items-center">
                <div className="size-2.5 rounded-full bg-[#008967]" />
                <div className="my-0.5 h-3.5 w-px bg-border" />
                <div className="size-2.5 rounded-full bg-destructive" />
              </div>
              <div className="flex flex-col gap-1 text-[15px] font-medium text-foreground">
                <span>Lagos</span>
                <span>Abuja</span>
              </div>
            </div>

            {/* Assign Driver Action Link */}
            <Link
              href="/company/batches/assign-driver"
              className="mt-1 flex items-center gap-1.5 text-[13.5px] font-medium text-[#008967] transition-opacity hover:underline active:opacity-70"
            >
              <CheckCircle2 className="size-4 stroke-2" />
              <span>Assign Driver</span>
            </Link>
          </div>

          {/* Batch Info Right */}
          <Link
            href="/company/batches/2/packages"
            className="flex flex-col items-end gap-1 transition-opacity hover:opacity-80"
          >
            <span className="text-[15px] font-bold text-foreground">
              Batch 2
            </span>
            <span className="text-[14px] font-semibold text-[#008967]">
              127 Packages
            </span>
          </Link>
        </div>

        {/* Batch 1 - Driver Assigned & In Transit */}
        <div className="flex items-start justify-between border-b border-border/40 pb-6">
          <div className="flex flex-col gap-3">
            {/* Route Points */}
            <div className="flex items-center gap-3">
              <div className="flex shrink-0 flex-col items-center">
                <div className="size-2.5 rounded-full bg-[#008967]" />
                <div className="my-0.5 h-3.5 w-px bg-border" />
                <div className="size-2.5 rounded-full bg-destructive" />
              </div>
              <div className="flex flex-col gap-1 text-[15px] font-medium text-foreground">
                <span>Lagos</span>
                <span>Abuja</span>
              </div>
            </div>

            {/* Route ETA Info */}
            <div className="mt-1 flex items-center gap-1.5 text-[13px] font-normal text-foreground/75">
              <Clock className="size-4 stroke-2 text-foreground/60" />
              <span>Lagos 9:00 A.M (ETA 10h 30m)</span>
            </div>
          </div>

          {/* Batch Info Right */}
          <Link
            href="/company/batches/1/packages"
            className="flex flex-col items-end gap-1 transition-opacity hover:opacity-80"
          >
            <span className="text-[15px] font-bold text-foreground">
              Batch 1
            </span>
            <span className="text-[14px] font-semibold text-[#008967]">
              340 Packages
            </span>
          </Link>
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Create New Batch CTA */}
      <Button
        render={<Link href="/company/batches/create" />}
        nativeButton={false}
        size="lg"
        className="mt-auto h-13 w-full shrink-0 rounded-full bg-[#008967] text-[15px] font-semibold text-white shadow-none transition-transform hover:bg-[#007558] active:scale-98"
      >
        Create New Batch
      </Button>
    </div>
  )
}
