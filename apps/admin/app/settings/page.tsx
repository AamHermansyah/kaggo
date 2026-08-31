import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { DataBoundary } from "@/components/shared/data-boundary"
import { Button } from "@/components/ui/button"
import { isSuperAdmin, requireAdminToken } from "@/lib/auth/session"
import { ROUTES } from "@/lib/routes"
import {
  LocationsPanel,
  PricingPanel,
  SettingsSkeleton,
} from "./settings-panels"

export const metadata: Metadata = {
  title: "Settings",
  description: "Flat pricing per country and company drop-off locations.",
}

const DEFAULT_COUNTRY = "NG"

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SettingsPage({ searchParams }: Props) {

  const token = await requireAdminToken()
  const canEdit = await isSuperAdmin()
  const params = await searchParams

  const raw = Array.isArray(params.country) ? params.country[0] : params.country
  const country = /^[A-Za-z]{2}$/.test(raw ?? "")
    ? raw!.toUpperCase()
    : DEFAULT_COUNTRY

  return (
    <div className="flex flex-col gap-8 pt-2">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-[22px] font-semibold text-foreground">Settings</h1>
        <Button
          render={<Link href={ROUTES.adminHome} />}
          nativeButton={false}
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          <ArrowLeft data-icon="inline-start" />
          Dashboard
        </Button>
      </div>

      <section className="flex flex-col gap-4">
        <header className="flex flex-col gap-1">
          <h2 className="text-[17px] font-semibold text-foreground">
            Shipment pricing
          </h2>
          <p className="text-[13px] leading-relaxed text-foreground/65">
            One flat price per country. Saving clears the backend&rsquo;s
            5-minute pricing cache immediately.
          </p>
        </header>

        <DataBoundary title="Could not load pricing">
          <Suspense fallback={<SettingsSkeleton />}>
            <PricingPanel token={token} canEdit={canEdit} />
          </Suspense>
        </DataBoundary>
      </section>

      <section className="flex flex-col gap-4">
        <header className="flex flex-col gap-1">
          <h2 className="text-[17px] font-semibold text-foreground">
            Company locations
          </h2>
          <p className="text-[13px] leading-relaxed text-foreground/65">
            Drop-off points riders are pointed to near a destination.
          </p>
        </header>

        <DataBoundary title="Could not load company locations">
          <Suspense fallback={<SettingsSkeleton />}>
            <LocationsPanel token={token} country={country} />
          </Suspense>
        </DataBoundary>
      </section>
    </div>
  )
}
