import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { requireAdminToken } from "@/lib/auth/session"
import { ROUTES } from "@/lib/routes"

export const metadata: Metadata = {
  title: "Vehicle onboarded",
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function OnboardingSuccessPage({ searchParams }: Props) {

  await requireAdminToken()

  const params = await searchParams
  const raw = Array.isArray(params.plate) ? params.plate[0] : params.plate
  const plate = typeof raw === "string" ? raw.slice(0, 20) : null

  return (
    <div className="relative flex flex-1 flex-col items-center px-5 pt-12 pb-6">
      <div className="my-auto flex max-w-80 flex-1 flex-col items-center justify-center text-center">
        <div className="mb-6 flex size-18 items-center justify-center rounded-full bg-primary">
          <Check className="size-10 stroke-[2.5] text-primary-foreground" />
        </div>

        <h1 className="mb-3 text-center text-[26px] leading-snug font-semibold text-foreground">
          Vehicle onboarding
          <br />
          successful!
        </h1>

        <p className="max-w-70 text-center text-[15px] text-muted-foreground">
          {plate ? (
            <>
              <span className="font-semibold text-foreground">{plate}</span> is
              now available on MyKaggo.
            </>
          ) : (
            "This vehicle is now available on MyKaggo."
          )}
        </p>
      </div>

      <div className="mt-auto flex w-full shrink-0 flex-col gap-3">
        <Button
          render={<Link href={ROUTES.adminVehicles} />}
          nativeButton={false}
          size="lg"
          className="h-13 w-full rounded-full text-[15px] font-semibold"
        >
          View vehicles
        </Button>
        <Button
          render={<Link href={ROUTES.vehicleOnboarding} />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="h-13 w-full rounded-full text-[15px] font-medium"
        >
          Onboard another
        </Button>
      </div>
    </div>
  )
}
