import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"

import { DataBoundary } from "@/components/shared/data-boundary"
import { Button } from "@/components/ui/button"
import { requireCompanyToken } from "@/lib/auth/session"
import { ROUTES } from "@/lib/routes"
import { BatchesPanel, BatchesSkeleton } from "./batches-panel"

export const metadata: Metadata = {
  title: "Batch manager",
  description: "Group packages into journeys and assign drivers.",
  robots: { index: false, follow: false },
}

export default async function BatchManagerPage() {
  const token = await requireCompanyToken()

  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6">
      <h1 className="mb-6 shrink-0 text-[20px] font-bold tracking-tight text-foreground">
        Active Batches
      </h1>

      <DataBoundary
        title="Could not load your batches"
        description="The company service did not respond in time."
      >
        <Suspense fallback={<BatchesSkeleton />}>
          <BatchesPanel token={token} />
        </Suspense>
      </DataBoundary>

      <div className="flex-1" />

      <Button
        render={<Link href={ROUTES.companyBatchCreate} />}
        nativeButton={false}
        size="lg"
        className="mt-auto h-13 w-full shrink-0 rounded-full text-[15px] font-semibold"
      >
        Create New Batch
      </Button>
    </div>
  )
}
