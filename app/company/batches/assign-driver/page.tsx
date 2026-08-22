import type { Metadata } from "next"

import { requireCompanyToken } from "@/lib/auth/session"
import { AssignDriverForm } from "./assign-driver-form"

export const metadata: Metadata = {
  title: "Assign driver",
  robots: { index: false, follow: false },
}

export default async function AssignDriverPage({
  searchParams,
}: PageProps<"/company/batches/assign-driver">) {
  await requireCompanyToken()

  const params = await searchParams
  const raw = Array.isArray(params.batch) ? params.batch[0] : params.batch
  const batchId = typeof raw === "string" ? raw.slice(0, 120) : ""

  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6">
      <AssignDriverForm batchId={batchId} />
    </div>
  )
}
