import Link from "next/link"
import { CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BatchManagerPage() {
  return (
    <div className="flex flex-col flex-1 px-5 pt-6 pb-6 relative overflow-x-hidden overflow-y-auto">
      {/* Title */}
      <h2 className="text-[20px] font-bold text-foreground tracking-tight mb-6 shrink-0">
        Active Batches
      </h2>

      {/* Batch List */}
      <div className="flex flex-col gap-6 shrink-0 mb-8">
        {/* Batch 2 - Unassigned Driver */}
        <div className="flex justify-between items-start border-b border-border/40 pb-6">
          <div className="flex flex-col gap-3">
            {/* Route Points */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center shrink-0">
                <div className="size-2.5 rounded-full bg-[#008967]" />
                <div className="w-px h-3.5 bg-border my-0.5" />
                <div className="size-2.5 rounded-full bg-destructive" />
              </div>
              <div className="flex flex-col text-[15px] font-medium text-foreground gap-1">
                <span>Lagos</span>
                <span>Abuja</span>
              </div>
            </div>

            {/* Assign Driver Action Link */}
            <Link
              href="/company/batches/assign-driver"
              className="flex items-center gap-1.5 text-[#008967] text-[13.5px] font-medium hover:underline active:opacity-70 transition-opacity mt-1"
            >
              <CheckCircle2 className="size-4 stroke-2" />
              <span>Assign Driver</span>
            </Link>
          </div>

          {/* Batch Info Right */}
          <Link href="/company/batches/2/packages" className="flex flex-col items-end gap-1 hover:opacity-80 transition-opacity">
            <span className="text-[15px] font-bold text-foreground">Batch 2</span>
            <span className="text-[14px] text-[#008967] font-semibold">127 Packages</span>
          </Link>
        </div>

        {/* Batch 1 - Driver Assigned & In Transit */}
        <div className="flex justify-between items-start border-b border-border/40 pb-6">
          <div className="flex flex-col gap-3">
            {/* Route Points */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center shrink-0">
                <div className="size-2.5 rounded-full bg-[#008967]" />
                <div className="w-px h-3.5 bg-border my-0.5" />
                <div className="size-2.5 rounded-full bg-destructive" />
              </div>
              <div className="flex flex-col text-[15px] font-medium text-foreground gap-1">
                <span>Lagos</span>
                <span>Abuja</span>
              </div>
            </div>

            {/* Route ETA Info */}
            <div className="flex items-center gap-1.5 text-foreground/75 text-[13px] font-normal mt-1">
              <Clock className="size-4 text-foreground/60 stroke-2" />
              <span>Lagos 9:00 A.M (ETA 10h 30m)</span>
            </div>
          </div>

          {/* Batch Info Right */}
          <Link href="/company/batches/1/packages" className="flex flex-col items-end gap-1 hover:opacity-80 transition-opacity">
            <span className="text-[15px] font-bold text-foreground">Batch 1</span>
            <span className="text-[14px] text-[#008967] font-semibold">340 Packages</span>
          </Link>
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Create New Batch CTA */}
      <Button
        render={<Link href="/company/batches/create" />}
        nativeButton={false}
        size="lg"
        className="w-full rounded-full h-13 text-[15px] font-semibold bg-[#008967] hover:bg-[#007558] text-white active:scale-98 transition-transform shadow-none mt-auto shrink-0"
      >
        Create New Batch
      </Button>
    </div>
  )
}
