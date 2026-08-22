"use client"

import * as React from "react"
import Link from "next/link"
import { Search } from "lucide-react"

interface Vehicle {
  id: string
  driverName: string
  phone: string
  model: string
  plateNumber: string
  deviceId: string
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    driverName: "Ademola James",
    phone: "08030987654",
    model: "Toyota Hiace, White",
    plateNumber: "ABC 456 VX",
    deviceId: "9012345689",
  },
  {
    id: "2",
    driverName: "Ademola James",
    phone: "08030987654",
    model: "Toyota Hiace, White",
    plateNumber: "ABC 456 VX",
    deviceId: "9012345689",
  },
  {
    id: "3",
    driverName: "Ademola James",
    phone: "08030987654",
    model: "Toyota Hiace, White",
    plateNumber: "ABC 456 VX",
    deviceId: "9012345689",
  },
  {
    id: "4",
    driverName: "Ademola James",
    phone: "08030987654",
    model: "Toyota Hiace, White",
    plateNumber: "ABC 456 VX",
    deviceId: "9012345689",
  },
]

export default function CompanyVehiclesPage() {
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredVehicles = mockVehicles.filter(
    (v) =>
      v.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.phone.includes(searchQuery)
  )

  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-4 pb-6">
      {/* Top Search & Add Vehicle Bar */}
      <div className="mb-6 flex shrink-0 items-center justify-between gap-4">
        <div className="relative max-w-37.5 flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-full border bg-transparent pr-3 pl-9 text-[13.5px] outline-none focus:border-[#008967]"
          />
        </div>

        <Link
          href="/company/vehicles/onboarding"
          className="shrink-0 text-[13.5px] font-semibold text-[#008967] transition-opacity hover:underline active:opacity-70"
        >
          Add New Vehicle
        </Link>
      </div>

      {/* Available Count */}
      <p className="mb-6 shrink-0 text-[13.5px] font-medium text-foreground/75">
        127 vehicles available
      </p>

      {/* Vehicle Items List */}
      <div className="flex shrink-0 flex-col gap-6">
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="flex items-start justify-between border-b border-border/30 pb-2"
          >
            {/* Left Details */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[15px] font-medium text-foreground">
                {vehicle.driverName}
              </span>
              <span className="text-[13.5px] font-normal text-foreground/80">
                {vehicle.model}
              </span>
              <div className="flex items-center gap-1 text-[13px] text-foreground/70">
                <span>Device ID:</span>
              </div>
            </div>

            {/* Right Details */}
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-[14px] font-normal text-foreground/90">
                {vehicle.phone}
              </span>
              <span className="text-[14px] font-semibold text-[#008967]">
                {vehicle.plateNumber}
              </span>
              <span className="text-[13px] font-medium text-foreground/90">
                {vehicle.deviceId}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
