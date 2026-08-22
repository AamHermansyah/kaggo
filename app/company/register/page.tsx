"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RegisterCompanyPage() {
  const router = useRouter()
  const [formData, setFormData] = React.useState({
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    phoneNumber: "",
    createPassword: "",
    confirmPassword: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/company/submitted")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6"
    >
      {/* Title & Description */}
      <div className="mb-6 flex shrink-0 flex-col">
        <h2 className="mb-2 text-[22px] font-bold tracking-tight text-foreground">
          Register Your Logistics Company
        </h2>
        <p className="text-[13.5px] leading-relaxed font-normal text-foreground/70">
          Create your Kaggo company account to manage package batches and
          vehicle assignments.
        </p>
      </div>

      {/* Form Inputs */}
      <div className="mb-6 flex shrink-0 flex-col gap-3.5">
        <Input
          placeholder="Company Name"
          value={formData.companyName}
          onChange={(e) =>
            setFormData({ ...formData, companyName: e.target.value })
          }
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
        <Input
          placeholder="Company Address"
          value={formData.companyAddress}
          onChange={(e) =>
            setFormData({ ...formData, companyAddress: e.target.value })
          }
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
        <Input
          type="email"
          placeholder="Company Email"
          value={formData.companyEmail}
          onChange={(e) =>
            setFormData({ ...formData, companyEmail: e.target.value })
          }
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
        <Input
          type="tel"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
        <Input
          type="password"
          placeholder="Create Password"
          value={formData.createPassword}
          onChange={(e) =>
            setFormData({ ...formData, createPassword: e.target.value })
          }
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
      </div>

      <div className="flex-1"></div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="mt-auto h-13 w-full shrink-0 rounded-full bg-[#008967] text-[15px] font-semibold text-white shadow-none transition-transform hover:bg-[#007558] active:scale-98"
      >
        Create Company Account
      </Button>
    </form>
  )
}
