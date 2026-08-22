import type { Metadata } from "next"

import { RiderIdentityBar } from "@/components/shared/rider-identity-bar"
import { requireRider } from "@/lib/auth/session"
import { SendItemForm } from "./send-item-form"

export const metadata: Metadata = {
  title: "Send an item",
  description:
    "List a parcel for live tracking: choose the route, confirm the vehicle and pay.",
  robots: { index: false, follow: false },
}

export default async function SendItemPage() {
  const rider = await requireRider()

  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6">
      <RiderIdentityBar phoneNumber={rider.phoneNumber} className="mb-6" />
      <SendItemForm riderPhone={rider.phoneNumber} />
    </div>
  )
}
