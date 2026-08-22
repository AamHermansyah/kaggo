import type { Metadata } from "next"

import { CompanyRegisterForm } from "./register-form"

export const metadata: Metadata = {
  title: "Register your logistics company",
  description:
    "Create a Kaggo company account to manage package batches and vehicle assignments.",
  alternates: { canonical: "/company/register" },
  openGraph: {
    title: "Register your logistics company on Kaggo",
    description:
      "Create a Kaggo company account to manage package batches and vehicle assignments.",
    url: "/company/register",
  },
}

export default function CompanyRegisterPage() {
  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6">
      <div className="mb-6 flex shrink-0 flex-col">
        <h1 className="mb-2 text-[22px] font-bold tracking-tight text-foreground">
          Register Your Logistics Company
        </h1>
        <p className="text-[13.5px] leading-relaxed text-foreground/70">
          Create your Kaggo company account to manage package batches and
          vehicle assignments.
        </p>
      </div>

      <CompanyRegisterForm />
    </div>
  )
}
