import Link from "next/link"

import { SectionError } from "@/components/shared/section-error"
import { Skeleton } from "@/components/ui/skeleton"
import { getOverview } from "@/lib/api/admin"
import { loadAdmin } from "@/lib/api/guards"
import type { RangeFilter } from "@/lib/api/types"
import { formatCompact, formatCurrency } from "@/lib/format"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

export type AdminSection = "shipments" | "users" | "vehicles" | "revenue"

/**
 * The four dashboard tiles.
 *
 * The mock-up's fourth tile was "Companies", but the admin API has no company
 * resource — there is no endpoint behind approve/reject/suspend. It is replaced
 * with Revenue, which `GET /revenue` and `GET /revenue/transactions` do back.
 */
export async function OverviewBar({
  token,
  range,
  active,
}: {
  token: string
  range: RangeFilter
  active: AdminSection
}) {
  const result = await loadAdmin(() => getOverview(token, range))

  if (!result.ok) {
    return (
      <div className="mb-10">
        <SectionError title="Could not load the totals" result={result} />
      </div>
    )
  }

  const overview = result.data
  const tiles: Array<{ key: AdminSection; href: string; label: string; value: string }> = [
    {
      key: "shipments",
      href: ROUTES.adminShipments,
      label: "Shipments",
      value: formatCompact(overview.totalShipments),
    },
    {
      key: "users",
      href: ROUTES.adminUsers,
      label: "Users",
      value: formatCompact(overview.totalUsers),
    },
    {
      key: "vehicles",
      href: ROUTES.adminVehicles,
      label: "Vehicles",
      value: formatCompact(overview.totalVehicles),
    },
    {
      key: "revenue",
      href: ROUTES.adminRevenue,
      label: "Revenue",
      value: formatCurrency(overview.totalRevenue),
    },
  ]

  return (
    <nav
      aria-label="Dashboard sections"
      className="mb-10 flex items-center justify-between gap-2 rounded-xl border border-primary/10 bg-secondary p-5"
    >
      {tiles.map((tile) => (
        <Link
          key={tile.key}
          href={range === "all" ? tile.href : `${tile.href}?range=${range}`}
          aria-current={active === tile.key ? "page" : undefined}
          className={cn(
            "flex min-w-0 flex-col items-center gap-1 transition-opacity",
            active !== tile.key && "opacity-50 hover:opacity-80"
          )}
        >
          <span className="truncate text-[17px] font-bold text-foreground">
            {tile.value}
          </span>
          <span className="text-[12px] font-medium text-foreground/80">
            {tile.label}
          </span>
        </Link>
      ))}
    </nav>
  )
}

export function OverviewBarSkeleton() {
  return (
    <div className="mb-10 flex items-center justify-between gap-2 rounded-xl border border-primary/10 bg-secondary p-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex flex-col items-center gap-1.5">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-3 w-14" />
        </div>
      ))}
    </div>
  )
}
