import type { Metadata } from "next"

import { AdminShell } from "@/components/dashboard/admin-shell"
import { UserList } from "@/components/dashboard/user-list"
import { requireAdminToken } from "@/lib/auth/session"
import { parseAdminParams } from "@/lib/dashboard/params"

export const metadata: Metadata = {
  title: "Users",
  description: "Riders identified on MyKaggo and their sent/received totals.",
}

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function UsersPage({ searchParams }: Props) {

  const token = await requireAdminToken()
  const params = parseAdminParams(await searchParams)

  return (
    <AdminShell
      token={token}
      range={params.range}
      query={params.query}
      active="users"
      listTitle="Could not load users"
    >
      <UserList token={token} params={params} />
    </AdminShell>
  )
}
