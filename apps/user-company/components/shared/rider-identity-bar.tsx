import { cn } from "@/lib/utils"

export interface RiderIdentityBarProps {
  phoneNumber: string
  /** Parcels the rider is sending. Hidden when not supplied. */
  sentCount?: number
  /** Parcels the rider is receiving. */
  receivedCount?: number
  className?: string
}

/**
 * The "ID: 0803… · 56 · 34" strip that tops the rider screens.
 *
 * The two counters are the rider's own shipments split by role — the same
 * sent/received breakdown the admin user list shows.
 */
export function RiderIdentityBar({
  phoneNumber,
  sentCount,
  receivedCount,
  className,
}: RiderIdentityBarProps) {
  const showCounts =
    typeof sentCount === "number" || typeof receivedCount === "number"

  return (
    <div
      className={cn(
        "flex w-full shrink-0 items-center justify-between text-xs font-medium",
        className
      )}
    >
      <span className="text-[13px] font-semibold text-primary">
        ID: {phoneNumber}
      </span>

      {showCounts ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-primary" />
            <span className="text-[13px] text-foreground">
              {sentCount ?? 0}
            </span>
            <span className="sr-only">parcels you are sending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-destructive" />
            <span className="text-[13px] text-foreground">
              {receivedCount ?? 0}
            </span>
            <span className="sr-only">parcels you are receiving</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
