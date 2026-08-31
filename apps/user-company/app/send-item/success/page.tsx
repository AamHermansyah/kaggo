import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"

import { DataBoundary } from "@/components/shared/data-boundary"
import { Button } from "@/components/ui/button"
import { requireRider } from "@/lib/auth/session"
import { ROUTES } from "@/lib/routes"
import { shipmentIdSchema } from "@/lib/validation/schemas/rider"
import { ReceiptPanel, ReceiptSkeleton } from "./receipt-panel"

export const metadata: Metadata = {
  title: "Listing successful",
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SendItemSuccessPage({ searchParams }: Props) {

  const rider = await requireRider()
  const params = await searchParams

  const raw = Array.isArray(params.shipment) ? params.shipment[0] : params.shipment
  const parsed = shipmentIdSchema.safeParse(raw)

  return (
    <div className="relative flex flex-1 flex-col items-center gap-6 px-5 pt-10 pb-6">
      <div className="flex size-18 items-center justify-center rounded-full bg-primary">
        <Check className="size-10 stroke-[2.5] text-primary-foreground" />
      </div>

      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-[26px] leading-snug font-semibold text-foreground">
          Package listing
          <br />
          successful!
        </h1>
        <p className="max-w-70 text-[15px] text-muted-foreground">
          Receiver can now track this package with their phone number.
        </p>
      </div>

      {parsed.success ? (
        <DataBoundary
          title="Could not load your receipt"
          description="The listing itself went through. Retry to fetch the payment details."
        >
          <Suspense fallback={<ReceiptSkeleton />}>
            <ReceiptPanel riderId={rider.userId} shipmentId={parsed.data} />
          </Suspense>
        </DataBoundary>
      ) : null}

      <div className="mt-auto flex w-full shrink-0 flex-col gap-3">
        <Button
          render={<Link href={ROUTES.track} />}
          nativeButton={false}
          size="lg"
          className="h-13 w-full rounded-full text-[15px] font-semibold"
        >
          Track this package
        </Button>
        <Button
          render={<Link href={ROUTES.sendItem} />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="h-13 w-full rounded-full text-[15px] font-medium"
        >
          List another item
        </Button>
      </div>
    </div>
  )
}
