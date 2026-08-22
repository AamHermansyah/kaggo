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
      className="flex flex-col flex-1 px-5 pt-6 pb-6 relative overflow-x-hidden overflow-y-auto"
    >
      {/* Title & Description */}
      <div className="flex flex-col mb-6 shrink-0">
        <h2 className="text-[22px] font-bold text-foreground tracking-tight mb-2">
          Register Your Logistics Company
        </h2>
        <p className="text-[13.5px] text-foreground/70 leading-relaxed font-normal">
          Create your Kaggo company account to manage package batches and vehicle assignments.
        </p>
      </div>

      {/* Form Inputs */}
      <div className="flex flex-col gap-3.5 mb-6 shrink-0">
        <Input
          placeholder="Company Name"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
        <Input
          placeholder="Company Address"
          value={formData.companyAddress}
          onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
        <Input
          type="email"
          placeholder="Company Email"
          value={formData.companyEmail}
          onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
        <Input
          type="tel"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
        <Input
          type="password"
          placeholder="Create Password"
          value={formData.createPassword}
          onChange={(e) => setFormData({ ...formData, createPassword: e.target.value })}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
      </div>

      <div className="flex-1"></div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full h-13 text-[15px] font-semibold bg-[#008967] hover:bg-[#007558] text-white active:scale-98 transition-transform shadow-none mt-auto shrink-0"
      >
        Create Company Account
      </Button>
    </form>
  )
}
