import { SectionError } from "@/components/shared/section-error"
import { Skeleton } from "@/components/ui/skeleton"
import { getCompanyOverview } from "@/lib/api/company"
import { loadCompany } from "@/lib/api/guards"
import { formatNumber } from "@/lib/format"

/**
 * Company summary tiles.
 *
 * `GET /company/dashboard` has no published schema, so field names are read
 * defensively and anything missing renders as a dash rather than `undefined`.
 * The route also currently never responds — the client's 8-second timeout turns
 * that into the retryable error card below instead of a hung page.
 */
function pick(
  source: Record<string, unknown>,
  ...keys: string[]
): number | null {
  for (const key of keys) {
    const value = source[key]
    if (typeof value === "number" && Number.isFinite(value)) return value
  }
  return null
}

function text(source: Record<string, unknown>, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = source[key]
    if (typeof value === "string" && value.trim()) return value
  }
  return null
}

export async function CompanyOverviewPanel({ token }: { token: string }) {
  const result = await loadCompany(() => getCompanyOverview(token))

  if (!result.ok) {
    return (
      <SectionError title="Could not load your company summary" result={result} />
    )
  }

  const data = result.data
  const name = text(data, "companyName", "name") ?? "Your company"
  const code = text(data, "companyCode", "code")

  const tiles = [
    { label: "Packages", value: pick(data, "totalPackages", "packages") },
    { label: "Batches", value: pick(data, "totalBatches", "batches") },
    { label: "Journeys", value: pick(data, "totalJourneys", "journeys") },
    { label: "Completed", value: pick(data, "totalCompleted", "completed") },
  ]

  return (
    <>
      <div className="mb-6 flex shrink-0 flex-col">
        <h1 className="text-[20px] font-bold tracking-tight text-foreground">
          {name}
        </h1>
        {code ? (
          <p className="mt-1 text-[14px] font-medium text-foreground/70">
            Company Code:{" "}
            <span className="font-semibold text-primary">{code}</span>
          </p>
        ) : null}
      </div>

      <div className="mb-8 grid shrink-0 grid-cols-4 rounded-2xl border border-primary/15 bg-secondary p-5 text-center">
        {tiles.map((tile, index) => (
          <div
            key={tile.label}
            className={
              index === 0
                ? "flex flex-col items-center gap-1"
                : "flex flex-col items-center gap-1 border-l border-border/30"
            }
          >
            <span className="text-[18px] font-bold text-foreground">
              {formatNumber(tile.value)}
            </span>
            <span className="text-[12px] font-medium text-foreground/75">
              {tile.label}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

export function CompanyOverviewSkeleton() {
  return (
    <>
      <div className="mb-6 flex flex-col gap-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="mb-8 h-24 w-full rounded-2xl" />
    </>
  )
}
