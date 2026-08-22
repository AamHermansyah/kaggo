import type { Metadata } from "next"

import { requireCompanyToken } from "@/lib/auth/session"
import { CreateBatchForm } from "./create-batch-form"

export const metadata: Metadata = {
  title: "Create batch",
  robots: { index: false, follow: false },
}

export default async function CreateBatchPage() {
  await requireCompanyToken()

  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6">
      <h1 className="mb-6 shrink-0 text-[20px] font-bold tracking-tight text-foreground">
        Route
      </h1>
      <CreateBatchForm />
    </div>
  )
}
