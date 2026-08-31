import { Clock } from "lucide-react"

import { SectionError } from "@/components/shared/section-error"
import { Skeleton } from "@/components/ui/skeleton"
import { getPaymentReceipt } from "@/lib/api/mobile"
import { loadRider } from "@/lib/api/guards"
import { formatCurrency, formatDateTime } from "@/lib/format"

/**
 * Payment receipt.
 *
 * Rendered inside a `DataBoundary`, so a failure here replaces this card only —
 * the "listing successful" message above it stays on screen.
 */
export async function ReceiptPanel({
  riderId,
  shipmentId,
}: {
  riderId: string
  shipmentId: string
}) {
  const result = await loadRider(() => getPaymentReceipt(riderId, shipmentId))

  if (!result.ok) {
    // 404 simply means Paystack's webhook has not landed yet — not a failure.
    if (result.code === "NOT_FOUND") {
      return (
        <div className="flex w-full items-center gap-3 rounded-[16px] bg-secondary px-5 py-4 text-start">
          <Clock className="size-4.5 shrink-0 stroke-[1.5] text-foreground/60" />
          <p className="text-[13px] leading-relaxed text-foreground/70">
            Your receipt is still being confirmed with the bank. Tracking is
            already active — refresh in a moment to see it.
          </p>
        </div>
      )
    }
    return <SectionError title="Could not load your receipt" result={result} />
  }

  const receipt = result.data
  const rows: Array<[string, string]> = [
    ["Item", receipt.itemName],
    ["Route", `${receipt.route.from} → ${receipt.route.to}`],
    ["Carrier", receipt.companyName],
    ["Amount", formatCurrency(receipt.amount, receipt.currency)],
    ["Reference", receipt.paymentReference],
    ["Paid", formatDateTime(receipt.paidAt)],
  ]

  return (
    <dl className="flex w-full flex-col gap-3 rounded-[16px] bg-secondary px-5 py-4 text-start">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-start justify-between gap-4">
          <dt className="shrink-0 text-[13px] text-foreground/60">{label}</dt>
          <dd className="text-end text-[13.5px] font-medium break-all text-foreground">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function ReceiptSkeleton() {
  return (
    <div className="flex w-full flex-col gap-3 rounded-[16px] bg-secondary px-5 py-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-28" />
        </div>
      ))}
    </div>
  )
}
