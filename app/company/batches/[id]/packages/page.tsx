import type { Metadata } from "next"

import { BackendPending } from "@/components/company/backend-pending"
import { requireCompanyToken } from "@/lib/auth/session"
import { ROUTES } from "@/lib/routes"

export const metadata: Metadata = {
  title: "Package list",
  robots: { index: false, follow: false },
}

export default async function PackageListPage({
  params,
}: PageProps<"/company/batches/[id]/packages">) {
  await requireCompanyToken()
  const { id } = await params

  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6">
      <h1 className="mb-6 shrink-0 text-[22px] font-bold tracking-tight text-foreground">
        Batch {decodeURIComponent(id)}
      </h1>

      <BackendPending
        title="Package list is not available yet"
        description="The company service does not expose a per-batch package endpoint yet. Once the backend adds it, this page will list every parcel in the batch with its customer and status."
        backHref={ROUTES.companyBatches}
        backLabel="Back to batches"
      />
    </div>
  )
}
