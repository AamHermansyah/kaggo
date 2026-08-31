import Link from "next/link"
import { Inbox, CheckCircle2, Clock } from "lucide-react"


import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { SectionError } from "@/components/shared/section-error"
import { Skeleton } from "@/components/ui/skeleton"
import { listCompanyBatches } from "@/lib/api/company"
import type { CompanyBatch } from "@/lib/api/types"
import { loadCompany } from "@/lib/api/guards"
import { formatDuration, formatNumber } from "@/lib/format"
import { ROUTES } from "@/lib/routes"

/**
 * Active batches.
 *
 * `GET /company/batches` has no published schema and currently never responds,
 * so every field is read defensively and the 8-second client timeout turns the
 * hang into a retryable error card.
 */
function batchId(batch: CompanyBatch, index: number): string {
  return String(batch.id ?? batch.batchNumber ?? index)
}

function route(batch: CompanyBatch): { from: string; to: string } {
  return {
    from: String(batch.from ?? batch.departure ?? "—"),
    to: String(batch.to ?? batch.destination ?? "—"),
  }
}

export async function BatchesPanel({ token }: { token: string }) {
  const result = await loadCompany(() => listCompanyBatches(token))

  if (!result.ok) {
    return <SectionError title="Could not load your batches" result={result} />
  }

  if (result.data.length === 0) {
    return (
      <Empty className="border border-dashed border-border/70">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox />
          </EmptyMedia>
          <EmptyTitle>No active batches</EmptyTitle>
          <EmptyDescription>
            Create a batch to group packages onto a single journey.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }


  return (
    <div className="mb-8 flex shrink-0 flex-col gap-6">
      {result.data.map((batch, index) => {
        const id = batchId(batch, index)
        const { from, to } = route(batch)
        const assigned = batch.driverAssigned === true

        return (
          <div
            key={id}
            className="flex items-start justify-between gap-4 border-b border-border/40 pb-6 last:border-b-0"
          >
            <div className="flex min-w-0 flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex shrink-0 flex-col items-center">
                  <span className="size-2.5 rounded-full bg-primary" />
                  <span className="my-0.5 h-3.5 w-px bg-border" />
                  <span className="size-2.5 rounded-full bg-destructive" />
                </div>
                <div className="flex min-w-0 flex-col gap-1 text-[15px] font-medium text-foreground">
                  <span className="truncate">{from}</span>
                  <span className="truncate">{to}</span>
                </div>
              </div>

              {assigned ? (
                <div className="mt-1 flex items-center gap-1.5 text-[13px] font-normal text-foreground/75">
                  <Clock className="size-4 shrink-0 stroke-2 text-foreground/60" />
                  <span>
                    {batch.departureTime ?? "Departure pending"}
                    {typeof batch.etaSeconds === "number"
                      ? ` (ETA ${formatDuration(batch.etaSeconds)})`
                      : ""}
                  </span>
                </div>
              ) : (
                <Link
                  href={`${ROUTES.companyAssignDriver}?batch=${encodeURIComponent(id)}`}
                  className="mt-1 flex items-center gap-1.5 text-[13.5px] font-medium text-primary transition-opacity hover:underline active:opacity-70"
                >
                  <CheckCircle2 className="size-4 shrink-0 stroke-2" />
                  <span>Assign Driver</span>
                </Link>
              )}
            </div>

            <Link
              href={`/company/batches/${encodeURIComponent(id)}/packages`}
              className="flex shrink-0 flex-col items-end gap-1 transition-opacity hover:opacity-80"
            >
              <span className="text-[15px] font-bold text-foreground">
                Batch {String(batch.batchNumber ?? id)}
              </span>
              <span className="text-[14px] font-semibold text-primary">
                {formatNumber(batch.packageCount)} Packages
              </span>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export function BatchesSkeleton() {
  return (
    <div className="mb-8 flex flex-col gap-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}
