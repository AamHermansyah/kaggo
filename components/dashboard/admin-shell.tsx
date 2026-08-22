import { Suspense, type ReactNode } from "react"

import { DataBoundary } from "@/components/shared/data-boundary"
import type { RangeFilter } from "@/lib/api/types"
import { AdminToolbar } from "./admin-toolbar"
import { ListSkeleton } from "./list-chrome"
import { OverviewBar, OverviewBarSkeleton, type AdminSection } from "./overview-bar"

/**
 * Chrome shared by every admin list page: search, range switch and the four
 * section tiles.
 *
 * It lives here rather than in `app/dashboard/layout.tsx` because a Next.js
 * layout cannot read `searchParams` — and both the range switch and the tiles
 * are driven by them.
 *
 * The totals sit in their own boundary, so a failing `/overview` leaves the
 * list below it fully usable.
 */
export function AdminShell({
  token,
  range,
  query,
  active,
  searchPlaceholder,
  listTitle,
  children,
}: {
  token: string
  range: RangeFilter
  query: string
  active: AdminSection
  searchPlaceholder?: string
  /** Heading used by the list's own error boundary. */
  listTitle: string
  children: ReactNode
}) {
  return (
    <>
      <AdminToolbar
        range={range}
        query={query}
        searchPlaceholder={searchPlaceholder}
      />

      <DataBoundary
        title="Could not load the totals"
        description="The overview endpoint did not respond. The list below still works."
      >
        <Suspense fallback={<OverviewBarSkeleton />}>
          <OverviewBar token={token} range={range} active={active} />
        </Suspense>
      </DataBoundary>

      <div className="flex-1">
        <DataBoundary title={listTitle}>
          <Suspense fallback={<ListSkeleton />}>{children}</Suspense>
        </DataBoundary>
      </div>
    </>
  )
}
