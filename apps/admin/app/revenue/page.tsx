import type { Metadata } from "next"

import { AdminShell } from "@/components/dashboard/admin-shell"
import { RevenueList } from "@/components/dashboard/revenue-list"
import { requireAdminToken } from "@/lib/auth/session"
import { parseAdminParams } from "@/lib/dashboard/params"

export const metadata: Metadata = {
  title: "Revenue",
  description: "Settled Paystack payments and total revenue by period.",
}

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function RevenuePage({ searchParams }: Props) {

  const token = await requireAdminToken()
  const params = parseAdminParams(await searchParams)

  return (
    <AdminShell
      token={token}
      range={params.range}
      query={params.query}
      active="revenue"
      listTitle="Could not load revenue"
    >
      <RevenueList token={token} params={params} />
    </AdminShell>
  )
}
