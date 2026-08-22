import { SectionError } from "@/components/shared/section-error"
import { listUsers } from "@/lib/api/admin"
import { loadAdmin } from "@/lib/api/guards"
import type { AdminListParams } from "@/lib/dashboard/params"
import { matchesQuery } from "@/lib/dashboard/params"
import { formatDateTime, formatNumber } from "@/lib/format"
import { formatPhone } from "@/lib/validation/phone"
import { ROUTES } from "@/lib/routes"
import { CursorPager, ListEmpty, ListHeader } from "./list-chrome"

/** Riders, with their sent/received split — the two dots in the design. */
export async function UserList({
  token,
  params,
}: {
  token: string
  params: AdminListParams
}) {
  const result = await loadAdmin(() =>
    listUsers(token, { cursor: params.cursor })
  )

  if (!result.ok) {
    return <SectionError title="Could not load users" result={result} />
  }

  const users = result.data.items.filter((user) =>
    matchesQuery(params.query, user.phoneNumber)
  )

  return (
    <div className="flex flex-col gap-6">
      <ListHeader
        title="Users"
        subtitle={`${formatNumber(users.length)} on this page`}
      />

      {users.length === 0 ? (
        <ListEmpty
          title="No users match"
          description="Try a different phone number, or clear the search to see everyone on this page."
        />
      ) : (
        <div className="flex flex-col gap-5">
          {users.map((user) => (
            <div
              key={user.userId}
              className="flex items-center justify-between gap-4 pb-2"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span aria-hidden className="size-1.5 rounded-full bg-primary" />
                  <span className="text-[14px] font-medium text-foreground">
                    {formatNumber(user.totalSent)}
                  </span>
                  <span className="sr-only">parcels sent</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-destructive"
                  />
                  <span className="text-[14px] font-medium text-foreground">
                    {formatNumber(user.totalReceived)}
                  </span>
                  <span className="sr-only">parcels received</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-[15px] font-medium text-foreground">
                  {formatPhone(user.phoneNumber)}
                </span>
                <span className="text-[13px] text-foreground/60">
                  {formatDateTime(user.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <CursorPager
        basePath={ROUTES.adminUsers}
        pagination={result.data.pagination}
        params={params}
      />
    </div>
  )
}
