import { PackagePlus } from "lucide-react"

import { SectionError } from "@/components/shared/section-error"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { listBatchRequests } from "@/lib/api/mobile"
import { safeLoad } from "@/lib/api/safe-load"
import type { BatchRequestStatus } from "@/lib/api/types"
import { formatDateTime } from "@/lib/format"

const STATUS: Record<
  BatchRequestStatus,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  WAITING_FOR_MATCH: { label: "Finding a batch", variant: "secondary" },
  MATCHED: { label: "On a batch", variant: "secondary" },
  ASSIGNED: { label: "Driver assigned", variant: "default" },
  TRACKING: { label: "In transit", variant: "default" },
  ARRIVED: { label: "Arrived", variant: "default" },
  RECEIVED: { label: "Delivered", variant: "secondary" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
}

/**
 * Packages dropped off with a logistics company.
 *
 * These are not shipments yet — a batch request only becomes one once the
 * company assigns a driver, so they live in their own list rather than being
 * mixed into the tracking cards.
 *
 * Renders nothing when the rider has never used the batch flow, which is the
 * common case; an empty heading would just be noise.
 */
export async function BatchRequestsPanel({ riderId }: { riderId: string }) {
  const result = await safeLoad(() => listBatchRequests(riderId))

  if (!result.ok) {
    return (
      <SectionError title="Could not load your batch drop-offs" result={result} />
    )
  }

  const requests = result.data
  if (requests.length === 0) return null

  return (
    <section className="mb-8 flex shrink-0 flex-col gap-3">
      <h2 className="flex items-center gap-2 text-[17px] font-semibold text-foreground">
        <PackagePlus className="size-4.5 shrink-0 text-primary" />
        Batch drop-offs
      </h2>

      <ul className="flex flex-col gap-3">
        {requests.map((request) => (
          <li
            key={request.requestId}
            className="flex items-center justify-between gap-3 rounded-[16px] bg-secondary px-4 py-3.5"
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-[15px] font-medium text-foreground">
                {request.itemName}
              </span>
              <span className="text-[12px] text-foreground/60">
                {formatDateTime(request.createdAt)}
              </span>
            </div>
            <Badge variant={STATUS[request.status]?.variant ?? "secondary"}>
              {STATUS[request.status]?.label ?? request.status}
            </Badge>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function BatchRequestsSkeleton() {
  return (
    <div className="mb-8 flex flex-col gap-3">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-16 w-full rounded-[16px]" />
    </div>
  )
}
