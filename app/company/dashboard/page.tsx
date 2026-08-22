import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function CompanyDashboardPage() {
  return (
    <div className="flex flex-col flex-1 px-5 pt-6 pb-6 relative overflow-x-hidden overflow-y-auto">
      {/* Company Info */}
      <div className="flex flex-col mb-6 shrink-0">
        <h2 className="text-[20px] font-bold text-foreground tracking-tight">
          AKTC Transport LTD
        </h2>
        <p className="text-[14px] text-foreground/70 mt-1 font-medium">
          Company Code: <span className="text-[#008967] font-semibold">125546</span>
        </p>
      </div>

      {/* Stats Summary Card */}
      <div className="bg-[#f4fbf7] dark:bg-primary/10 border border-[#008967]/15 rounded-2xl p-5 mb-8 grid grid-cols-4 text-center shrink-0">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[18px] font-bold text-foreground">389</span>
          <span className="text-[12px] text-foreground/75 font-medium">Packages</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-l border-border/30">
          <span className="text-[18px] font-bold text-foreground">4</span>
          <span className="text-[12px] text-foreground/75 font-medium">Batches</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-l border-border/30">
          <span className="text-[18px] font-bold text-foreground">6</span>
          <span className="text-[12px] text-foreground/75 font-medium">Journey</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-l border-border/30">
          <span className="text-[18px] font-bold text-foreground">3</span>
          <span className="text-[12px] text-foreground/75 font-medium">Completed</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-4 mb-8 shrink-0">
        <h3 className="text-[17px] font-bold text-foreground tracking-tight">
          Quick Actions
        </h3>

        {/* Action 1: Batch Manager */}
        <Link
          href="/company/batches"
          className="bg-card border border-border/70 rounded-2xl p-5 flex items-center justify-between hover:border-[#008967]/60 active:scale-99 transition-all shadow-xs"
        >
          <div className="flex flex-col">
            <span className="text-[16px] font-semibold text-[#008967] mb-1">
              Batch Manager
            </span>
            <span className="text-[13px] text-foreground/70 font-normal">
              10 Active Today
            </span>
          </div>
          <div className="size-9 rounded-full bg-[#f4fbf7] dark:bg-primary/20 flex items-center justify-center text-[#008967]">
            <ArrowRight className="size-4 stroke-2" />
          </div>
        </Link>

        {/* Action 2: Manage Vehicles */}
        <Link
          href="/company/vehicles"
          className="bg-card border border-border/70 rounded-2xl p-5 flex items-center justify-between hover:border-[#008967]/60 active:scale-99 transition-all shadow-xs"
        >
          <div className="flex flex-col">
            <span className="text-[16px] font-semibold text-[#008967] mb-1">
              Manage Vehicles
            </span>
            <span className="text-[13px] text-foreground/70 font-normal">
              127 Registered
            </span>
          </div>
          <div className="size-9 rounded-full bg-[#f4fbf7] dark:bg-primary/20 flex items-center justify-center text-[#008967]">
            <ArrowRight className="size-4 stroke-2" />
          </div>
        </Link>
      </div>

      <div className="flex-1"></div>

      {/* Footer Support Link */}
      <div className="flex justify-center mt-auto pt-4 pb-2 shrink-0">
        <button type="button" className="text-[#008967] text-[14px] font-medium hover:underline active:opacity-70 transition-opacity">
          Contact Support
        </button>
      </div>
    </div>
  )
}
