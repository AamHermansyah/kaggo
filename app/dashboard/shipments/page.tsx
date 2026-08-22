import type { Metadata } from "next"

import { AdminShell } from "@/components/dashboard/admin-shell"
import { ShipmentList } from "@/components/dashboard/shipment-list"
import { requireAdminToken } from "@/lib/auth/session"
import { parseAdminParams } from "@/lib/dashboard/params"

export const metadata: Metadata = {
  title: "Shipments",
  description: "Every parcel listed on Kaggo, including soft-deleted records.",
}

export default async function ShipmentsPage({
  searchParams,
}: PageProps<"/dashboard/shipments">) {
  const token = await requireAdminToken()
  const params = parseAdminParams(await searchParams)

  return (
    <AdminShell
      token={token}
      range={params.range}
      query={params.query}
      active="shipments"
      listTitle="Could not load shipments"
    >
      <ShipmentList token={token} params={params} />
    </AdminShell>
  )
}
