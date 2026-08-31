import type { Metadata } from "next"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { safeInternalPath } from "@/lib/navigation"
import { ROUTES } from "@/lib/routes"
import { CompanyLoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Company login",
  description: "Sign in to the MyKaggo logistics company portal.",
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CompanyLoginPage({ searchParams }: Props) {

  const params = await searchParams
  const nextPath = safeInternalPath(
    typeof params.next === "string" ? params.next : undefined,
    ROUTES.companyDashboard
  )

  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-8 pb-6">
      <h1 className="mb-8 shrink-0 text-[20px] font-bold tracking-tight text-foreground">
        Login to your company account
      </h1>

      {params.expired ? (
        <Alert className="mb-6 shrink-0">
          <AlertDescription>
            Your session expired. Please sign in again.
          </AlertDescription>
        </Alert>
      ) : null}

      <CompanyLoginForm nextPath={nextPath} />
    </div>
  )
}
