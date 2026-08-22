import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function CompanyDashboardPage() {
  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6">
      {/* Company Info */}
      <div className="mb-6 flex shrink-0 flex-col">
        <h2 className="text-[20px] font-bold tracking-tight text-foreground">
          AKTC Transport LTD
        </h2>
        <p className="mt-1 text-[14px] font-medium text-foreground/70">
          Company Code:{" "}
          <span className="font-semibold text-[#008967]">125546</span>
        </p>
      </div>

      {/* Stats Summary Card */}
      <div className="mb-8 grid shrink-0 grid-cols-4 rounded-2xl border border-[#008967]/15 bg-[#f4fbf7] p-5 text-center dark:bg-primary/10">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[18px] font-bold text-foreground">389</span>
          <span className="text-[12px] font-medium text-foreground/75">
            Packages
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 border-l border-border/30">
          <span className="text-[18px] font-bold text-foreground">4</span>
          <span className="text-[12px] font-medium text-foreground/75">
            Batches
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 border-l border-border/30">
          <span className="text-[18px] font-bold text-foreground">6</span>
          <span className="text-[12px] font-medium text-foreground/75">
            Journey
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 border-l border-border/30">
          <span className="text-[18px] font-bold text-foreground">3</span>
          <span className="text-[12px] font-medium text-foreground/75">
            Completed
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex shrink-0 flex-col gap-4">
        <h3 className="text-[17px] font-bold tracking-tight text-foreground">
          Quick Actions
        </h3>

        {/* Action 1: Batch Manager */}
        <Link
          href="/company/batches"
          className="flex items-center justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:border-[#008967]/60 active:scale-99"
        >
          <div className="flex flex-col">
            <span className="mb-1 text-[16px] font-semibold text-[#008967]">
              Batch Manager
            </span>
            <span className="text-[13px] font-normal text-foreground/70">
              10 Active Today
            </span>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-[#f4fbf7] text-[#008967] dark:bg-primary/20">
            <ArrowRight className="size-4 stroke-2" />
          </div>
        </Link>

        {/* Action 2: Manage Vehicles */}
        <Link
          href="/company/vehicles"
          className="flex items-center justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:border-[#008967]/60 active:scale-99"
        >
          <div className="flex flex-col">
            <span className="mb-1 text-[16px] font-semibold text-[#008967]">
              Manage Vehicles
            </span>
            <span className="text-[13px] font-normal text-foreground/70">
              127 Registered
            </span>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-[#f4fbf7] text-[#008967] dark:bg-primary/20">
            <ArrowRight className="size-4 stroke-2" />
          </div>
        </Link>
      </div>

      <div className="flex-1"></div>

      {/* Footer Support Link */}
      <div className="mt-auto flex shrink-0 justify-center pt-4 pb-2">
        <button
          type="button"
          className="text-[14px] font-medium text-[#008967] transition-opacity hover:underline active:opacity-70"
        >
          Contact Support
        </button>
      </div>
    </div>
  )
}
