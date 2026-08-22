import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/routes"

export const metadata: Metadata = {
  title: "Application submitted",
  robots: { index: false, follow: false },
}

export default function ApplicationSubmittedPage() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-between overflow-x-hidden overflow-y-auto px-5 pt-12 pb-6">
      <div className="my-auto flex max-w-80 flex-1 flex-col items-center justify-center text-center">
        <div className="mb-6 flex size-19 items-center justify-center rounded-full bg-primary shadow-md">
          <Check className="size-10 stroke-[2.5] text-primary-foreground" />
        </div>

        <h1 className="mb-3 text-center text-[24px] font-bold tracking-tight text-foreground">
          Application Submitted
        </h1>

        <p className="text-center text-[14px] leading-relaxed text-foreground/75">
          Your logistics company account has been submitted for approval. You
          will receive access once your account is approved.
        </p>
      </div>

      <Button
        render={<Link href={ROUTES.companyLogin} />}
        nativeButton={false}
        size="lg"
        className="mt-auto h-13 w-full shrink-0 rounded-full text-[15px] font-semibold"
      >
        Go to login
      </Button>
    </div>
  )
}
