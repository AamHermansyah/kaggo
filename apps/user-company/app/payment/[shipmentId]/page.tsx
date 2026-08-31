import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect, unstable_rethrow } from "next/navigation"
import { Smartphone } from "lucide-react"

import { RefreshError } from "@/components/shared/refresh-error"
import { Button } from "@/components/ui/button"
import { isApiError, toUserMessage } from "@/lib/api/errors"
import { initializePayment } from "@/lib/api/mobile"
import { requireRider } from "@/lib/auth/session"
import { env } from "@/lib/env"
import { absoluteUrl } from "@/lib/navigation"
import { ROUTES } from "@/lib/routes"
import { shipmentIdSchema } from "@/lib/validation/schemas/rider"

export const metadata: Metadata = {
  title: "Payment",
  description: "Complete payment to activate tracking for your parcel.",
  robots: { index: false, follow: false },
}

/**
 * Hands the rider over to Paystack.
 *
 * `POST /shipments/{id}/pay` is idempotent — calling it again returns the
 * existing pending attempt's URL — so a refresh here cannot double-charge.
 *
 * The callback origin comes from `NEXT_PUBLIC_SITE_URL` rather than the `Host`
 * header: the header is attacker-controlled, and it is what decides where the
 * rider lands after paying.
 */
interface Props {
  params: Promise<{ shipmentId: string }>
}

export default async function PaymentPage({ params }: Props) {

  const { shipmentId } = await params

  const parsed = shipmentIdSchema.safeParse(shipmentId)
  if (!parsed.success) notFound()

  const rider = await requireRider()

  const callbackUrl = absoluteUrl(
    `${ROUTES.paymentCallback}?shipment=${encodeURIComponent(parsed.data)}`,
    env.NEXT_PUBLIC_SITE_URL
  )

  let authorizationUrl: string | null = null
  let razorpayReference: string | null = null
  let problem: string | null = null

  try {
    const init = await initializePayment(rider.userId, parsed.data, callbackUrl)

    // v1.1: the response shape depends on the gateway the backend picked from
    // the sender's country. Only Paystack has a hosted checkout page.
    if (init.provider === "PAYSTACK") {
      authorizationUrl = init.authorizationUrl
    } else {
      razorpayReference = init.razorpayOrderId
    }
  } catch (error) {
    unstable_rethrow(error)

    // 409 means the shipment already moved past PENDING_PAYMENT.
    if (isApiError(error) && error.status === 409) {
      redirect(ROUTES.track)
    }
    if (isApiError(error) && error.status === 403) {
      problem = "Only the sender or receiver of this parcel can pay for it."
    } else {
      problem = toUserMessage(error)
    }
  }

  if (authorizationUrl) redirect(authorizationUrl)

  /**
   * Razorpay has no checkout URL — it is driven by a client-side SDK loaded
   * from checkout.razorpay.com, which this app's Content-Security-Policy does
   * not allow. Saying so beats redirecting nowhere. The order is created and
   * payable from the mobile app; the webhook settles it either way.
   */
  if (razorpayReference) {
    return (
      <RazorpayNotice reference={razorpayReference} />
    )
  }

  return (
    <div className="flex flex-1 flex-col justify-center px-5 py-10">
      <RefreshError
        title="We could not start the payment"
        description={problem ?? undefined}
      />
    </div>
  )
}

/**
 * Shown when the backend routed this shipment to Razorpay.
 *
 * Enabling it in the browser means loading Razorpay's Checkout SDK, which
 * needs `script-src`/`frame-src`/`connect-src` opened up to their domains in
 * next.config.ts. That is a deliberate security decision, so it is not done
 * silently — see .documentations/README-INTEGRATION.md.
 */
function RazorpayNotice({ reference }: { reference: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <div className="flex size-19 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Smartphone className="size-10 stroke-[1.5]" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">
          Finish this payment in the app
        </h1>
        <p className="max-w-80 text-[14px] leading-relaxed text-foreground/70">
          Your order is reserved. Payments for your region are handled by
          Razorpay, which completes checkout inside the MyKaggo mobile app
          rather than the browser.
        </p>
        <p className="mt-1 font-mono text-[12px] break-all text-foreground/45">
          Order: {reference}
        </p>
      </div>

      <div className="flex w-full max-w-80 flex-col gap-3">
        <Button
          render={<Link href={ROUTES.track} />}
          nativeButton={false}
          size="lg"
          className="h-13 w-full rounded-full text-[15px] font-semibold"
        >
          View my parcels
        </Button>
      </div>
    </div>
  )
}
