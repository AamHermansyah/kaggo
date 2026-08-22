import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { getRiderSession } from "@/lib/auth/session"
import { safeInternalPath } from "@/lib/navigation"
import { ROUTES } from "@/lib/routes"
import { IdentifyForm } from "./identify-form"

export const metadata: Metadata = {
  title: "List an item",
  description:
    "Enter your phone number to start listing a parcel for tracking on Kaggo.",
  robots: { index: false, follow: false },
}

export default async function ListItemPage({
  searchParams,
}: PageProps<"/list-item">) {
  const params = await searchParams
  const nextPath = safeInternalPath(
    typeof params.next === "string" ? params.next : undefined,
    ROUTES.sendItem
  )

  // Already identified: skip straight to the listing form.
  const session = await getRiderSession()
  if (session) redirect(nextPath)

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden px-6 pt-10 pb-6">
      {params.expired ? (
        <Alert className="mb-6 shrink-0">
          <AlertDescription>
            We could not recognise your Kaggo identity any more. Enter your
            phone number to continue.
          </AlertDescription>
        </Alert>
      ) : null}

      <IdentifyForm
        nextPath={nextPath}
        startOnNewDevice={params.device === "new"}
      />
    </div>
  )
}
