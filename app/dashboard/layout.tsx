"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isShipments = pathname.includes("/dashboard/shipments")
  const isUsers = pathname.includes("/dashboard/users")
  const isVehicles = pathname.includes("/dashboard/vehicles")

  return (
    <div className="flex flex-col flex-1 px-5 pt-2 pb-6 relative overflow-x-hidden overflow-y-auto">

      {/* Search & Filter */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="relative flex-1 max-w-[140px]">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            className="w-full h-9 pl-9 pr-3 rounded-full border text-[14px] bg-transparent outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex items-center gap-3 text-[13px] font-medium shrink-0">
          <button className="text-[#008967]">Today</button>
          <button className="text-foreground/50">This Week</button>
          <button className="text-foreground/50">This Month</button>
        </div>
      </div>

      {/* Stats Summary / Links */}
      <div className="bg-[#f4fbf7] rounded-xl p-5 flex items-center justify-between mb-10 border border-[#008967]/10">

        {/* Shipments Link */}
        <Link
          href="/dashboard/shipments"
          className={cn(
            "flex flex-col items-center gap-1 transition-opacity",
            !isShipments && "opacity-50 hover:opacity-80"
          )}
        >
          <span className="text-[17px] font-bold text-foreground">23M+</span>
          <span className="text-[12px] text-foreground/80 font-medium">Shipment</span>
        </Link>

        {/* Users Link */}
        <Link
          href="/dashboard/users"
          className={cn(
            "flex flex-col items-center gap-1 transition-opacity",
            !isUsers && "opacity-50 hover:opacity-80"
          )}
        >
          <span className="text-[17px] font-bold text-foreground">100K</span>
          <span className="text-[12px] text-foreground/80 font-medium">Users</span>
        </Link>

        {/* Vehicles Link */}
        <Link
          href="/dashboard/vehicles"
          className={cn(
            "flex flex-col items-center gap-1 transition-opacity",
            !isVehicles && "opacity-50 hover:opacity-80"
          )}
        >
          <span className="text-[17px] font-bold text-foreground">15K</span>
          <span className="text-[12px] text-foreground/80 font-medium">Vehicles</span>
        </Link>

        {/* Revenue (Not a link, just stat) */}
        <div className="flex flex-col items-center gap-1 opacity-50">
          <span className="text-[17px] font-bold text-foreground">700M+</span>
          <span className="text-[12px] text-foreground/80 font-medium">Revenue</span>
        </div>

      </div>

      {/* Active Route Content */}
      <div className="flex-1">
        {children}
      </div>

    </div>
  )
}
