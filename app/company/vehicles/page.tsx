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
    <div className="flex flex-col flex-1 px-5 pt-4 pb-6 relative overflow-x-hidden overflow-y-auto">
      {/* Top Search & Add Vehicle Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 shrink-0">
        <div className="relative flex-1 max-w-37.5">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-full border text-[13.5px] bg-transparent outline-none focus:border-[#008967]"
          />
        </div>

        <Link
          href="/company/vehicles/onboarding"
          className="text-[#008967] text-[13.5px] font-semibold hover:underline active:opacity-70 transition-opacity shrink-0"
        >
          Add New Vehicle
        </Link>
      </div>

      {/* Available Count */}
      <p className="text-[13.5px] text-foreground/75 font-medium mb-6 shrink-0">
        127 vehicles available
      </p>

      {/* Vehicle Items List */}
      <div className="flex flex-col gap-6 shrink-0">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="flex justify-between items-start pb-2 border-b border-border/30">
            {/* Left Details */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[15px] font-medium text-foreground">
                {vehicle.driverName}
              </span>
              <span className="text-[13.5px] text-foreground/80 font-normal">
                {vehicle.model}
              </span>
              <div className="flex items-center gap-1 text-[13px] text-foreground/70">
                <span>Device ID:</span>
              </div>
            </div>

            {/* Right Details */}
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-[14px] text-foreground/90 font-normal">
                {vehicle.phone}
              </span>
              <span className="text-[14px] text-[#008967] font-semibold">
                {vehicle.plateNumber}
              </span>
              <span className="text-[13px] text-foreground/90 font-medium">
                {vehicle.deviceId}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
