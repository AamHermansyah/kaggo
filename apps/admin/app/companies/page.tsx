import type { Metadata } from "next"

import { AdminShell } from "@/components/dashboard/admin-shell"
import { isSuperAdmin, requireAdminToken } from "@/lib/auth/session"
import { parseAdminParams } from "@/lib/dashboard/params"
import { CompanyList } from "./company-list"

export const metadata: Metadata = {
  title: "Companies",
  description:
    "Approve, reject, suspend or reactivate logistics companies on MyKaggo.",
}

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CompaniesPage({ searchParams }: Props) {

  const token = await requireAdminToken()
  const canManage = await isSuperAdmin()
  const params = parseAdminParams(await searchParams)

  return (
    <AdminShell
      token={token}
      range={params.range}
      query={params.query}
      active="companies"
      listTitle="Could not load companies"
    >
      <CompanyList token={token} params={params} canManage={canManage} />
    </AdminShell>
  )
}
