import { SectionError } from "@/components/shared/section-error"
import { getRevenue, listTransactions } from "@/lib/api/admin"
import type { AdminTransaction } from "@/lib/api/types"
import { loadAdmin } from "@/lib/api/guards"
import type { AdminListParams } from "@/lib/dashboard/params"
import { matchesQuery } from "@/lib/dashboard/params"
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/format"
import { ROUTES } from "@/lib/routes"
import { CursorPager, ListEmpty, ListHeader } from "./list-chrome"

/**
 * Revenue replaces the mock-up's "Companies" tab, which had no backend at all.
 * `GET /revenue` and `GET /revenue/transactions` are both documented endpoints.
 *
 * The revenue payload is not pinned down in the OpenAPI document (it only says
 * "200 OK"), so the total is read defensively from the field names the backend
 * plausibly uses and falls back to summing the transactions on this page.
 */
function readTotal(payload: Record<string, unknown>): number | null {
  for (const key of ["total", "totalRevenue", "amount", "revenue"]) {
    const value = payload[key]
    if (typeof value === "number" && Number.isFinite(value)) return value
  }
  return null
}

function readCurrency(payload: Record<string, unknown>): string {
  return typeof payload.currency === "string" ? payload.currency : "NGN"
}

function transactionAmount(transaction: AdminTransaction): number {
  return typeof transaction.amount === "number" ? transaction.amount : 0
}

function transactionKey(transaction: AdminTransaction, index: number): string {
  return (
    transaction.reference ??
    transaction.shipmentId ??
    `transaction-${index}`
  )
}

export async function RevenueList({
  token,
  params,
}: {
  token: string
  params: AdminListParams
}) {
  const [summary, page] = await Promise.all([
    loadAdmin(() => getRevenue(token, params.range)),
    loadAdmin(() => listTransactions(token, { cursor: params.cursor })),
  ])

  if (!page.ok) {
    return <SectionError title="Could not load revenue" result={page} />
  }

  const transactions = page.data.items.filter((transaction) =>
    matchesQuery(
      params.query,
      transaction.reference,
      transaction.shipmentId,
      transaction.currency
    )
  )

  const currency = summary.ok ? readCurrency(summary.data) : "NGN"
  const total = summary.ok
    ? (readTotal(summary.data) ??
      transactions.reduce((sum, item) => sum + transactionAmount(item), 0))
    : null

  return (
    <div className="flex flex-col gap-6">
      <ListHeader
        title="Revenue"
        subtitle={
          total === null
            ? `${formatNumber(transactions.length)} payments on this page`
            : `${formatCurrency(total, currency)} · ${formatNumber(transactions.length)} payments on this page`
        }
      />

      {!summary.ok ? (
        <SectionError title="Could not load the revenue total" result={summary} />
      ) : null}

      {transactions.length === 0 ? (
        <ListEmpty
          title="No payments yet"
          description="Successful Paystack payments appear here as soon as they settle."
        />
      ) : (
        <div className="flex flex-col gap-5">
          {transactions.map((transaction, index) => (
            <div
              key={transactionKey(transaction, index)}
              className="flex items-start justify-between gap-4 border-b border-border/40 pb-4 last:border-b-0"
            >
              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="truncate font-mono text-[13px] text-foreground/80">
                  {transaction.reference ?? "No reference"}
                </span>
                <span className="text-[13px] text-foreground/60">
                  {formatDateTime(transaction.paidAt ?? transaction.createdAt)}
                </span>
              </div>
              <span className="shrink-0 text-[15px] font-semibold text-foreground">
                {formatCurrency(
                  transactionAmount(transaction),
                  transaction.currency ?? currency
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      <CursorPager
        basePath={ROUTES.adminRevenue}
        pagination={page.data.pagination}
        params={params}
      />
    </div>
  )
}
