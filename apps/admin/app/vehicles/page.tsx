import type { Metadata } from "next"

import { AdminShell } from "@/components/dashboard/admin-shell"
import { VehicleList } from "@/components/dashboard/vehicle-list"
import { requireAdminToken } from "@/lib/auth/session"
import { parseAdminParams } from "@/lib/dashboard/params"

export const metadata: Metadata = {
  title: "Vehicles",
  description: "Onboarded vehicles and the state of their GPS trackers.",
}

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function VehiclesPage({ searchParams }: Props) {

  const token = await requireAdminToken()
  const params = parseAdminParams(await searchParams)

  return (
    <AdminShell
      token={token}
      range={params.range}
      query={params.query}
      active="vehicles"
      listTitle="Could not load vehicles"
    >
      <VehicleList token={token} params={params} />
    </AdminShell>
  )
}
