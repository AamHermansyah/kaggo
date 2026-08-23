import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, LogOut } from "lucide-react"

import { DataBoundary } from "@/components/shared/data-boundary"
import { SupportLink } from "@/components/shared/support-link"
import { Button } from "@/components/ui/button"
import { requireCompanyToken } from "@/lib/auth/session"
import { ROUTES } from "@/lib/routes"
import { companyLogoutAction } from "../actions"
import {
  CompanyOverviewPanel,
  CompanyOverviewSkeleton,
} from "./overview-panel"

export const metadata: Metadata = {
  title: "Company dashboard",
  description: "Manage your batches and vehicles on MyKaggo.",
  robots: { index: false, follow: false },
}

const QUICK_ACTIONS = [
  {
    href: ROUTES.companyBatches,
    title: "Batch Manager",
    description: "Group packages into journeys and assign drivers",
  },
  {
    href: ROUTES.companyVehicles,
    title: "Manage Vehicles",
    description: "Your registered fleet and MyKaggo devices",
  },
]

export default async function CompanyDashboardPage() {
  const token = await requireCompanyToken()

  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6">
      <DataBoundary
        title="Could not load your company summary"
        description="The company service did not respond. Your quick actions below still work."
      >
        <Suspense fallback={<CompanyOverviewSkeleton />}>
          <CompanyOverviewPanel token={token} />
        </Suspense>
      </DataBoundary>

      <div className="mb-8 flex shrink-0 flex-col gap-4">
        <h2 className="text-[17px] font-bold tracking-tight text-foreground">
          Quick Actions
        </h2>

        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:border-primary/60 active:scale-99"
          >
            <span className="flex min-w-0 flex-col">
              <span className="mb-1 text-[16px] font-semibold text-primary">
                {action.title}
              </span>
              <span className="text-[13px] font-normal text-foreground/70">
                {action.description}
              </span>
            </span>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <ArrowRight className="size-4 stroke-2" />
            </span>
          </Link>
        ))}
      </div>

      <div className="flex-1" />

      <div className="mt-auto flex shrink-0 flex-col items-center gap-4 pt-4">
        <SupportLink />
        <form action={companyLogoutAction}>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            <LogOut data-icon="inline-start" />
            Sign out
          </Button>
        </form>
      </div>
    </div>
  )
}
