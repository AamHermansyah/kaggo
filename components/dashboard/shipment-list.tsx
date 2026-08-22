import { CheckCircle2, Clock } from "lucide-react"

export function ShipmentList() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <h2 className="text-[22px] font-semibold text-foreground">Shipments</h2>
        <p className="mt-1 text-[15px] text-foreground/80">23,289,000,000</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Item 1 */}
        <div className="flex flex-col border-b border-border/40 pb-6">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1.5 flex shrink-0 flex-col items-center">
                <div className="size-2 rounded-full bg-[#008967]" />
                <div className="my-1 h-4 w-px bg-border" />
                <div className="size-2 rounded-full bg-destructive" />
              </div>
              <div className="flex flex-col gap-3 text-[15px] font-medium text-foreground">
                <span>08034567890</span>
                <span>08030987654</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3 text-[14px]">
              <span className="text-foreground/80">Lagos - Abuja</span>
              <span className="font-medium text-[#008967]">ABC 456 VX</span>
            </div>
          </div>
          <div className="mb-2 flex items-center gap-3 text-[14px]">
            <CheckCircle2 className="size-4.5 stroke-2 text-foreground/80" />
            <span className="text-foreground/90">
              Arrived Gwagwalada, Abuja
            </span>
          </div>
          <div className="flex items-center gap-3 text-[14px]">
            <Clock className="size-4.5 stroke-2 text-foreground/80" />
            <span className="text-foreground/90">Today, 6:45 P.M</span>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex flex-col border-b border-border/40 pb-6">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1.5 flex shrink-0 flex-col items-center">
                <div className="size-2 rounded-full bg-[#008967]" />
                <div className="my-1 h-4 w-px bg-border" />
                <div className="size-2 rounded-full bg-destructive" />
              </div>
              <div className="flex flex-col gap-3 text-[15px] font-medium text-foreground">
                <span>08034567890</span>
                <span>08030987654</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3 text-[14px]">
              <span className="text-foreground/80">Lagos - Abuja</span>
              <span className="font-medium text-[#008967]">ABC 456 VX</span>
            </div>
          </div>
          <div className="mb-2 flex items-center gap-3 text-[14px]">
            <CheckCircle2 className="size-4.5 stroke-2 text-foreground/80" />
            <span className="text-foreground/90">
              Arrived Gwagwalada, Abuja
            </span>
          </div>
          <div className="flex items-center gap-3 text-[14px]">
            <Clock className="size-4.5 stroke-2 text-foreground/80" />
            <span className="text-foreground/90">Today, 6:45 P.M</span>
          </div>
        </div>

        {/* Item 3 */}
        <div className="flex flex-col pb-2">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1.5 flex shrink-0 flex-col items-center">
                <div className="size-2 rounded-full bg-[#008967]" />
                <div className="my-1 h-4 w-px bg-border" />
                <div className="size-2 rounded-full bg-destructive" />
              </div>
              <div className="flex flex-col gap-3 text-[15px] font-medium text-foreground">
                <span>08034567890</span>
                <span>08030987654</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3 text-[14px]">
              <span className="text-foreground/80">Lagos - Abuja</span>
              <span className="font-medium text-[#008967]">ABC 456 VX</span>
            </div>
          </div>
          <div className="mb-2 flex items-center gap-3 text-[14px]">
            <CheckCircle2 className="size-4.5 stroke-2 text-foreground/80" />
            <span className="text-foreground/90">
              Arrived Gwagwalada, Abuja
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
