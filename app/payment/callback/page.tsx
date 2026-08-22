import type { Metadata } from "next"
import Link from "next/link"
import { redirect, unstable_rethrow } from "next/navigation"
import { XCircle } from "lucide-react"

import { RefreshError } from "@/components/shared/refresh-error"
import { Button } from "@/components/ui/button"
import { toUserMessage } from "@/lib/api/errors"
import { verifyPayment } from "@/lib/api/mobile"
import { requireRider } from "@/lib/auth/session"
import { ROUTES } from "@/lib/routes"
import { paymentCallbackSchema } from "@/lib/validation/schemas/rider"

export const metadata: Metadata = {
  title: "Confirming payment",
  robots: { index: false, follow: false },
}

/**
 * Where Paystack returns the rider.
 *
 * Verification is belt-and-braces: Paystack's webhook already activates the
 * shipment server-to-server, but calling `verify-payment` here makes the UI
 * update immediately instead of waiting on the webhook. The endpoint is
 * idempotent, so both paths running is fine.
 *
 * The rider cookie is `SameSite=Lax` precisely so it survives this cross-site
 * return navigation.
 */
export default async function PaymentCallbackPage({
  searchParams,
}: PageProps<"/payment/callback">) {
  const params = await searchParams

  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value

  const parsed = paymentCallbackSchema.safeParse({
    shipmentId: first(params.shipment),
    // Paystack sends both `reference` and `trxref`; they carry the same value.
    reference: first(params.reference) ?? first(params.trxref),
  })

  if (!parsed.success) {
    return (
      <PaymentProblem
        title="We could not read that payment link"
        description="The reference is missing or malformed. Check your parcels — if the payment went through, tracking is already active."
      />
    )
  }

  const rider = await requireRider()

  let failureMessage: string | null = null

  try {
    const result = await verifyPayment(
      rider.userId,
      parsed.data.shipmentId,
      parsed.data.reference
    )

    if (result.outcome === "success" || result.outcome === "already_processed") {
      redirect(`${ROUTES.sendItemSuccess}?shipment=${result.shipmentId}`)
    }

    failureMessage =
      "Paystack reported that the payment did not go through. Nothing was charged — you can try again."
  } catch (error) {
    unstable_rethrow(error)
    return (
      <div className="flex flex-1 flex-col justify-center px-5 py-10">
        <RefreshError
          title="We could not confirm your payment"
          description={toUserMessage(error)}
        />
      </div>
    )
  }

  return (
    <PaymentProblem
      title="Payment not completed"
      description={failureMessage}
      retryHref={ROUTES.payment(parsed.data.shipmentId)}
    />
  )
}

function PaymentProblem({
  title,
  description,
  retryHref,
}: {
  title: string
  description: string | null
  retryHref?: string
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <div className="flex size-19 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <XCircle className="size-10 stroke-[1.5]" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-[24px] font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="max-w-80 text-[14px] leading-relaxed text-foreground/70">
            {description}
          </p>
        ) : null}
      </div>

      <div className="flex w-full max-w-80 flex-col gap-3">
        {retryHref ? (
          <Button
            render={<Link href={retryHref} />}
            nativeButton={false}
            size="lg"
            className="w-full rounded-full"
          >
            Try payment again
          </Button>
        ) : null}
        <Button
          render={<Link href={ROUTES.track} />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="w-full rounded-full"
        >
          View my parcels
        </Button>
      </div>
    </div>
  )
}
