import type { Metadata } from "next"
import { notFound, redirect, unstable_rethrow } from "next/navigation"

import { RefreshError } from "@/components/shared/refresh-error"
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
export default async function PaymentPage({
  params,
}: PageProps<"/payment/[shipmentId]">) {
  const { shipmentId } = await params

  const parsed = shipmentIdSchema.safeParse(shipmentId)
  if (!parsed.success) notFound()

  const rider = await requireRider()

  const callbackUrl = absoluteUrl(
    `${ROUTES.paymentCallback}?shipment=${encodeURIComponent(parsed.data)}`,
    env.NEXT_PUBLIC_SITE_URL
  )

  let authorizationUrl: string | null = null
  let problem: string | null = null

  try {
    const init = await initializePayment(rider.userId, parsed.data, callbackUrl)
    authorizationUrl = init.authorizationUrl
  } catch (error) {
    unstable_rethrow(error)

    // 409 means the shipment already moved past PENDING_PAYMENT.
    if (isApiError(error) && error.status === 409) {
      redirect(ROUTES.track)
    }
    if (isApiError(error) && error.status === 403) {
      problem = "Only the sender of this parcel can pay for it."
    } else {
      problem = toUserMessage(error)
    }
  }

  if (authorizationUrl) redirect(authorizationUrl)

  return (
    <div className="flex flex-1 flex-col justify-center px-5 py-10">
      <RefreshError
        title="We could not start the payment"
        description={problem ?? undefined}
      />
    </div>
  )
}
