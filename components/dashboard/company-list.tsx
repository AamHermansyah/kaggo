"use client"

import * as React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Company {
  id: string
  name: string
  phone: string
  vehicles: string
  code: string
  completed: string
  status?: "pending" | "approved" | "rejected" | "suspended"
}

const initialCompanies: Company[] = [
  {
    id: "1",
    name: "AKTC Transport Company Aba",
    phone: "08030987654",
    vehicles: "21 Vehicles",
    code: "100893",
    completed: "0 Completed",
  },
  {
    id: "2",
    name: "AKTC Transport Company Aba",
    phone: "08030987654",
    vehicles: "21 Vehicles",
    code: "100893",
    completed: "0 Completed",
  },
  {
    id: "3",
    name: "AKTC Transport Company Aba",
    phone: "08030987654",
    vehicles: "21 Vehicles",
    code: "100893",
    completed: "0 Completed",
  },
]

export function CompanyList() {
  const [companies, setCompanies] = React.useState<Company[]>(initialCompanies)
  const [expandedId, setExpandedId] = React.useState<string | null>("3")

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const handleAction = (
    companyId: string,
    actionName: "Approve" | "Reject" | "Suspend"
  ) => {
    const company = companies.find((c) => c.id === companyId)
    const companyName = company ? company.name : "Company"

    if (actionName === "Approve") {
      toast.success(`${companyName} has been approved.`)
    } else if (actionName === "Reject") {
      toast.error(`${companyName} has been rejected.`)
    } else if (actionName === "Suspend") {
      toast.warning(`${companyName} has been suspended.`)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div className="flex flex-col">
        <h2 className="text-[22px] font-semibold text-foreground">Companies</h2>
        <p className="mt-1 text-[15px] text-foreground/80">15,231</p>
      </div>

      {/* Company List */}
      <div className="flex flex-col gap-6">
        {companies.map((company) => {
          const isExpanded = expandedId === company.id

          return (
            <div key={company.id} className="flex flex-col pb-1">
              <div className="flex items-start justify-between">
                {/* Left details */}
                <div className="flex flex-col gap-2">
                  <span className="text-[15px] leading-tight font-medium text-foreground">
                    {company.name}
                  </span>
                  <span className="text-[14px] leading-tight text-foreground/80">
                    {company.phone}
                  </span>
                  <span className="text-[14px] leading-tight text-foreground/80">
                    {company.vehicles}
                  </span>
                </div>

                {/* Right details & toggle */}
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[14px] leading-tight font-medium text-foreground/90">
                    {company.code}
                  </span>
                  <span className="text-[14px] leading-tight text-foreground/80">
                    {company.completed}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleExpand(company.id)}
                    className="mt-0.5 flex size-5 items-center justify-center rounded-full border border-[#008967] text-[#008967] transition-colors hover:bg-[#008967]/10"
                    aria-label={
                      isExpanded
                        ? "Collapse company actions"
                        : "Expand company actions"
                    }
                  >
                    {isExpanded ? (
                      <ChevronUp className="size-3.5 stroke-[2.5]" />
                    ) : (
                      <ChevronDown className="size-3.5 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expandable Action Box */}
              {isExpanded && (
                <div className="mt-3 flex animate-in items-center justify-end gap-6 rounded-xl border border-[#008967]/20 bg-[#f4fbf7] px-5 py-3.5 transition-all duration-200 fade-in-50 dark:bg-primary/10">
                  <button
                    type="button"
                    onClick={() => handleAction(company.id, "Approve")}
                    className="text-[14px] font-medium text-[#008967] transition-opacity hover:underline active:opacity-70"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(company.id, "Reject")}
                    className="text-[14px] font-medium text-[#008967] transition-opacity hover:underline active:opacity-70"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(company.id, "Suspend")}
                    className="text-[14px] font-medium text-[#008967] transition-opacity hover:underline active:opacity-70"
                  >
                    Suspend
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
